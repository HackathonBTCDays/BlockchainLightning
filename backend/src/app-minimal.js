import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import des routes
import paymentRoutes from './routes/paymentRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

// Configuration des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes API
app.use('/api/payments', paymentRoutes);
app.use('/api/certificates', certificateRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0-minimal',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'CertiFast API Minimal - Système de Certificats Numériques avec Lightning Network',
    version: '1.0.0-minimal',
    endpoints: {
      health: '/health',
      payments: '/api/payments',
      certificates: '/api/certificates'
    },
    features: [
      'Paiements Lightning via LNbits',
      'Génération de certificats',
      'Vérification blockchain',
      'API REST simple'
    ]
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 CertiFast API Minimal démarrée sur le port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8081'}`);
  console.log(`🔗 LNbits URL: ${process.env.LNBITS_URL || 'http://localhost:5000'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💡 API Documentation: http://localhost:${PORT}/`);
});

export default app;
