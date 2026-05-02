import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 8080;

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=*, microphone=*, camera=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://*.googleapis.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://maps.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com https://maps.gstatic.com",
      "connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://maps.googleapis.com https://firestore.googleapis.com https://www.google-analytics.com",
      "frame-src https://www.google.com",
      "frame-ancestors 'none'"
    ].join('; ')
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