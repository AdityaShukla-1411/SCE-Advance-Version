# API Documentation - SCE Advanced

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication for development. In production, implement proper authentication mechanisms.

## Endpoints

### Health Check

**GET** `/health`

Returns the server status and health information.

**Response:**

```json
{
  "status": "OK",
  "message": "SCE Advanced Backend is running",
  "timestamp": "2025-08-24T10:30:00.000Z"
}
```

### Single File Analysis

**POST** `/analyze`

Analyzes a single code file for quality and provides feedback.

**Request:**

- Content-Type: `multipart/form-data`
- Body: `file` (code file)

**Response:**

```json
{
  "id": "1692875400123",
  "fileName": "sample.py",
  "score": 85,
  "feedback": "Code demonstrates good structure and follows most best practices.",
  "suggestions": [
    "Consider adding more comments for complex logic",
    "Implement error handling in critical sections"
  ],
  "timestamp": "2025-08-24T10:30:00.000Z"
}
```

### Bulk File Analysis

**POST** `/analyze/bulk`

Analyzes multiple code files with plagiarism detection.

**Request:**

- Content-Type: `multipart/form-data`
- Body: `files[]` (multiple code files, max 100)

**Response:**

```json
{
  "results": [
    {
      "id": "bulk_1692875400_0",
      "fileName": "student1.py",
      "score": 85,
      "feedback": "Good code quality",
      "suggestions": ["Add more comments"],
      "plagiarismCheck": {
        "similarity": 15,
        "matches": ["student2.py"],
        "details": [
          {
            "fileName": "student2.py",
            "similarity": 15,
            "details": {
              "text": 0.12,
              "structure": 0.18,
              "tokens": 0.15
            }
          }
        ]
      },
      "timestamp": "2025-08-24T10:30:00.000Z"
    }
  ]
}
```

### CSV Export

**POST** `/export/csv`

Exports analysis results to CSV format.

**Request:**

```json
{
  "results": [
    // Array of analysis results
  ]
}
```

**Response:**

- Content-Type: `text/csv`
- Headers: Student Name, File Name, File ID, Score, Grade, Plagiarism %, Similar Files, etc.

### Statistics

**GET** `/stats`

Returns system statistics and usage metrics.

**Response:**

```json
{
  "totalAnalyses": 1247,
  "averageScore": 78.5,
  "plagiarismDetected": 23,
  "activeUsers": 45,
  "lastUpdated": "2025-08-24T10:30:00.000Z"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes with error messages:

```json
{
  "error": "Error description"
}
```

Common status codes:

- `400` - Bad Request (invalid input)
- `413` - Payload Too Large (file size limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to prevent system overload. Current limits:

- 100 requests per minute per IP
- Maximum 10MB per file
- Maximum 100 files per batch request

## File Type Support

Supported file extensions:

- Python: `.py`
- JavaScript: `.js`
- TypeScript: `.ts`
- React: `.jsx`, `.tsx`
- Java: `.java`
- C++: `.cpp`
- C: `.c`
- C#: `.cs`
- PHP: `.php`
- Ruby: `.rb`
- Go: `.go`
