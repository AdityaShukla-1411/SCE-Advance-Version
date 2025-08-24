const axios = require("axios");
require("dotenv").config();

// This service will use the existing simple code evaluator API
// You can replace this with your existing API endpoint
const SIMPLE_EVALUATOR_API =
  process.env.SIMPLE_EVALUATOR_API || "http://localhost:3001/api";
const API_KEY = process.env.API_KEY || "";

/**
 * Analyzes code using the simple code evaluator backbone
 * @param {string} code - The code content to analyze
 * @param {string} fileName - The name of the file
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeCode(code, fileName) {
  try {
    // If you have the simple code evaluator running, uncomment this:
    /*
    const response = await axios.post(`${SIMPLE_EVALUATOR_API}/analyze`, {
      code: code,
      fileName: fileName,
      language: detectLanguage(fileName)
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
    */

    // Fallback analysis for demo purposes
    return performLocalAnalysis(code, fileName);
  } catch (error) {
    console.error("Error calling simple evaluator API:", error.message);
    // Fallback to local analysis
    return performLocalAnalysis(code, fileName);
  }
}

/**
 * Performs local code analysis when API is not available
 * @param {string} code - The code content
 * @param {string} fileName - The file name
 * @returns {Object} Analysis results
 */
function performLocalAnalysis(code, fileName) {
  const language = detectLanguage(fileName);
  let score = 70; // Base score
  const suggestions = [];
  let feedback = `Code analysis completed for ${fileName}. `;

  // Basic analysis rules
  const codeLines = code.split("\n");
  const totalLines = codeLines.length;
  const nonEmptyLines = codeLines.filter(
    (line) => line.trim().length > 0
  ).length;
  const commentLines = codeLines.filter((line) =>
    isComment(line, language)
  ).length;

  // Code structure analysis
  if (totalLines < 10) {
    score -= 5;
    suggestions.push(
      "Consider breaking down complex logic into smaller functions"
    );
  }

  // Comment analysis
  const commentRatio = commentLines / nonEmptyLines;
  if (commentRatio < 0.1) {
    score -= 10;
    suggestions.push("Add more comments to explain complex logic");
    feedback += "The code would benefit from more documentation. ";
  } else if (commentRatio > 0.3) {
    score += 5;
    feedback += "Good documentation practices observed. ";
  }

  // Function/method analysis
  const functionCount = countFunctions(code, language);
  if (functionCount === 0 && totalLines > 20) {
    score -= 15;
    suggestions.push(
      "Consider organizing code into functions for better modularity"
    );
  }

  // Variable naming (basic check)
  const hasDescriptiveNames = checkVariableNaming(code);
  if (!hasDescriptiveNames) {
    score -= 5;
    suggestions.push("Use more descriptive variable names");
  } else {
    score += 5;
  }

  // Error handling
  const hasErrorHandling = checkErrorHandling(code, language);
  if (!hasErrorHandling && totalLines > 30) {
    score -= 10;
    suggestions.push("Implement proper error handling");
  }

  // Security considerations
  const securityIssues = checkBasicSecurity(code, language);
  if (securityIssues.length > 0) {
    score -= 15;
    suggestions.push(...securityIssues);
  }

  // Performance considerations
  const performanceIssues = checkPerformance(code, language);
  if (performanceIssues.length > 0) {
    score -= 5;
    suggestions.push(...performanceIssues);
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  if (score >= 90) {
    feedback += "Excellent code quality with professional standards.";
  } else if (score >= 80) {
    feedback += "Good code quality with minor areas for improvement.";
  } else if (score >= 70) {
    feedback += "Acceptable code quality with several areas for enhancement.";
  } else {
    feedback +=
      "Code requires significant improvements for production readiness.";
  }

  return {
    score,
    feedback,
    suggestions: suggestions.slice(0, 5), // Limit to top 5 suggestions
    analysis: {
      language,
      totalLines,
      commentRatio: Math.round(commentRatio * 100),
      functionCount,
    },
  };
}

/**
 * Detects programming language from file extension
 */
function detectLanguage(fileName) {
  const extension = fileName.split(".").pop().toLowerCase();
  const languageMap = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    jsx: "react",
    tsx: "react-typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
  };
  return languageMap[extension] || "unknown";
}

/**
 * Checks if a line is a comment based on language
 */
function isComment(line, language) {
  const trimmed = line.trim();
  const commentPatterns = {
    python: /^#/,
    javascript: /^(\/\/|\/\*|\*)/,
    typescript: /^(\/\/|\/\*|\*)/,
    react: /^(\/\/|\/\*|\*)/,
    "react-typescript": /^(\/\/|\/\*|\*)/,
    java: /^(\/\/|\/\*|\*)/,
    cpp: /^(\/\/|\/\*|\*)/,
    c: /^(\/\/|\/\*|\*)/,
    csharp: /^(\/\/|\/\*|\*)/,
    php: /^(\/\/|\/\*|\*|#)/,
    ruby: /^#/,
    go: /^(\/\/|\/\*|\*)/,
  };

  const pattern = commentPatterns[language];
  return pattern ? pattern.test(trimmed) : false;
}

/**
 * Counts functions/methods in code
 */
function countFunctions(code, language) {
  const functionPatterns = {
    python: /def\s+\w+\s*\(/g,
    javascript:
      /(function\s+\w+|const\s+\w+\s*=|let\s+\w+\s*=|var\s+\w+\s*=).*=>/g,
    typescript: /(function\s+\w+|const\s+\w+\s*:|let\s+\w+\s*:|var\s+\w+\s*:)/g,
    java: /(public|private|protected).*\s+\w+\s*\(/g,
    cpp: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    c: /\w+\s+\w+\s*\([^)]*\)\s*{/g,
    csharp: /(public|private|protected).*\s+\w+\s*\(/g,
    php: /function\s+\w+\s*\(/g,
    ruby: /def\s+\w+/g,
    go: /func\s+\w+\s*\(/g,
  };

  const pattern = functionPatterns[language];
  if (!pattern) return 0;

  const matches = code.match(pattern);
  return matches ? matches.length : 0;
}

/**
 * Basic variable naming check
 */
function checkVariableNaming(code) {
  // Look for single-letter variables (excluding common ones like i, j, k in loops)
  const singleLetterVars = code.match(/\b[a-h,l-z]\s*=/g);
  const hasDescriptiveNames = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]{2,}\s*=/g);

  return (
    hasDescriptiveNames && (!singleLetterVars || singleLetterVars.length < 3)
  );
}

/**
 * Check for basic error handling
 */
function checkErrorHandling(code, language) {
  const errorPatterns = {
    python: /(try:|except:|finally:)/,
    javascript: /(try\s*{|catch\s*\(|finally\s*{)/,
    typescript: /(try\s*{|catch\s*\(|finally\s*{)/,
    java: /(try\s*{|catch\s*\(|finally\s*{)/,
    cpp: /(try\s*{|catch\s*\()/,
    c: /if.*==.*NULL/,
    csharp: /(try\s*{|catch\s*\(|finally\s*{)/,
    php: /(try\s*{|catch\s*\(|finally\s*{)/,
    ruby: /(begin|rescue|ensure)/,
    go: /(if.*err.*!=.*nil)/,
  };

  const pattern = errorPatterns[language];
  return pattern ? pattern.test(code) : false;
}

/**
 * Basic security checks
 */
function checkBasicSecurity(code, language) {
  const issues = [];

  // Check for potential SQL injection
  if (/SELECT.*\+.*FROM|INSERT.*\+.*INTO/i.test(code)) {
    issues.push("Potential SQL injection vulnerability detected");
  }

  // Check for hardcoded passwords/keys
  if (/(password|key|secret)\s*=\s*["'][^"']+["']/i.test(code)) {
    issues.push("Avoid hardcoding sensitive information");
  }

  // Check for eval usage
  if (/eval\s*\(/i.test(code)) {
    issues.push("Avoid using eval() for security reasons");
  }

  return issues;
}

/**
 * Basic performance checks
 */
function checkPerformance(code, language) {
  const issues = [];

  // Check for nested loops
  const nestedLoopPattern = /(for|while).*{[^}]*(for|while)/g;
  if (nestedLoopPattern.test(code)) {
    issues.push("Consider optimizing nested loops for better performance");
  }

  // Check for repeated expensive operations in loops
  if (/(for|while).*{[^}]*\.(find|search|indexOf)/g.test(code)) {
    issues.push("Move expensive operations outside of loops when possible");
  }

  return issues;
}

module.exports = {
  analyzeCode,
  detectLanguage,
};
