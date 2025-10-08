# Password Vault

A secure password management application built with Next.js, TypeScript, and MongoDB.

## Features

- 🔐 Secure user authentication with JWT
- 🔒 AES encryption for password storage
- 🎯 Advanced password generator with customizable options
- 💾 Secure vault for storing passwords
- 🎨 Modern, responsive UI with dark theme
- ⚡ Fast performance with Next.js 14

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Encryption**: AES-256 encryption
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_jwt_secret_key
NEXTAUTH_URL=your_app_url
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Production Requirements

- Node.js 18+ 
- MongoDB Atlas or MongoDB instance
- Environment variables configured

## License

MIT License