# HC-402: Automated Digital KYC and Onboarding Platform

> The industry's first offline-first KYC solution. High-speed OCR, biometric matching, and background sync—packaged into a lightweight installable Progressive Web App.

## 🎯 Overview

**HC-402** is a secure, modern digital Know Your Customer (KYC) and identity verification platform. It enables seamless identity verification through:

- **📄 Document OCR** - Intelligent extraction of data from government IDs
- **👤 Face Recognition** - Biometric face matching between document and selfie
- **🔍 Liveness Detection** - Anti-spoofing verification with video analysis
- **📊 Compliance Reports** - Automated PDF generation for audit trails
- **📱 Progressive Web App** - Works offline, installable on any device
- **🔐 End-to-End Encryption** - Secure session management with JWT
- **🌐 Beautiful UI** - Modern, mobile-first responsive design

## ✨ Current Features

### Frontend (Next.js + React)

- ✅ **Authentication System** - Secure login with NextAuth.js
- ✅ **Responsive Layout** - Mobile-first design with Tailwind CSS
- ✅ **Multi-Step Wizard** - Guided onboarding (Document → Selfie → Review)
- ✅ **File Upload Component** - Drag-and-drop ID document upload
- ✅ **Camera Capture** - Real-time selfie capture with video preview
- ✅ **Dashboard** - Admin verification hub with audit logs
- ✅ **Results Display** - Real-time verification scores and status
- ✅ **PWA Ready** - Service workers, offline support, installable app
- ✅ **Dark Mode Compatible** - Beautiful UI with Tailwind styling

### Backend (FastAPI + Python)

- ✅ **RESTful API** - Complete KYC endpoints with proper error handling
- ✅ **File Management** - Secure file upload and storage system
- ✅ **Database Layer** - SQLite with SQLAlchemy ORM
- ✅ **Document Upload** - `/kyc/upload-id` - ID document storage
- ✅ **Selfie Upload** - `/kyc/upload-selfie` - Selfie image storage
- ✅ **Verification Engine** - `/kyc/verify` - Run KYC verification
- ✅ **Result Retrieval** - `/kyc/result` - Get verification results
- ✅ **Report Generation** - `/kyc/generate-report` - PDF report creation
- ✅ **Health Checks** - `/health` endpoint for monitoring

### ML Services

- ✅ **Document OCR** - Extract text from ID documents
- ✅ **Face Detection** - Locate faces in images
- ✅ **Face Matching** - Compare faces with confidence scoring
- ✅ **Liveness Detection** - Verify real person vs. spoofed image
- ✅ **Document Validation** - Quality checks on ID documents
- ✅ **Image Processing** - Preprocessing and normalization

### Security Features

- ✅ **Session-Based Security** - Unique KYC ID per verification
- ✅ **JWT Authentication** - NextAuth.js with JWT tokens
- ✅ **CORS Enabled** - Secure cross-origin requests
- ✅ **File Validation** - Size limits (5MB) and type checks
- ✅ **Database Encryption** - SQLite with secure storage
- ✅ **AES-256 Data Protection** - End-to-end encryption

## 🛠️ Tech Stack

| Layer                | Technology         | Version |
| -------------------- | ------------------ | ------- |
| **Frontend**         | Next.js            | 16.1.6  |
| **Frontend UI**      | React              | 19.2.3  |
| **Frontend Styling** | Tailwind CSS       | 3.x     |
| **Frontend Auth**    | NextAuth.js        | 4.24.13 |
| **Frontend PWA**     | next-pwa           | 5.6.0   |
| **Backend API**      | FastAPI            | Latest  |
| **Backend Server**   | Uvicorn            | Latest  |
| **Backend ORM**      | SQLAlchemy         | Latest  |
| **Database**         | SQLite             | 3.x     |
| **ML Libraries**     | OpenCV, NumPy, PIL | Latest  |
| **Containerization** | Docker             | 20.10+  |
| **DevOps**           | Docker Compose     | 2.x     |

## 📁 Project Structure

```
hc402-kyc-platform/
├── frontend/                      # Next.js React PWA
│   ├── app/                       # App Router pages
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   ├── login/                 # Login page
│   │   ├── onboarding/            # Verification wizard
│   │   ├── dashboard/             # Admin dashboard
│   │   └── api/                   # Route handlers (NextAuth, KYC proxy)
│   ├── components/                # Reusable React components
│   │   ├── Header.tsx             # Navigation header
│   │   ├── OnboardingWizard.tsx   # Multi-step wizard
│   │   ├── FileUpload.tsx         # Document upload
│   │   ├── Camera.tsx             # Selfie capture
│   │   ├── Results.tsx            # Verification results
│   │   ├── Footer.tsx             # Footer component
│   │   └── ui/                    # shadcn/ui components
│   ├── lib/                       # Utilities
│   │   ├── auth.ts                # NextAuth configuration
│   │   └── utils.ts               # Helper functions
│   ├── public/                    # Static assets
│   │   └── sw.js                  # Service worker
│   ├── package.json               # Dependencies
│   ├── tsconfig.json              # TypeScript config
│   └── next.config.ts             # Next.js config
│
├── backend/                       # FastAPI Python backend
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Configuration settings
│   ├── database.py                # SQLAlchemy setup
│   ├── routers/                   # API route handlers
│   │   ├── health.py              # Health check endpoint
│   │   └── kyc.py                 # KYC verification routes
│   ├── models/                    # Data models
│   │   ├── kyc_model.py           # KYC database model
│   │   └── response.py            # Response schemas
│   ├── services/                  # Business logic
│   │   ├── file_service.py        # File operations
│   │   └── report_service.py      # PDF report generation
│   ├── ml_service/                # ML services
│   │   ├── api/
│   │   │   └── ml_service.py      # ML API endpoints
│   │   ├── ocr/
│   │   │   ├── document_ocr.py    # OCR processing
│   │   │   └── text_extractor.py  # Text extraction
│   │   ├── face/
│   │   │   ├── face_detector.py   # Face detection
│   │   │   ├── face_matcher.py    # Face matching
│   │   │   └── liveness.py        # Liveness detection
│   │   ├── fraud/
│   │   │   └── document_validator.py # Document validation
│   │   └── utils/
│   │       └── image_processor.py # Image utilities
│   ├── uploads/                   # User uploaded files
│   ├── requirements.txt           # Python dependencies
│   └── logging_config.py          # Logging configuration
│
├── deployment/                    # Deployment configuration
│   ├── docker/                    # Docker files
│   │   ├── Dockerfile.backend     # Backend container
│   │   └── Dockerfile.frontend    # Frontend container
│   └── scripts/                   # Deployment scripts
│
├── docs/                          # Documentation
├── assets/                        # Images and icons
├── docker-compose.yml             # Docker Compose orchestration
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have installed:

- **Node.js** 18.0+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/))
- **Docker & Docker Compose** (Optional, for containerized setup)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Git** ([Download](https://git-scm.com/))
- **npm** or **yarn** (comes with Node.js)

### Option 1: Local Development (Recommended for Development)

#### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/hc402-kyc-platform.git
cd hc402-kyc-platform
```

#### Step 2: Setup Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Environment Variables (.env):**

```env
# Application Configuration
ENVIRONMENT=development
DEBUG=true

# Backend Settings
API_HOST=0.0.0.0
API_PORT=8000
SECRET_KEY=your-super-secret-key-change-this
PYTHON_BACKEND_URL=http://localhost:8000

# Database
DATABASE_URL=./kyc.db

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Frontend
FRONTEND_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

#### Step 3: Install Backend Dependencies

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### Step 4: Start Backend Server

```bash
# From backend directory with activated venv
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

Check health: `http://localhost:8000/health`

#### Step 5: Install Frontend Dependencies

```bash
# In new terminal, navigate to frontend
cd frontend

# Install Node dependencies
npm install
# or
yarn install
```

#### Step 6: Start Frontend Development Server

```bash
# From frontend directory
npm run dev
# or
yarn dev
```

Frontend will be available at: `http://localhost:3000`

### Option 2: Docker Containerized Setup (Recommended for Production)

#### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/hc402-kyc-platform.git
cd hc402-kyc-platform
```

#### Step 2: Setup Environment

```bash
cp .env.example .env
# Edit .env as needed
nano .env
```

#### Step 3: Build and Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services:**

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

## 📚 API Endpoints

### Health & Status

```
GET /health                          # Backend health check
GET /                                # API info endpoint
```

### KYC Verification Flow

```
POST /kyc/upload-id                  # Upload ID document
POST /kyc/upload-selfie              # Upload selfie image
POST /kyc/verify                     # Start verification process
GET  /kyc/result                     # Get verification results
POST /kyc/generate-report            # Generate PDF report
GET  /kyc/status                     # KYC service status
```

### Request Examples

**Upload ID Document:**

```bash
curl -X POST http://localhost:8000/kyc/upload-id \
  -F "file=@id_photo.jpg" \
  -F "kyc_id=user123"
```

**Start Verification:**

```bash
curl -X POST http://localhost:8000/kyc/verify \
  -H "Content-Type: application/json" \
  -d '{"kyc_id": "user123"}'
```

**Get Results:**

```bash
curl http://localhost:8000/kyc/result?kyc_id=user123
```

## 🔐 Authentication

The platform uses **NextAuth.js** with JWT for secure authentication.

### Demo Credentials

```
Email: test@example.com
Password: demo (in development mode)
```

### Creating New Users

Edit `frontend/lib/auth.ts` to modify authentication logic:

```typescript
async authorize(credentials) {
    // Replace with your authentication logic
    if (credentials?.email === "test@example.com" &&
        credentials?.password === "demo") {
        return {
            id: "user123",
            name: "Test User",
            email: "test@example.com"
        };
    }
    return null;
}
```

## 💾 Database

### SQLite Schema

**KYC Sessions Table:**

```sql
CREATE TABLE kyc_sessions (
    kyc_id VARCHAR PRIMARY KEY,
    ocr_confidence FLOAT,
    face_match_score FLOAT,
    status VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Database Operations

```bash
# Access SQLite database
sqlite3 backend/kyc.db

# View all records
SELECT * FROM kyc_sessions;

# Clear all records (for testing)
DELETE FROM kyc_sessions;
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### Backend Testing

```bash
cd backend

# Run pytest
pytest

# With coverage
pytest --cov=.

# Specific test file
pytest tests/test_kyc.py
```

## 📊 Verification Process

The KYC verification follows this workflow:

```
1. User Login
   ↓
2. Document Upload (ID Card)
   ↓ (API: /kyc/upload-id)
   Document validation & OCR extraction
   ↓
3. Selfie Capture
   ↓ (API: /kyc/upload-selfie)
   Face detection & quality check
   ↓
4. Final Submission
   ↓ (API: /kyc/verify)
   Face matching + Liveness check
   Optional: Video-based liveness verification
   ↓
5. Results & Report
   ↓ (API: /kyc/result)
   Display verification score (0-100%)
   Status: VERIFIED / REJECTED
   Generate PDF report
```

## 🎨 Frontend Features

### Pages

| Page       | Route         | Purpose                             |
| ---------- | ------------- | ----------------------------------- |
| Home       | `/`           | Landing page with features overview |
| Login      | `/login`      | Authentication page                 |
| Onboarding | `/onboarding` | KYC verification wizard             |
| Dashboard  | `/dashboard`  | Admin/verification hub              |

### Components

- **Header** - Navigation with auth status
- **OnboardingWizard** - Multi-step form with progress
- **FileUpload** - Drag-and-drop document upload
- **Camera** - Real-time video capture
- **Results** - Verification results display
- **Footer** - Security badges and links

## 🔧 Environment Setup on New Machine

### macOS / Linux

```bash
# 1. Install Homebrew (macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js
brew install node

# 3. Install Python
brew install python3

# 4. Install Docker
brew install docker

# 5. Clone project
git clone https://github.com/yourusername/hc402-kyc-platform.git
cd hc402-kyc-platform

# 6. Follow Quick Start steps above
```

### Windows (PowerShell)

```powershell
# 1. Install Chocolatey (run as Admin)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Install prerequisites
choco install nodejs python docker-desktop git -y

# 3. Clone project
git clone https://github.com/yourusername/hc402-kyc-platform.git
cd hc402-kyc-platform

# 4. Follow Quick Start steps with Windows-specific commands
```

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend won't connect:**

```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process (if needed)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Database issues:**

```bash
# Delete and recreate SQLite
rm backend/kyc.db
python backend/main.py  # Recreates schema
```

**CORS errors:**

- Ensure `PYTHON_BACKEND_URL` is correctly set in `.env`
- Backend must have CORS middleware enabled
- Check both frontend and backend are running

**File upload fails:**

- Check `uploads/` directory exists and is writable
- Verify MAX_FILE_SIZE is not too restrictive
- Ensure file format is JPEG or PNG

### Enable Debug Logging

```bash
# Backend
export DEBUG=True
uvicorn main:app --reload --log-level debug

# Frontend
export DEBUG=true
npm run dev
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Setup database backups
- [ ] Configure CDN for static assets
- [ ] Setup monitoring and alerts
- [ ] Configure CI/CD pipeline

### Deploy with Docker

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start services
docker-compose up -d

# View logs
docker-compose logs backend frontend

# Scale services (if needed)
docker-compose up -d --scale backend=3
```

## 📈 Performance Optimization

### Frontend

- Image optimization with Next.js `Image` component
- Code splitting with dynamic imports
- Service worker caching for offline support
- Lighthouse score optimization

### Backend

- Database query optimization with indexes
- Async processing with background tasks
- GPU acceleration for ML models
- Response compression with gzip

## 🔐 Security Best Practices

1. **Always use HTTPS** in production
2. **Keep dependencies updated** - Run `npm audit fix` regularly
3. **Validate all inputs** - Both frontend and backend
4. **Rotate secrets regularly** - Change SECRET_KEY monthly
5. **Use CORS properly** - Specify allowed origins
6. **Enable CSRF protection** - Configured by default
7. **Sanitize file uploads** - Check file types and sizes
8. **Monitor logs** - Check for suspicious activity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💼 Support

For support, email: support@hc402.dev | Open an issue: [GitHub Issues](https://github.com/yourusername/hc402-kyc-platform/issues)

---

**Last Updated:** February 2026 | **Version:** 1.0.0
