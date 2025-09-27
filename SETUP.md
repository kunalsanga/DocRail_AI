# KMRL Document Hub - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (already configured)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   Or use the batch file: `dev-start.bat`

3. **Access Application**
   - Local: http://localhost:3000
   - Network: http://192.168.57.129:3000

## 🔧 Configuration

### Environment Variables
The application is pre-configured with:
- **Gemini API Key**: `AIzaSyA58LIuUWGRAxwOdYrEdE7cCmDHgDBx9mw`
- **Project ID**: `projects/356396355547`

### AI Features Enabled
- ✅ Document Summarization (English/Malayalam)
- ✅ Bilingual Translation (English ↔ Malayalam)
- ✅ Safety Detection & Analysis
- ✅ Document Classification
- ✅ Entity Extraction
- ✅ Smart Routing

## 🌐 Language Support

### Bilingual Interface
- **English**: Full interface in English
- **Malayalam**: Full interface in Malayalam
- **Language Switcher**: Available in the header

### AI Processing
- Documents processed in both languages
- Context-aware translations
- Railway operations terminology support

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API endpoints
│   │   ├── translate/     # Gemini translation API
│   │   ├── pipeline/      # Document processing
│   │   └── safety/        # Safety detection
│   └── upload/            # Upload page
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utilities
│   └── gemini.ts         # Gemini API integration
└── data/                  # JSON data files
```

## 🛠️ Troubleshooting

### Development Server Issues
If you encounter file system errors:

1. **Clean Build Cache**
   ```bash
   rmdir /s /q .next
   npm run build
   ```

2. **Use Batch File**
   ```bash
   dev-start.bat
   ```

3. **Check Port**
   ```bash
   netstat -an | findstr :3000
   ```

### Performance Optimization
- The app is optimized for Windows long paths
- Webpack polling enabled for better file watching
- Turbo mode enabled for faster builds

## 🎯 Features

### Document Management
- Drag & drop file upload
- Multi-format support (PDF, DOCX, Images)
- Real-time processing status
- File size validation (10MB limit)

### AI Processing Pipeline
1. **OCR Text Extraction**
2. **Auto Classification**
3. **AI Summarization**
4. **Smart Routing**

### User Interface
- Responsive design
- Dark/light mode support
- Loading animations
- Error handling

## 📊 API Endpoints

- `/api/translate` - Gemini-powered translation
- `/api/pipeline/extract` - Document processing
- `/api/safety/detect` - Safety analysis
- `/api/annotations` - Document annotations
- `/api/audit` - Audit logging

## 🔐 Security

- Role-based access control
- Protected routes
- API key security
- Audit logging

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized uploads
- Cross-platform compatibility

---

**Ready to use!** 🎉
Your KMRL Document Hub is now running with full AI capabilities powered by Google Gemini.
