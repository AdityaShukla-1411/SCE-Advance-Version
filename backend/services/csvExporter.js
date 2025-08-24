const { stringify } = require("csv-stringify/sync");

/**
 * Exports analysis results to CSV format
 * @param {Array} results - Array of analysis results
 * @returns {Promise<string>} CSV data as string
 */
async function exportToCSV(results) {
  try {
    if (!results || !Array.isArray(results) || results.length === 0) {
      throw new Error("No results to export");
    }

    // Define CSV headers
    const headers = [
      "Student Name",
      "File Name",
      "File ID",
      "Score",
      "Grade",
      "Plagiarism Percentage",
      "Similar Files",
      "Feedback Summary",
      "Top Suggestion",
      "Analysis Date",
      "Risk Level",
    ];

    // Transform results into CSV rows
    const rows = results.map((result, index) => {
      const studentName = extractStudentName(result.fileName);
      const grade = scoreToGrade(result.score);
      const plagiarismPercentage = result.plagiarismCheck?.similarity || 0;
      const similarFiles = result.plagiarismCheck?.matches?.join("; ") || "";
      const feedbackSummary = truncateText(result.feedback, 100);
      const topSuggestion =
        result.suggestions && result.suggestions.length > 0
          ? truncateText(result.suggestions[0], 80)
          : "";
      const analysisDate = result.timestamp
        ? new Date(result.timestamp).toLocaleString()
        : new Date().toLocaleString();
      const riskLevel = calculateRiskLevel(result.score, plagiarismPercentage);

      return [
        studentName,
        result.fileName,
        result.id,
        result.score,
        grade,
        plagiarismPercentage,
        similarFiles,
        feedbackSummary,
        topSuggestion,
        analysisDate,
        riskLevel,
      ];
    });

    // Generate CSV content
    const csvContent = stringify([headers, ...rows], {
      header: false,
      quoted: true,
      quotedEmpty: true,
      quotedString: true,
    });

    return csvContent;
  } catch (error) {
    console.error("CSV export error:", error);
    throw new Error("Failed to generate CSV export");
  }
}

/**
 * Exports detailed plagiarism report to CSV
 * @param {Array} results - Array of analysis results
 * @returns {Promise<string>} Detailed CSV data
 */
async function exportDetailedPlagiarismCSV(results) {
  try {
    const headers = [
      "File Name",
      "Student Name",
      "File ID",
      "Overall Similarity %",
      "Matched Files Count",
      "Top Match File",
      "Top Match Similarity %",
      "Text Similarity %",
      "Structural Similarity %",
      "Token Similarity %",
      "Risk Assessment",
      "Recommended Action",
      "Analysis Date",
    ];

    const rows = results
      .filter(
        (result) =>
          result.plagiarismCheck && result.plagiarismCheck.similarity > 0
      )
      .map((result) => {
        const plagiarism = result.plagiarismCheck;
        const topMatch =
          plagiarism.details && plagiarism.details.length > 0
            ? plagiarism.details[0]
            : null;

        return [
          result.fileName,
          extractStudentName(result.fileName),
          result.id,
          plagiarism.similarity,
          plagiarism.matches.length,
          topMatch ? topMatch.fileName : "",
          topMatch ? topMatch.similarity : "",
          topMatch ? Math.round(topMatch.details.text * 100) : "",
          topMatch ? Math.round(topMatch.details.structure * 100) : "",
          topMatch ? Math.round(topMatch.details.tokens * 100) : "",
          assessPlagiarismRisk(plagiarism.similarity),
          recommendAction(plagiarism.similarity),
          result.timestamp
            ? new Date(result.timestamp).toLocaleString()
            : new Date().toLocaleString(),
        ];
      });

    return stringify([headers, ...rows], {
      header: false,
      quoted: true,
      quotedEmpty: true,
      quotedString: true,
    });
  } catch (error) {
    console.error("Detailed plagiarism CSV export error:", error);
    throw new Error("Failed to generate detailed plagiarism CSV");
  }
}

/**
 * Exports summary statistics to CSV
 * @param {Array} results - Array of analysis results
 * @returns {Promise<string>} Summary CSV data
 */
async function exportSummaryCSV(results) {
  try {
    const summary = generateSummaryStatistics(results);

    const summaryRows = [
      ["Metric", "Value", "Description"],
      [
        "Total Files Analyzed",
        summary.totalFiles,
        "Number of code files processed",
      ],
      [
        "Average Score",
        summary.averageScore,
        "Mean quality score across all files",
      ],
      [
        "Files with High Quality (80+)",
        summary.highQualityFiles,
        "Files scoring 80 or above",
      ],
      [
        "Files with Low Quality (<60)",
        summary.lowQualityFiles,
        "Files requiring significant improvement",
      ],
      [
        "Average Plagiarism %",
        summary.averagePlagiarism,
        "Mean similarity percentage",
      ],
      [
        "Files with High Similarity (>40%)",
        summary.highSimilarityFiles,
        "Files requiring plagiarism review",
      ],
      [
        "Files with Extreme Similarity (>70%)",
        summary.extremeSimilarityFiles,
        "Files with likely plagiarism",
      ],
      [
        "Most Common Issue",
        summary.topIssue,
        "Most frequently suggested improvement",
      ],
      [
        "Analysis Date",
        new Date().toLocaleString(),
        "When this report was generated",
      ],
    ];

    return stringify(summaryRows, {
      header: false,
      quoted: true,
      quotedEmpty: true,
      quotedString: true,
    });
  } catch (error) {
    console.error("Summary CSV export error:", error);
    throw new Error("Failed to generate summary CSV");
  }
}

/**
 * Extracts student name from filename
 * @param {string} fileName - The filename
 * @returns {string} Extracted student name
 */
function extractStudentName(fileName) {
  // Try to extract name from common filename patterns
  // Examples: "john_doe_assignment1.py", "assignment1_jane_smith.js", "123456_alice_cooper.cpp"

  // Remove file extension
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");

  // Split by common separators
  const parts = nameWithoutExt.split(/[_\-\s]+/);

  // Try to identify name patterns
  if (parts.length >= 2) {
    // Check if first part is a number (student ID)
    if (/^\d+$/.test(parts[0]) && parts.length >= 3) {
      return `${parts[1]} ${parts[2]}`;
    }
    // Check if last parts are names
    else if (parts.length >= 2) {
      const potentialNames = parts.filter(
        (part) =>
          !/^(assignment|hw|homework|project|lab|exercise|\d+)$/i.test(part)
      );
      if (potentialNames.length >= 2) {
        return potentialNames.slice(0, 2).join(" ");
      }
    }
  }

  // Fallback: use filename without extension
  return nameWithoutExt.replace(/[_\-]/g, " ");
}

/**
 * Converts numeric score to letter grade
 * @param {number} score - Numeric score (0-100)
 * @returns {string} Letter grade
 */
function scoreToGrade(score) {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 87) return "A-";
  if (score >= 83) return "B+";
  if (score >= 80) return "B";
  if (score >= 77) return "B-";
  if (score >= 73) return "C+";
  if (score >= 70) return "C";
  if (score >= 67) return "C-";
  if (score >= 63) return "D+";
  if (score >= 60) return "D";
  if (score >= 57) return "D-";
  return "F";
}

/**
 * Truncates text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Calculates overall risk level based on score and plagiarism
 * @param {number} score - Code quality score
 * @param {number} plagiarism - Plagiarism percentage
 * @returns {string} Risk level
 */
function calculateRiskLevel(score, plagiarism) {
  if (plagiarism > 70 || score < 40) return "High Risk";
  if (plagiarism > 40 || score < 60) return "Medium Risk";
  if (plagiarism > 20 || score < 75) return "Low Risk";
  return "Minimal Risk";
}

/**
 * Assesses plagiarism risk level
 * @param {number} similarity - Similarity percentage
 * @returns {string} Risk assessment
 */
function assessPlagiarismRisk(similarity) {
  if (similarity > 70) return "Extreme Risk - Likely Plagiarism";
  if (similarity > 40) return "High Risk - Requires Investigation";
  if (similarity > 20) return "Medium Risk - Monitor Closely";
  return "Low Risk - Acceptable Similarity";
}

/**
 * Recommends action based on plagiarism similarity
 * @param {number} similarity - Similarity percentage
 * @returns {string} Recommended action
 */
function recommendAction(similarity) {
  if (similarity > 70) return "Immediate Review Required";
  if (similarity > 40) return "Manual Investigation Needed";
  if (similarity > 20) return "Monitor and Discuss with Student";
  return "No Action Required";
}

/**
 * Generates summary statistics from results
 * @param {Array} results - Analysis results
 * @returns {Object} Summary statistics
 */
function generateSummaryStatistics(results) {
  const totalFiles = results.length;
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = Math.round(totalScore / totalFiles);

  const highQualityFiles = results.filter((r) => r.score >= 80).length;
  const lowQualityFiles = results.filter((r) => r.score < 60).length;

  const plagiarismScores = results
    .filter((r) => r.plagiarismCheck)
    .map((r) => r.plagiarismCheck.similarity);

  const averagePlagiarism =
    plagiarismScores.length > 0
      ? Math.round(
          plagiarismScores.reduce((sum, p) => sum + p, 0) /
            plagiarismScores.length
        )
      : 0;

  const highSimilarityFiles = plagiarismScores.filter((p) => p > 40).length;
  const extremeSimilarityFiles = plagiarismScores.filter((p) => p > 70).length;

  // Find most common suggestion
  const allSuggestions = results.flatMap((r) => r.suggestions || []);
  const suggestionCounts = {};
  allSuggestions.forEach((suggestion) => {
    const key = suggestion.substring(0, 30); // First 30 chars for grouping
    suggestionCounts[key] = (suggestionCounts[key] || 0) + 1;
  });

  const topIssue =
    Object.keys(suggestionCounts).length > 0
      ? Object.keys(suggestionCounts).reduce((a, b) =>
          suggestionCounts[a] > suggestionCounts[b] ? a : b
        )
      : "No common issues identified";

  return {
    totalFiles,
    averageScore,
    highQualityFiles,
    lowQualityFiles,
    averagePlagiarism,
    highSimilarityFiles,
    extremeSimilarityFiles,
    topIssue,
  };
}

module.exports = {
  exportToCSV,
  exportDetailedPlagiarismCSV,
  exportSummaryCSV,
  extractStudentName,
  scoreToGrade,
  calculateRiskLevel,
};
