# 🚀 Quick Start Guide

Get your Password Vault running in minutes!

## Option 1: Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for development)

### Start Development Environment

1. **Clone and navigate to the project**
   ```bash
   git clone <your-repo-url>
   cd password-vault
   ```

2. **Run the development setup script**
   ```bash
   ./scripts/dev.sh
   ```

   Or manually:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Start Production Environment

1. **Update environment variables**
   Edit `.env.local` with your production values

2. **Run the production setup script**
   ```bash
   ./scripts/setup.sh
   ```

   Or manually:
   ```bash
   docker-compose up --build -d
   ```

## Option 2: Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MongoDB URI
   ```

3. **Start MongoDB**
   ```bash
   # Option A: Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Option B: Using local MongoDB
   mongod
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

1. **Create an account** - Sign up with your email and password
2. **Set master password** - This encrypts your vault data (remember it!)
3. **Generate passwords** - Use the password generator
4. **Store passwords** - Add items to your vault
5. **Test search** - Search and filter your stored passwords

## 🔧 Troubleshooting

### Docker Issues
- Make sure Docker is running: `docker info`
- Check container logs: `docker-compose logs`
- Rebuild containers: `docker-compose up --build`

### MongoDB Connection Issues
- Check if MongoDB is running: `docker ps`
- Verify connection string in `.env.local`
- Check MongoDB logs: `docker logs password-vault-db`

### Application Issues
- Check application logs: `docker logs password-vault-app`
- Restart containers: `docker-compose restart`
- Clear cache: `docker-compose down && docker-compose up --build`

## 📱 Features to Test

- ✅ User registration and login
- ✅ Password generation with different options
- ✅ Adding vault items with encryption
- ✅ Searching and filtering vault items
- ✅ Copying passwords to clipboard
- ✅ Editing and deleting vault items
- ✅ Master password encryption/decryption

## 🔐 Security Notes

- Your master password is never stored on the server
- All sensitive data is encrypted client-side
- Clipboard auto-clears after 15 seconds
- Passwords are never logged in plain text

## 📞 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Create an issue in the GitHub repository
- Review the API endpoints and database schema

---

**Ready to go?** Run `./scripts/dev.sh` and start securing your passwords! 🎉
