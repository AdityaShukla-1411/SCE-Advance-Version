"use client";

import { motion } from "framer-motion";
import { Brain, Code, Search, CheckCircle } from "lucide-react";

interface LoadingAnimationProps {
  mode?: "individual" | "batch";
}

export default function LoadingAnimation({
  mode = "individual",
}: LoadingAnimationProps) {
  const messages = {
    individual: [
      "Analyzing code structure",
      "Checking syntax and logic",
      "Evaluating best practices",
      "Generating recommendations",
      "Finalizing assessment",
    ],
    batch: [
      "Processing multiple files",
      "Cross-referencing submissions",
      "Detecting potential similarities",
      "Performing bulk analysis",
      "Generating comprehensive report",
    ],
  };

  const currentMessages = messages[mode];

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Analysis Icon */}
      <motion.div
        className="relative mb-8"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-2xl">
          <Brain className="h-12 w-12 text-white" />
        </div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 bg-blue-400 rounded-full opacity-30"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.div>

      {/* Status Text */}
      <motion.div
        className="text-center mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {mode === "batch"
            ? "Processing Batch Analysis"
            : "Analyzing Your Code"}
        </h2>
        <p className="text-slate-600">
          Our AI is working hard to provide comprehensive feedback
          <motion.span
            className="inline-block"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ...
          </motion.span>
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="w-full max-w-md mb-8">
        {currentMessages.map((message, index) => (
          <motion.div
            key={message}
            className="flex items-center space-x-3 mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.5 }}
          >
            <motion.div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                index <= 2 ? "bg-blue-500 border-blue-500" : "border-slate-300"
              }`}
              animate={
                index <= 2
                  ? {
                      scale: [1, 1.2, 1],
                      backgroundColor: ["#3b82f6", "#1d4ed8", "#3b82f6"],
                    }
                  : {}
              }
              transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
            >
              {index <= 2 && <CheckCircle className="h-3 w-3 text-white" />}
            </motion.div>
            <span
              className={`text-sm ${
                index <= 2 ? "text-slate-900 font-medium" : "text-slate-500"
              }`}
            >
              {message}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Floating Icons */}
      <div className="relative w-full max-w-sm h-20">
        {[Code, Search, CheckCircle].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${20 + index * 30}%`,
              top: "50%",
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-6 w-6 text-blue-500" />
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        className="w-full max-w-md mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
        <p className="text-xs text-slate-500 text-center mt-2">
          This may take a few moments depending on file complexity
        </p>
      </motion.div>
    </motion.div>
  );
}
