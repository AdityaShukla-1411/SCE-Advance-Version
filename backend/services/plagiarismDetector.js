const similarity = require("similarity");

/**
 * Detects plagiarism by comparing code similarity
 * @param {string} targetContent - The content to check
 * @param {Array} allFiles - Array of all file contents
 * @param {number} targetIndex - Index of target file to exclude from comparison
 * @returns {Promise<Object>} Plagiarism detection results
 */
async function detectPlagiarism(targetContent, allFiles, targetIndex) {
  try {
    const results = {
      similarity: 0,
      matches: [],
      details: [],
    };

    if (!targetContent || !allFiles || allFiles.length < 2) {
      return results;
    }

    // Normalize the target content
    const normalizedTarget = normalizeCode(targetContent);
    const targetFile = allFiles[targetIndex];

    let maxSimilarity = 0;
    const similarFiles = [];

    // Compare with other files
    for (let i = 0; i < allFiles.length; i++) {
      if (i === targetIndex) continue; // Skip self

      const compareFile = allFiles[i];
      const normalizedCompare = normalizeCode(compareFile.content);

      // Calculate similarity using multiple methods
      const similarities = calculateSimilarities(
        normalizedTarget,
        normalizedCompare
      );
      const avgSimilarity =
        (similarities.text + similarities.structure + similarities.tokens) / 3;

      if (avgSimilarity > 0.3) {
        // 30% threshold for suspicious similarity
        similarFiles.push({
          fileName: compareFile.name,
          similarity: Math.round(avgSimilarity * 100),
          details: similarities,
        });

        if (avgSimilarity > maxSimilarity) {
          maxSimilarity = avgSimilarity;
        }
      }
    }

    // Sort by similarity descending
    similarFiles.sort((a, b) => b.similarity - a.similarity);

    results.similarity = Math.round(maxSimilarity * 100);
    results.matches = similarFiles.slice(0, 5).map((f) => f.fileName); // Top 5 matches
    results.details = similarFiles.slice(0, 3); // Top 3 detailed results

    return results;
  } catch (error) {
    console.error("Plagiarism detection error:", error);
    return {
      similarity: 0,
      matches: [],
      details: [],
      error: "Failed to perform plagiarism check",
    };
  }
}

/**
 * Normalizes code for comparison by removing comments, whitespace, and formatting
 * @param {string} code - Raw code content
 * @returns {string} Normalized code
 */
function normalizeCode(code) {
  if (!code) return "";

  return (
    code
      // Remove single-line comments
      .replace(/\/\/.*$/gm, "")
      .replace(/#.*$/gm, "")
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/'''[\s\S]*?'''/g, "")
      .replace(/"""[\s\S]*?"""/g, "")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove empty lines
      .replace(/^\s*[\r\n]/gm, "")
      // Normalize variable names (replace with placeholders)
      .replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => {
        // Keep common keywords and operators
        const keywords = [
          "if",
          "else",
          "for",
          "while",
          "function",
          "return",
          "var",
          "let",
          "const",
          "def",
          "class",
          "import",
          "from",
          "try",
          "catch",
          "finally",
          "throw",
          "public",
          "private",
          "protected",
          "static",
          "void",
          "int",
          "string",
          "true",
          "false",
          "null",
          "undefined",
          "None",
          "True",
          "False",
        ];

        if (keywords.includes(match.toLowerCase())) {
          return match;
        }

        // Replace variable names with generic placeholders
        return "VAR";
      })
      .trim()
      .toLowerCase()
  );
}

/**
 * Calculates multiple types of similarity scores
 * @param {string} code1 - First code snippet
 * @param {string} code2 - Second code snippet
 * @returns {Object} Similarity scores
 */
function calculateSimilarities(code1, code2) {
  // Text similarity using basic string comparison
  const textSimilarity = similarity(code1, code2);

  // Structural similarity (based on code patterns)
  const structureSimilarity = calculateStructuralSimilarity(code1, code2);

  // Token-based similarity
  const tokenSimilarity = calculateTokenSimilarity(code1, code2);

  return {
    text: textSimilarity,
    structure: structureSimilarity,
    tokens: tokenSimilarity,
  };
}

/**
 * Calculates structural similarity based on code patterns
 * @param {string} code1 - First code snippet
 * @param {string} code2 - Second code snippet
 * @returns {number} Structural similarity score (0-1)
 */
function calculateStructuralSimilarity(code1, code2) {
  // Extract structural patterns
  const patterns1 = extractPatterns(code1);
  const patterns2 = extractPatterns(code2);

  if (patterns1.length === 0 && patterns2.length === 0) return 1;
  if (patterns1.length === 0 || patterns2.length === 0) return 0;

  // Calculate Jaccard similarity of patterns
  const intersection = patterns1.filter((p) => patterns2.includes(p));
  const union = [...new Set([...patterns1, ...patterns2])];

  return intersection.length / union.length;
}

/**
 * Extracts structural patterns from code
 * @param {string} code - Code content
 * @returns {Array} Array of patterns
 */
function extractPatterns(code) {
  const patterns = [];

  // Control flow patterns
  patterns.push(...(code.match(/if\s*\(/g) || []).map(() => "IF"));
  patterns.push(...(code.match(/for\s*\(/g) || []).map(() => "FOR"));
  patterns.push(...(code.match(/while\s*\(/g) || []).map(() => "WHILE"));
  patterns.push(...(code.match(/function\s*\(/g) || []).map(() => "FUNCTION"));
  patterns.push(...(code.match(/class\s+/g) || []).map(() => "CLASS"));

  // Operator patterns
  patterns.push(...(code.match(/\+\+/g) || []).map(() => "INCREMENT"));
  patterns.push(...(code.match(/--/g) || []).map(() => "DECREMENT"));
  patterns.push(...(code.match(/==/g) || []).map(() => "EQUALITY"));
  patterns.push(...(code.match(/!=/g) || []).map(() => "INEQUALITY"));

  return patterns;
}

/**
 * Calculates token-based similarity using n-grams
 * @param {string} code1 - First code snippet
 * @param {string} code2 - Second code snippet
 * @returns {number} Token similarity score (0-1)
 */
function calculateTokenSimilarity(code1, code2) {
  const tokens1 = tokenize(code1);
  const tokens2 = tokenize(code2);

  if (tokens1.length === 0 && tokens2.length === 0) return 1;
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Create bigrams
  const bigrams1 = createBigrams(tokens1);
  const bigrams2 = createBigrams(tokens2);

  // Calculate Jaccard similarity
  const intersection = bigrams1.filter((bg) => bigrams2.includes(bg));
  const union = [...new Set([...bigrams1, ...bigrams2])];

  return intersection.length / union.length;
}

/**
 * Tokenizes code into meaningful tokens
 * @param {string} code - Code content
 * @returns {Array} Array of tokens
 */
function tokenize(code) {
  return code
    .split(/\s+/)
    .filter((token) => token.length > 0)
    .map((token) => token.replace(/[^\w]/g, ""))
    .filter((token) => token.length > 0);
}

/**
 * Creates bigrams from token array
 * @param {Array} tokens - Array of tokens
 * @returns {Array} Array of bigrams
 */
function createBigrams(tokens) {
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    bigrams.push(`${tokens[i]}_${tokens[i + 1]}`);
  }
  return bigrams;
}

/**
 * Generates a plagiarism report for multiple files
 * @param {Array} results - Array of analysis results
 * @returns {Object} Comprehensive plagiarism report
 */
function generatePlagiarismReport(results) {
  const report = {
    totalFiles: results.length,
    suspiciousFiles: 0,
    highRiskFiles: 0,
    averageSimilarity: 0,
    similarityDistribution: {
      low: 0, // 0-20%
      medium: 0, // 21-40%
      high: 0, // 41-70%
      extreme: 0, // 71%+
    },
    recommendations: [],
  };

  let totalSimilarity = 0;

  results.forEach((result) => {
    if (result.plagiarismCheck) {
      const similarity = result.plagiarismCheck.similarity;
      totalSimilarity += similarity;

      if (similarity > 20) report.suspiciousFiles++;
      if (similarity > 40) report.highRiskFiles++;

      // Categorize similarity
      if (similarity <= 20) {
        report.similarityDistribution.low++;
      } else if (similarity <= 40) {
        report.similarityDistribution.medium++;
      } else if (similarity <= 70) {
        report.similarityDistribution.high++;
      } else {
        report.similarityDistribution.extreme++;
      }
    }
  });

  report.averageSimilarity = Math.round(totalSimilarity / results.length);

  // Generate recommendations
  if (report.highRiskFiles > 0) {
    report.recommendations.push(
      `${report.highRiskFiles} files require manual review for potential plagiarism`
    );
  }

  if (report.suspiciousFiles > report.highRiskFiles) {
    report.recommendations.push(
      `${
        report.suspiciousFiles - report.highRiskFiles
      } files show moderate similarity that should be investigated`
    );
  }

  if (report.averageSimilarity > 30) {
    report.recommendations.push(
      "High average similarity suggests possible collaboration or common source material"
    );
  }

  return report;
}

module.exports = {
  detectPlagiarism,
  generatePlagiarismReport,
  normalizeCode,
  calculateSimilarities,
};
