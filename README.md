# Course-Hive 🐝

A buzzing hub of modern, AI-powered courses. It is a  platform where educators can create and sell text-based courses with intelligent content generation. Built with React, Node.js, Express.js and MongoDB.

## ✨ Features

- **🎓 Course Management**: Create, edit, and manage text-based courses
- **🤖 AI Content Generation**: Generate course content using Google's Gemini AI
- **💳 Payment Integration**: Secure payments with Stripe
- **👥 User Management**: Separate admin and user portals
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔐 Authentication**: Secure JWT-based authentication
- **📝 Markdown Support**: Rich content formatting for course materials
- **🎨 Modern UI**: Dark theme with smooth animations

## 🏗️ Architecture

```
Course-Hive/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/     # Admin dashboard components
│   │   │   ├── courses/   # Course-related components
│   │   │   ├── layout/    # Header, footer, etc.
│   │   │   └── common/    # Reusable components
│   │   └── utils/         # Constants and utilities
└── backend/           # Node.js/Express API
    ├── controllers/   # API route handlers
    ├── models/        # MongoDB schemas
    ├── routes/        # API routes
    ├── middleware/    # Authentication middleware
    └── services/      # Business logic (AI service)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Cloudinary** account
- **Stripe** account
- **Google AI Studio** account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Course-Hive
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables** (see detailed setup below)

4. **Start the application**
   ```bash
   # Start backend (from backend directory)
   npm start

   # Start frontend (from frontend directory)
   npm run dev
   ```

## 🔧 Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development

# JWT Authentication
JWT_USER_PASSWORD=your_jwt_user_secret_key_here
JWT_ADMIN_PASSWORD=your_jwt_admin_secret_key_here

# AI Service
GEMINI_API_KEY=your_gemini_api_key_here

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key_here
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# Stripe Payment
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Backend API
VITE_BACKEND_URL=http://localhost:3000
```

## 🔑 Service Setup Guide

### 1. MongoDB Atlas Setup

**Step 1: Create Account**
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
- Sign up for a free account

**Step 2: Create Cluster**
- Click "Build a Database"
- Choose "FREE" tier (M0)
- Select your preferred cloud provider and region
- Click "Create"

**Step 3: Get Connection String**
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with your database name (e.g., `course-hive`)
- Add to env file

**Example:**
```
mongodb+srv://username:password@cluster.mongodb.net/db
```

### 2. Cloudinary Setup

**Step 1: Create Account**
- Go to [Cloudinary](https://cloudinary.com/)
- Sign up for a free account

**Step 2: Get Credentials**
- Go to Dashboard → Account Details
- Copy the following values:
  - **Cloud Name**
  - **API Key**
  - **API Secret**

**Step 3: Add to Environment**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. JWT Secret Setup

**Generate a secure JWT secret:**
```bash
# Option 1: Use Node.js crypto
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Use online generator
# Visit: https://generate-secret.vercel.app/64
```

**Add to environment:**
```env
JWT_USER_PASSWORD=your_generated_jwt_secret_here
JWT_ADMIN_PASSWORD=your_generated_jwt_secret_here
```

### 4. Stripe Setup

**Step 1: Create Account**
- Go to [Stripe](https://stripe.com/)
- Sign up for a free account

**Step 2: Get API Keys**
- Go to Developers → API Keys
- Copy both keys:
  - **Publishable key** (starts with `pk_test_`)
  - **Secret key** (starts with `sk_test_`)

**Step 3: Add to Environment**

Backend (`.env`):
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

Frontend (`.env`):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 5. Google AI Studio (Gemini) Setup

**Step 1: Access AI Studio**
- Go to [Google AI Studio](https://aistudio.google.com/apikey)
- Sign in with your Google account

**Step 2: Create API Key**
- Click "Create API Key"
- Copy the generated API key

**Step 3: Add to Environment**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 Project Features Explained

### For Admins
- **Dashboard**: Overview of courses, sales, and statistics
- **Course Management**: Create, edit, view and delete courses
- **AI Content Generation**: Generate course content using AI
- **Content Sections**: Organize course content into sections
- **Markdown Support**: Rich text formatting for course materials

### For Users
- **Course Discovery**: Browse available courses
- **Course Details**: View detailed course information
- **Purchase Flow**: Secure payment processing
- **My Courses**: Access purchased courses
- **Content Viewing**: Read course content with markdown support

### AI Features
- **Auto Generation**: Generate content based on section headings
- **Custom Prompts**: Use custom prompts for specific content
- **Context Awareness**: AI considers course title, description and section title
- **Educational Focus**: Content optimized for learning

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm start          # Start development server with nodemon
npm run build      # Build for production
```

**Frontend:**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### API Endpoints

**Authentication:**
- `POST /api/v1/user/signup` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/admin/signup` - Admin registration
- `POST /api/v1/admin/login` - Admin login

**Courses:**
- `GET /api/v1/course/` - Get all courses
- `POST /api/v1/course/` - Create course (admin)
- `PUT /api/v1/course/:id` - Update course (admin)
- `DELETE /api/v1/course/:id` - Delete course (admin)

**AI Content:**
- `POST /api/v1/ai/generate-content` - Generate AI content (admin)

**Payments:**
- `POST /api/v1/course/purchase` - Purchase course

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Configured for frontend-backend communication
- **Input Validation**: Request validation and sanitization
- **Environment Variables**: Sensitive data kept secure

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Set up environment variables
2. Build the project: `npm run build`
3. Deploy the `dist/` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**"MongoDB connection failed"**
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in Atlas

**"Stripe payment failed"**
- Verify your Stripe keys are correct
- Ensure you're using test keys for development

**"AI content generation failed"**
- Check your Gemini API key
- Verify the API key has proper permissions

**"Image upload failed"**
- Verify your Cloudinary credentials
- Check your cloud name, API key, and secret

### Getting Help

- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure all services are properly configured
- Check network connectivity for external services

---
Feel free to reach out with any questions or feedback. Happy learning with Course Hive! 🚀📱💬