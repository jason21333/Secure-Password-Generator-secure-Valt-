# Password Vault - Secure Password Manager

A secure password manager built with Next.js, TypeScript, and MongoDB featuring client-side encryption for maximum privacy.

## Features

### 🔐 Security First
- **Client-side encryption** - Your passwords are encrypted before leaving your browser
- **Master password protection** - Only you can decrypt your data
- **No plaintext storage** - Server never sees your actual passwords
- **JWT authentication** - Secure session management

### 🎯 Core Functionality
- **Password Generator** - Create strong passwords with customizable options
- **Secure Vault** - Store passwords with titles, usernames, URLs, and notes
- **Copy to Clipboard** - Auto-clearing clipboard for security
- **Search & Filter** - Find passwords quickly
- **CRUD Operations** - Create, read, update, and delete vault items

### 🛠 Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **MongoDB** for data storage
- **Tailwind CSS** for styling
- **Docker** support for easy deployment

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Encryption**: Crypto-JS (PBKDF2 + AES)
- **Deployment**: Docker, Docker Compose

## Getting Started

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- MongoDB (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd password-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```
   MONGODB_URI=mongodb://localhost:27017/password-vault
   NEXTAUTH_SECRET=your-super-secret-jwt-key
   NEXTAUTH_URL=http://localhost:3000
   ```

### Running with Docker (Recommended)

1. **Development mode with hot reload**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Production mode**
   ```bash
   docker-compose up --build
   ```

### Running Locally

1. **Start MongoDB** (if not using Docker)
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or using Docker for just MongoDB
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Create Account
- Sign up with your email and password
- Remember your password - it's used for authentication

### 2. Set Master Password
- Enter a master password when first accessing your vault
- This encrypts/decrypts your stored passwords
- **Important**: Don't forget this password - it cannot be recovered!

### 3. Generate Passwords
- Use the password generator to create strong passwords
- Customize length, character types, and exclude lookalikes
- Copy passwords directly to clipboard

### 4. Store Passwords
- Add new vault items with title, username, password, URL, and notes
- All sensitive data is encrypted with your master password
- Search and filter your stored passwords

## Security Features

### Client-Side Encryption
- **Algorithm**: AES-256 encryption with PBKDF2 key derivation
- **Key Generation**: Based on your master password + email
- **Encryption**: Username, password, and notes are encrypted
- **Storage**: Only encrypted data is stored on the server

### Privacy Protection
- Server never sees plaintext passwords
- Master password never leaves your browser
- Auto-clearing clipboard (15-second timeout)
- No logging of sensitive data

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Sign in

### Vault Management
- `GET /api/vault` - Get all vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

### Password Generation
- `POST /api/password/generate` - Generate password

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### VaultItems Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  username: string (encrypted),
  password: string (encrypted),
  url: string,
  notes: string (encrypted),
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Environment Variables
```bash
MONGODB_URI=mongodb://your-mongodb-connection-string
NEXTAUTH_SECRET=your-jwt-secret-key
NEXTAUTH_URL=https://your-domain.com
```

### Production Deployment
1. Update environment variables
2. Build and deploy with Docker:
   ```bash
   docker-compose up --build -d
   ```

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
├── contexts/           # React contexts
├── lib/               # Utility libraries
├── models/            # MongoDB models
└── types/             # TypeScript types
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Considerations

1. **Master Password**: Choose a strong, unique master password
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Keep secrets secure
4. **Regular Backups**: Backup your encrypted vault data
5. **Updates**: Keep dependencies updated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the GitHub repository.

---

**Note**: This is a MVP (Minimum Viable Product) for demonstration purposes. For production use, consider additional security measures and features.
