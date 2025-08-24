"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
} from "lucide-react";

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

interface AnalysisResultsProps {
  results: AnalysisResult[];
  onExportCSV: () => void;
  isBulkMode?: boolean;
}

export default function AnalysisResults({
  results,
  onExportCSV,
  isBulkMode = false,
}: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getPlagiarismColor = (similarity: number) => {
    if (similarity < 10) return "text-green-600 bg-green-50";
    if (similarity < 20) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Analysis Results
              </h3>
              <p className="text-sm text-slate-600">
                {results.length} file{results.length !== 1 ? "s" : ""} analyzed
                {isBulkMode && " • Bulk processing complete"}
              </p>
            </div>
          </div>

          <motion.button
            onClick={onExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Results List */}
      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            className="p-6 hover:bg-slate-50/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-slate-500" />
                <div>
                  <h4 className="font-medium text-slate-900">
                    {result.fileName}
                  </h4>
                  <p className="text-sm text-slate-500">ID: {result.id}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Score Badge */}
                <div
                  className={`px-3 py-1 rounded-full border font-medium text-sm ${getScoreColor(
                    result.score
                  )}`}
                >
                  {result.score}/100
                </div>

                {/* Plagiarism Check */}
                {result.plagiarismCheck && (
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPlagiarismColor(
                      result.plagiarismCheck.similarity
                    )}`}
                  >
                    {result.plagiarismCheck.similarity}% similarity
                  </div>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-4">
              <p className="text-slate-700 leading-relaxed">
                {result.feedback}
              </p>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Suggestions for Improvement
                </h5>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-600 flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Plagiarism Details */}
            {result.plagiarismCheck &&
              result.plagiarismCheck.matches.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">
                      Similar Files Detected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.plagiarismCheck.matches.map((match, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        {match}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      {isBulkMode && results.length > 1 && (
        <div className="bg-slate-50 p-6 border-t border-slate-200">
          <h4 className="font-medium text-slate-900 mb-4">Batch Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  results.reduce((sum, r) => sum + r.score, 0) / results.length
                )}
              </div>
              <div className="text-sm text-slate-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.score >= 75).length}
              </div>
              <div className="text-sm text-slate-600">Good Quality</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {
                  results.filter(
                    (r) =>
                      r.plagiarismCheck && r.plagiarismCheck.similarity > 20
                  ).length
                }
              </div>
              <div className="text-sm text-slate-600">High Similarity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {results.length}
              </div>
              <div className="text-sm text-slate-600">Total Files</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
