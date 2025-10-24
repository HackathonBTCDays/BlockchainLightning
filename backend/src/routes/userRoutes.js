import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Créer un utilisateur
router.post('/', userController.createUser);

// Obtenir un utilisateur par ID
router.get('/:userId', userController.getUserById);

// Obtenir tous les utilisateurs
router.get('/', userController.getAllUsers);

// Mettre à jour un utilisateur
router.put('/:userId', userController.updateUser);

// Supprimer un utilisateur
router.delete('/:userId', userController.deleteUser);

// Obtenir les permissions d'un utilisateur
router.get('/:userId/permissions', userController.getUserPermissions);

// Obtenir les statistiques des utilisateurs
router.get('/stats/overview', userController.getUserStats);

export default router;
