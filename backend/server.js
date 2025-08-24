const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { analyzeCode } = require("./services/codeAnalyzer");
const { detectPlagiarism } = require("./services/plagiarismDetector");
const { exportToCSV } = require("./services/csvExporter");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".py",
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".php",
      ".rb",
      ".go",
    ];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only code files are allowed."));
    }
  },
});

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "SCE Advanced Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Single file analysis
app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Analyze the code
    const analysis = await analyzeCode(fileContent, req.file.originalname);

    // Clean up uploaded file
    await fs.unlink(filePath);

    res.json({
      id: Date.now().toString(),
      fileName: req.file.originalname,
      score: analysis.score,
      feedback: analysis.feedback,
      suggestions: analysis.suggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Failed to analyze code" });
  }
});

// Bulk file analysis
app.post("/api/analyze/bulk", upload.array("files", 100), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];
    const fileContents = [];

    // Read all files
    for (const file of req.files) {
      try {
        const content = await fs.readFile(file.path, "utf-8");
        fileContents.push({
          name: file.originalname,
          content: content,
          path: file.path,
        });
      } catch (error) {
        console.error(`Error reading file ${file.originalname}:`, error);
      }
    }

    // Analyze each file and check for plagiarism
    for (let i = 0; i < fileContents.length; i++) {
      const file = fileContents[i];

      try {
        // Analyze code quality
        const analysis = await analyzeCode(file.content, file.name);

        // Check for plagiarism against other files
        const plagiarismResults = await detectPlagiarism(
          file.content,
          fileContents,
          i
        );

        results.push({
          id: `bulk_${Date.now()}_${i}`,
          fileName: file.name,
          score: analysis.score,
          feedback: analysis.feedback,
          suggestions: analysis.suggestions,
          plagiarismCheck: plagiarismResults,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Error analyzing file ${file.name}:`, error);
        results.push({
          id: `bulk_${Date.now()}_${i}`,
          fileName: file.name,
          score: 0,
          feedback: "Error occurred during analysis",
          suggestions: [],
          plagiarismCheck: { similarity: 0, matches: [] },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Clean up uploaded files
    for (const file of req.files) {
      try {
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error deleting file ${file.path}:`, error);
      }
    }

    res.json({ results });
  } catch (error) {
    console.error("Bulk analysis error:", error);
    res.status(500).json({ error: "Failed to perform bulk analysis" });
  }
});

// Export results to CSV
app.post("/api/export/csv", async (req, res) => {
  try {
    const { results } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: "Invalid results data" });
    }

    const csvData = await exportToCSV(results);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="analysis_results_${Date.now()}.csv"`
    );
    res.send(csvData);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Statistics endpoint
app.get("/api/stats", async (req, res) => {
  try {
    // This would typically fetch from a database
    // For now, returning mock statistics
    res.json({
      totalAnalyses: 1247,
      averageScore: 78.5,
      plagiarismDetected: 23,
      activeUsers: 45,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(PORT, () => {
  console.log(`SCE Advanced Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
