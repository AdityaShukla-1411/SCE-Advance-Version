"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  BarChart3,
  Download,
  CheckCircle,
  AlertCircle,
  Code,
  Users,
  Clock,
  Shield,
  Zap,
  Target,
} from "lucide-react";

import FileUpload from "@/components/FileUpload";
import AnalysisResults from "@/components/AnalysisResults";
import LoadingAnimation from "@/components/LoadingAnimation";
import BulkUpload from "@/components/BulkUpload";

interface AnalysisResult {
  id: string;
  fileName: string;
  score: number;
  feedback: string;
  suggestions: string[];
  plagiarismCheck?: {
    similarity: number;
    matches: string[];
  };
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [analysisMode, setAnalysisMode] = useState<"individual" | "batch">(
    "individual"
  );

  const handleFileAnalysis = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);

    try {
      // Simulate analysis with realistic timing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newResults: AnalysisResult[] = files.map((file, index) => ({
        id: Date.now() + index,
        fileName: file.name,
        score: Math.floor(Math.random() * 40) + 60, // 60-100 range
        feedback: `Code analysis completed for ${file.name}. The code demonstrates good structure and follows most best practices.`,
        suggestions: [
          "Consider adding more comments for complex logic",
          "Implement error handling in critical sections",
          "Optimize algorithm efficiency where possible",
        ],
        plagiarismCheck: {
          similarity: Math.floor(Math.random() * 15) + 5, // 5-20% range
          matches: ["student_123.py", "reference_code.js"],
        },
      }));

      setResults((prev) => [...prev, ...newResults]);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleBulkAnalysis = useCallback(async (files: File[]) => {
    setIsAnalyzing(true);
    setAnalysisMode("batch");

    try {
      // Simulate bulk analysis
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const bulkResults: AnalysisResult[] = files.map((file, index) => ({
        id: `bulk_${Date.now()}_${index}`,
        fileName: file.name,
        score: Math.floor(Math.random() * 40) + 60,
        feedback: `Bulk analysis completed for ${file.name}`,
        suggestions: [
          "Code structure is acceptable",
          "Consider improving variable naming",
          "Add unit tests for better coverage",
        ],
        plagiarismCheck: {
          similarity: Math.floor(Math.random() * 25) + 5,
          matches: files
            .filter((_, i) => i !== index)
            .slice(0, 2)
            .map((f) => f.name),
        },
      }));

      setResults(bulkResults);
    } catch (error) {
      console.error("Bulk analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisMode("individual");
    }
  }, []);

  const exportToCSV = useCallback(() => {
    if (results.length === 0) return;

    const csvContent = [
      [
        "Name",
        "File Name",
        "File ID",
        "Score",
        "Plagiarism %",
        "Similar Files",
      ],
      ...results.map((result) => [
        result.fileName.split(".")[0], // Name from filename
        result.fileName,
        result.id,
        result.score,
        result.plagiarismCheck?.similarity || 0,
        result.plagiarismCheck?.matches.join("; ") || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis_results_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  SCE Advanced
                </h1>
                <p className="text-sm text-slate-600">
                  Professional Code Evaluator
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.div
                className="flex items-center space-x-2 text-sm text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Users className="h-4 w-4" />
                <span>University Edition</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Advanced Code Analysis
              <span className="block text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                for Educational Excellence
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Comprehensive code evaluation with plagiarism detection, bulk
              processing, and detailed analytics designed for university faculty
              and educational institutions.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              {
                icon: Zap,
                title: "Instant Analysis",
                desc: "Real-time code evaluation with detailed feedback",
              },
              {
                icon: Shield,
                title: "Plagiarism Detection",
                desc: "Advanced similarity checking across submissions",
              },
              {
                icon: Target,
                title: "Bulk Processing",
                desc: "Evaluate multiple assignments simultaneously",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200 card-shadow"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-slate-200">
              {[
                { key: "single", label: "Individual Analysis", icon: FileText },
                { key: "bulk", label: "Bulk Analysis", icon: BarChart3 },
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTab(key as "single" | "bulk")}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === key
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <LoadingAnimation mode={analysisMode} />
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "single" ? (
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <FileUpload onFileSelect={handleFileAnalysis} />
                    </div>
                    <div>
                      {results.length > 0 && (
                        <AnalysisResults
                          results={results}
                          onExportCSV={exportToCSV}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <BulkUpload onFilesSelect={handleBulkAnalysis} />
                    {results.length > 0 && (
                      <div className="mt-8">
                        <AnalysisResults
                          results={results}
                          onExportCSV={exportToCSV}
                          isBulkMode
                        />
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code className="h-6 w-6" />
              <span className="font-semibold">SCE Advanced</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Built for Education</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
