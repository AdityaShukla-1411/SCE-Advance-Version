export interface AnalysisResult {
  id: string;
  fileName: string;
  score: number;
  feedback: string;
  suggestions: string[];
  plagiarismCheck?: PlagiarismCheck;
  timestamp: string;
}

export interface PlagiarismCheck {
  similarity: number;
  matches: string[];
  details?: PlagiarismDetail[];
}

export interface PlagiarismDetail {
  fileName: string;
  similarity: number;
  details: {
    text: number;
    structure: number;
    tokens: number;
  };
}

export interface BulkAnalysisRequest {
  files: File[];
}

export interface BulkAnalysisResponse {
  results: AnalysisResult[];
}

export interface ExportRequest {
  results: AnalysisResult[];
  format: "csv" | "detailed" | "summary";
}

export interface AppStats {
  totalAnalyses: number;
  averageScore: number;
  plagiarismDetected: number;
  activeUsers: number;
  lastUpdated: string;
}
