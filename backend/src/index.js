import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import paymentRoutes from './routes/paymentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
  console.log(`LNbits URL: ${config.lnbits.url}`);
  console.log(`Bitcoin Network: ${config.bitcoin.network}`);
});

export default app;
