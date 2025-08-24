# SCE Advanced - Professional Code Evaluator

<div align="center">

![SCE Advanced Logo](https://img.shields.io/badge/SCE-Advanced-blue?style=for-the-badge&logo=code-review)

**🎓 Professional Code Evaluation Platform for Universities and Educational Institutions**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## 🌟 Overview

SCE Advanced is a comprehensive code evaluation platform specifically designed for universities and educational institutions. It combines advanced code analysis, sophisticated plagiarism detection, and streamlined bulk processing to provide faculty with professional-grade tools for evaluating student assignments efficiently and effectively.

### 🎯 Built for Education

- **University Faculty**: Streamlined assignment evaluation with professional reporting
- **Academic Institutions**: Scalable solution for large-scale code assessment
- **Educational Excellence**: Promotes learning through detailed, constructive feedback

---

## Features

### 🚀 Professional Frontend

- **Modern UI/UX**: Clean, responsive design with subtle animations
- **Real-time Analysis**: Live progress indicators and status updates
- **Professional Animations**: Smooth transitions and loading states
- **Accessible Design**: University-focused interface without distracting elements

### 🔍 Advanced Code Analysis

- **Multi-language Support**: Python, JavaScript, TypeScript, Java, C++, C#, and more
- **Comprehensive Scoring**: Detailed quality assessment with actionable feedback
- **Best Practices Check**: Code structure, naming conventions, and security analysis
- **Performance Analysis**: Optimization suggestions and efficiency recommendations

### 🛡️ Plagiarism Detection

- **Multi-algorithm Comparison**: Text, structural, and token-based similarity detection
- **Cross-file Analysis**: Compare submissions against each other
- **Detailed Reports**: Similarity percentages with specific file matches
- **Risk Assessment**: Automatic categorization of plagiarism risk levels

### 📊 Bulk Processing

- **Batch Analysis**: Process hundreds of files simultaneously
- **Folder Upload**: Upload entire assignment directories
- **Progress Tracking**: Real-time batch processing updates
- **Comprehensive Results**: Unified analysis across all submissions

### 📈 Data Export & Analytics

- **CSV Export**: Detailed results with grades and plagiarism scores
- **Multiple Report Types**: Summary, detailed, and plagiarism-focused exports
- **Student Identification**: Automatic name extraction from filenames
- **Grade Conversion**: Automatic letter grade assignment

## Architecture

### Frontend (React/Next.js)

```
frontend/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # App layout with providers
│   ├── globals.css           # Global styles and animations
│   └── providers.tsx         # Context providers
├── components/
│   ├── FileUpload.tsx        # Single file upload component
│   ├── BulkUpload.tsx        # Bulk file upload component
│   ├── AnalysisResults.tsx   # Results display component
│   └── LoadingAnimation.tsx  # Professional loading states
├── package.json
├── next.config.js
└── tailwind.config.js
```

### Backend (Node.js/Express)

```
backend/
├── server.js                 # Main Express server
├── services/
│   ├── codeAnalyzer.js      # Core code analysis logic
│   ├── plagiarismDetector.js # Plagiarism detection algorithms
│   └── csvExporter.js       # Data export functionality
├── package.json
└── .env.example
```

### Shared

```
shared/
└── types/                    # Shared TypeScript definitions
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Simple Code Evaluator API for enhanced analysis

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Usage Guide

### For University Faculty

#### Single File Analysis

1. **Upload**: Drag and drop or click to select a code file
2. **Analyze**: Click "Analyze Code" to start the evaluation
3. **Review**: Examine the score, feedback, and suggestions
4. **Export**: Download results as needed

#### Bulk Analysis

1. **Switch to Bulk Mode**: Click on "Bulk Analysis" tab
2. **Upload Multiple Files**:
   - Select individual files, or
   - Upload an entire assignment folder
3. **Process**: Click "Start Bulk Analysis"
4. **Review Results**: Examine all submissions with plagiarism detection
5. **Export CSV**: Download comprehensive results for grading

#### Understanding Results

**Quality Scores**

- 90-100: Excellent (A grade)
- 80-89: Good (B grade)
- 70-79: Satisfactory (C grade)
- 60-69: Needs Improvement (D grade)
- Below 60: Poor (F grade)

**Plagiarism Risk Levels**

- 0-20%: Low Risk (Normal similarity)
- 21-40%: Medium Risk (Monitor closely)
- 41-70%: High Risk (Requires investigation)
- 71%+: Extreme Risk (Likely plagiarism)

## API Endpoints

### Health Check

```
GET /api/health
```

### Single File Analysis

```
POST /api/analyze
Content-Type: multipart/form-data
Body: file (code file)
```

### Bulk Analysis

```
POST /api/analyze/bulk
Content-Type: multipart/form-data
Body: files[] (multiple code files)
```

### CSV Export

```
POST /api/export/csv
Content-Type: application/json
Body: { results: [...] }
```

### Statistics

```
GET /api/stats
```

## Integration with Simple Code Evaluator

This project is designed to use your existing Simple Code Evaluator as a backbone:

1. **Set API URL**: Configure `SIMPLE_EVALUATOR_API` in `.env`
2. **Add API Key**: Set `API_KEY` for authentication
3. **Fallback Analysis**: If API is unavailable, uses built-in analysis

## Configuration Options

### Environment Variables

| Variable               | Description                    | Default                   |
| ---------------------- | ------------------------------ | ------------------------- |
| `PORT`                 | Backend server port            | 5000                      |
| `SIMPLE_EVALUATOR_API` | Simple evaluator API URL       | http://localhost:3001/api |
| `API_KEY`              | API authentication key         | -                         |
| `MAX_FILE_SIZE`        | Maximum file size (bytes)      | 10MB                      |
| `MAX_FILES_PER_BATCH`  | Maximum files per batch        | 100                       |
| `SIMILARITY_THRESHOLD` | Plagiarism detection threshold | 30%                       |

### Supported File Types

- Python (`.py`)
- JavaScript (`.js`)
- TypeScript (`.ts`)
- React (`.jsx`, `.tsx`)
- Java (`.java`)
- C++ (`.cpp`)
- C (`.c`)
- C# (`.cs`)
- PHP (`.php`)
- Ruby (`.rb`)
- Go (`.go`)

## Security Features

- **File Type Validation**: Only allows code files
- **Size Limits**: Prevents large file uploads
- **Input Sanitization**: Cleans and validates all inputs
- **Error Handling**: Graceful error management
- **CORS Protection**: Configurable cross-origin settings

## Performance Considerations

- **Async Processing**: Non-blocking file analysis
- **Memory Management**: Efficient handling of large batches
- **File Cleanup**: Automatic temporary file removal
- **Rate Limiting**: Prevents system overload
- **Caching**: Results caching for improved performance

## Future Enhancements

- **Database Integration**: Persistent storage for results
- **User Authentication**: Faculty login system
- **Real-time Notifications**: Email alerts for completed analyses
- **Advanced Plagiarism**: Integration with external plagiarism APIs
- **Custom Grading**: Configurable scoring rubrics
- **Student Portal**: Direct submission interface

## Troubleshooting

### Common Issues

**Files not uploading**

- Check file size limits
- Verify file type is supported
- Ensure backend is running

**Analysis fails**

- Check Simple Evaluator API connection
- Verify API key configuration
- Review server logs for errors

**CSV export issues**

- Ensure results data is valid
- Check browser download settings
- Verify sufficient disk space

### Support

For technical support or feature requests, please check the documentation or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**SCE Advanced** - Making code evaluation professional, efficient, and comprehensive for educational excellence.
