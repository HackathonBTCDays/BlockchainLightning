import userService from '../services/userService.js';

class UserController {
  /**
   * Crée un nouvel utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async createUser(req, res) {
    try {
      const { email, firstName, lastName, role = 'citizen' } = req.body;

      const result = await userService.createUser({
        email,
        firstName,
        lastName,
        role
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.status(201).json({
        success: true,
        user: result.user,
        message: result.message
      });

    } catch (error) {
      console.error('Error creating user:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Obtient un utilisateur par ID
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserById(req, res) {
    try {
      const { userId } = req.params;

      const result = await userService.getUserById(userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        user: result.user
      });

    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Obtient tous les utilisateurs
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getAllUsers(req, res) {
    try {
      const { role, status, search } = req.query;
      const filters = { role, status, search };

      const result = await userService.getAllUsers(filters);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        users: result.users,
        total: result.total
      });

    } catch (error) {
      console.error('Error getting all users:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Met à jour un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      const result = await userService.updateUser(userId, updateData);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error,
          details: result.details
        });
      }

      res.json({
        success: true,
        user: result.user,
        message: result.message
      });

    } catch (error) {
      console.error('Error updating user:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Supprime un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      const result = await userService.deleteUser(userId);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Obtient les permissions d'un utilisateur
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserPermissions(req, res) {
    try {
      const { userId } = req.params;

      const result = await userService.getUserPermissions(userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        permissions: result.permissions,
        role: result.role
      });

    } catch (error) {
      console.error('Error getting user permissions:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }

  /**
   * Obtient les statistiques des utilisateurs
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   */
  async getUserStats(req, res) {
    try {
      const result = await userService.getUserStats();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }

      res.json({
        success: true,
        stats: result.stats
      });

    } catch (error) {
      console.error('Error getting user stats:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        details: error.message
      });
    }
  }
}

export default new UserController();
