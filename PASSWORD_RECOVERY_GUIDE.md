# 🔐 Password Recovery Guide

## 📋 **Two Types of Passwords in Your Vault**

### **1. Login Password (Account Password)**
- **What it is**: Used to log into your account
- **Storage**: Hashed with bcrypt in MongoDB
- **Recovery**: ✅ **NOW AVAILABLE** - Password reset feature added

### **2. Master Password**
- **What it is**: Used to encrypt/decrypt your vault data
- **Storage**: **NEVER stored** - only you know it
- **Recovery**: ❌ **IMPOSSIBLE** - if forgotten, all vault data is permanently lost

---

## 🔄 **How to Reset Your Login Password**

### **Step 1: Access Password Reset**
1. Go to http://localhost:3000
2. Click "Sign In" (if not already on login page)
3. Click "Forgot your password?" link

### **Step 2: Fill Out Reset Form**
1. Enter your email address
2. Enter your new password (minimum 6 characters)
3. Confirm your new password
4. Click "Reset Password"

### **Step 3: Login with New Password**
1. After successful reset, you'll see a success message
2. Use your new password to log in
3. Your vault data remains intact and encrypted

---

## ⚠️ **Important Security Notes**

### **Login Password Reset:**
- ✅ **Safe**: Your vault data remains encrypted
- ✅ **Secure**: Uses bcrypt hashing
- ✅ **Immediate**: Works instantly

### **Master Password:**
- ❌ **Cannot be reset**: It's never stored on our servers
- ❌ **Cannot be recovered**: If forgotten, data is permanently lost
- ⚠️ **Critical**: This is by design for maximum security

---

## 🚨 **What Happens If You Forget Your Master Password**

### **The Reality:**
- Your vault data is encrypted with AES-256
- The encryption key is derived from your master password + email
- Without the master password, the data is mathematically impossible to decrypt
- This is a security feature, not a bug

### **Prevention Tips:**
1. **Write it down**: Store your master password in a secure physical location
2. **Use a memorable phrase**: Create a long, memorable passphrase
3. **Test it regularly**: Make sure you can access your vault
4. **Backup strategy**: Consider exporting important passwords to a separate secure location

---

## 🛠️ **Technical Details**

### **Password Reset API:**
```bash
POST /api/auth/reset-password
{
  "email": "your@email.com",
  "newPassword": "newpassword123",
  "resetToken": "MVP_RESET_TOKEN"
}
```

### **MVP Limitations:**
- Currently uses a simple reset token (`MVP_RESET_TOKEN`)
- No email verification (for demo purposes)
- In production, you'd implement:
  - Email-based reset tokens
  - Token expiration
  - Rate limiting
  - Email verification

### **Database Changes:**
```javascript
// Only the login password hash is updated
await User.findByIdAndUpdate(user._id, {
  password: hashedPassword, // New bcrypt hash
  updatedAt: new Date()
});
```

---

## 🔍 **Testing the Password Reset**

### **Test Scenario:**
1. Create an account with email: `test@example.com`
2. Add some vault items
3. "Forget" your login password
4. Use password reset feature
5. Login with new password
6. Verify vault data is still accessible (with original master password)

### **Expected Results:**
- ✅ Login password successfully changed
- ✅ Can login with new password
- ✅ Vault data remains encrypted and accessible
- ✅ Master password unchanged (still required for decryption)

---

## 📞 **Support**

If you encounter issues:

1. **Check application logs**:
   ```bash
   docker-compose -f docker-compose.dev.yml logs app-dev
   ```

2. **Verify database connection**:
   ```bash
   docker-compose -f docker-compose.dev.yml exec mongodb mongosh password-vault
   ```

3. **Reset everything** (if needed):
   ```bash
   docker-compose -f docker-compose.dev.yml down
   docker volume rm assignmentpasswordgenmvp_mongodb_dev_data
   docker-compose -f docker-compose.dev.yml up --build
   ```

---

## 🔒 **Security Best Practices**

### **For Login Password:**
- Use a strong, unique password
- Consider using a password manager for your login password
- Enable 2FA when available (future feature)

### **For Master Password:**
- Make it long and memorable (20+ characters)
- Use a mix of letters, numbers, symbols
- Consider using a passphrase: "MySecureVault2024!"
- Write it down in a secure physical location
- Never share it with anyone

### **General Security:**
- Keep your application updated
- Use HTTPS in production
- Regularly backup important data
- Monitor for suspicious activity

---

**Remember**: Your vault data is only as secure as your master password. Choose wisely and keep it safe! 🔐
