# Deployment Guide - SCE Advanced

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- 2GB RAM minimum
- 10GB disk space

## Production Deployment

### 1. Environment Setup

Create production environment files:

**Backend (.env):**

```env
NODE_ENV=production
PORT=5000
SIMPLE_EVALUATOR_API=https://your-api-domain.com/api
API_KEY=your_production_api_key
JWT_SECRET=your_super_secure_jwt_secret_256_bits_long
MAX_FILE_SIZE=10485760
MAX_FILES_PER_BATCH=100
SIMILARITY_THRESHOLD=30
HIGH_RISK_THRESHOLD=70
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.production):**

```env
NEXT_PUBLIC_BACKEND_URL=https://your-api-domain.com
```

### 2. Backend Deployment

```bash
# Install dependencies
cd backend
npm install --production

# Build if needed
npm run build  # if you add a build script

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "sce-backend"
pm2 startup
pm2 save
```

### 3. Frontend Deployment

```bash
# Install dependencies
cd frontend
npm install

# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify
npx vercel deploy
```

### 4. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 50M;
    }
}
```

### 5. Docker Deployment

**Backend Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./backend/.env:/app/.env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:5000
```

## Monitoring and Logging

### 1. Backend Logging

```javascript
// Add to server.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### 2. Health Checks

Set up monitoring for:

- `/api/health` endpoint
- Server response times
- File upload success rates
- Error rates

### 3. Performance Monitoring

- Memory usage
- CPU utilization
- Disk space
- Request throughput

## Security Considerations

### 1. File Upload Security

- Validate file types
- Scan for malicious content
- Limit file sizes
- Sanitize filenames

### 2. API Security

- Implement rate limiting
- Add authentication
- Use HTTPS only
- Validate all inputs

### 3. Database Security (if added)

- Use parameterized queries
- Regular backups
- Encrypted connections
- Access controls

## Backup Strategy

### 1. Code Backup

- Git repository with multiple remotes
- Automated daily backups

### 2. Data Backup (if applicable)

- Database backups
- File storage backups
- Configuration backups

## Scaling Considerations

### 1. Horizontal Scaling

- Load balancer setup
- Multiple backend instances
- Session management
- File upload distribution

### 2. Performance Optimization

- CDN for static assets
- Caching strategies
- Database optimization
- Code minification

## Troubleshooting

### Common Issues

1. **High Memory Usage**: Increase server resources or optimize code analysis
2. **Slow File Processing**: Implement queue system for large batches
3. **Upload Failures**: Check file size limits and disk space
4. **API Timeouts**: Increase timeout settings for large file processing

### Logs to Monitor

- Application logs: `/var/log/sce-advanced/`
- Access logs: Nginx/Apache logs
- Error logs: PM2 logs
- System logs: `/var/log/syslog`
