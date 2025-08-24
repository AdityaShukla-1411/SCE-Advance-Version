"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Files, X, FileText, Users, Database } from "lucide-react";

interface BulkUploadProps {
  onFilesSelect: (files: File[]) => void;
}

export default function BulkUpload({ onFilesSelect }: BulkUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMode, setUploadMode] = useState<"files" | "folder">("files");

  const acceptedTypes = [
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

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedTypes.includes(extension);
      });

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [acceptedTypes]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedTypes.includes(extension);
      });

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    },
    [acceptedTypes]
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const handleBulkAnalysis = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFilesSelect]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Bulk Code Analysis
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload multiple assignment files for comprehensive analysis with
          plagiarism detection and automated grading suitable for university
          coursework evaluation.
        </p>
      </motion.div>

      {/* Upload Mode Toggle */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-slate-200">
          {[
            { key: "files", label: "Select Files", icon: Files },
            { key: "folder", label: "Upload Folder", icon: Database },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setUploadMode(key as "files" | "folder")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                uploadMode === key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 mb-6 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white/50 hover:border-slate-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...(uploadMode === "folder" && ({ webkitdirectory: true } as any))}
        />

        <motion.div
          className="flex flex-col items-center space-y-6"
          animate={{ scale: dragActive ? 1.05 : 1 }}
        >
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
            <Upload className="h-12 w-12 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              {uploadMode === "folder"
                ? "Upload Assignment Folder"
                : "Upload Multiple Files"}
            </h3>
            <p className="text-slate-600 mb-4 max-w-md mx-auto">
              {uploadMode === "folder"
                ? "Select a folder containing all student submissions for batch processing"
                : "Drag and drop multiple code files here, or click to browse"}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
              <span>Supported formats:</span>
              {acceptedTypes.slice(0, 6).map((type) => (
                <span key={type} className="px-2 py-1 bg-slate-100 rounded">
                  {type}
                </span>
              ))}
              <span className="px-2 py-1 bg-slate-100 rounded">
                +{acceptedTypes.length - 6} more
              </span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 max-w-2xl">
            {[
              {
                icon: Users,
                title: "Multi-Student",
                desc: "Process submissions from multiple students",
              },
              {
                icon: Database,
                title: "Batch Analysis",
                desc: "Analyze hundreds of files simultaneously",
              },
              {
                icon: FileText,
                title: "CSV Export",
                desc: "Export results with grades and plagiarism scores",
              },
            ].map((feature, index) => (
              <div key={feature.title} className="text-center p-4">
                <feature.icon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-slate-900 mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Files className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-slate-900">
                  Selected Files ({selectedFiles.length})
                </h4>
              </div>
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-4">
            <div className="grid gap-2">
              {selectedFiles.slice(0, 10).map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}

              {selectedFiles.length > 10 && (
                <div className="text-center py-2 text-sm text-slate-500">
                  ... and {selectedFiles.length - 10} more files
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <motion.button
              onClick={handleBulkAnalysis}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Database className="h-5 w-5" />
              <span>Start Bulk Analysis ({selectedFiles.length} files)</span>
            </motion.button>
            <p className="text-center text-xs text-slate-500 mt-2">
              This will analyze all files for code quality and check for
              similarities
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
