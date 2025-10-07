# 🔐 Crypto Implementation Notes

## What I Used and Why

### Encryption Library: Crypto-JS
**Choice**: `crypto-js` - A popular, well-maintained JavaScript cryptography library.

**Why**: 
- Provides AES encryption and PBKDF2 key derivation functions
- Works seamlessly in both browser and Node.js environments
- Well-documented with extensive community support
- No external dependencies or complex setup required

### Encryption Strategy

#### 1. **Key Derivation (PBKDF2)**
```javascript
const key = CryptoJS.PBKDF2(masterPassword, email, {
  keySize: 256 / 32,    // 256-bit key
  iterations: 10000     // 10,000 iterations for security
}).toString();
```

**Why PBKDF2**:
- Industry-standard key derivation function
- Resistant to rainbow table attacks
- Configurable iteration count for security vs performance
- Built into most cryptographic libraries

#### 2. **Data Encryption (AES-256)**
```javascript
const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
```

**Why AES-256**:
- Military-grade symmetric encryption
- Fast and efficient
- Widely supported and trusted
- 256-bit key provides excellent security margin

#### 3. **What Gets Encrypted**
- ✅ **Username/Email** - Encrypted
- ✅ **Password** - Encrypted  
- ✅ **Notes** - Encrypted
- ❌ **Title** - Unencrypted (for search functionality)
- ❌ **URL** - Unencrypted (for convenience)

**Rationale**: Title and URL remain unencrypted to enable server-side search and quick access, while all truly sensitive data (credentials and notes) are encrypted.

### Security Model

#### Client-Side Encryption
- All encryption/decryption happens in the user's browser
- Master password never leaves the client
- Server only stores encrypted blobs
- Even database administrators cannot see plaintext passwords

#### Key Management
- Encryption key is derived from master password + user email
- Key is never stored or transmitted
- Recreated on-demand during encryption/decryption
- Different users with same master password get different keys (due to unique email)

### Privacy Benefits

1. **Zero-Knowledge Architecture**: Server has zero knowledge of user passwords
2. **End-to-End Encryption**: Data encrypted before transmission
3. **No Backdoors**: Even application developers cannot access user data
4. **Compliance Ready**: Meets privacy regulations (GDPR, etc.)

### Trade-offs

#### Pros
- Maximum privacy and security
- No server-side key management complexity
- User maintains full control
- Works offline (encryption/decryption)

#### Cons
- Lost master password = lost data (no recovery)
- No password sharing between users
- Slightly more complex client-side code
- Search limited to unencrypted fields

### Alternative Considerations

**Could have used**:
- `Web Crypto API` - Browser-native, but less portable
- `Node.js crypto` - Server-side only
- `libsodium` - More advanced, but larger bundle size

**Chose Crypto-JS because**:
- Universal compatibility (browser + Node.js)
- Simple API and good documentation
- Proven track record in production applications
- Small bundle size for web applications

---

This implementation provides strong security while maintaining simplicity and user control over their encrypted data.
