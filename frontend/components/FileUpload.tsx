"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
}

export default function FileUpload({
  onFileSelect,
  multiple = false,
  acceptedTypes = [".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".cpp", ".c"],
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
        setSelectedFiles(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [acceptedTypes, multiple]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter((file) => {
        const extension = "." + file.name.split(".").pop()?.toLowerCase();
        return acceptedTypes.includes(extension);
      });

      if (validFiles.length > 0) {
        setSelectedFiles(multiple ? validFiles : [validFiles[0]]);
      }
    },
    [acceptedTypes, multiple]
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnalyze = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFileSelect]);

  return (
    <div className="w-full">
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white/50 hover:border-slate-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <motion.div
          className="flex flex-col items-center space-y-4"
          animate={{ scale: dragActive ? 1.05 : 1 }}
        >
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
            <Upload className="h-8 w-8 text-white" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Upload Code Files
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-sm text-slate-500">
              Supported: {acceptedTypes.join(", ")}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <h4 className="font-medium text-slate-900">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <motion.div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">
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

          <motion.button
            onClick={handleAnalyze}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Analyze Code ({selectedFiles.length} file
            {selectedFiles.length !== 1 ? "s" : ""})
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
