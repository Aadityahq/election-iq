import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

// Security headers middleware
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict feature access
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Enforce HTTPS (if behind HTTPS proxy)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
    // Content Security Policy (allows our own resources and Google APIs)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https://maps.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://maps.googleapis.com; frame-ancestors 'none';"
    );
  
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/test', (_req, res) => {
  res.json({ message: 'Server running on Cloud Run' });
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});