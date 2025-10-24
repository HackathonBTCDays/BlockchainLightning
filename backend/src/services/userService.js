import crypto from 'crypto';

class UserService {
  constructor() {
    this.users = new Map(); // En production, utiliser une base de données
    this.userRoles = new Map(); // En production, utiliser une base de données
    this.userPermissions = new Map(); // En production, utiliser une base de données
    
    // Initialiser avec des utilisateurs de démo
    this.initializeDemoUsers();
  }

  /**
   * Initialise les utilisateurs de démo
   */
  initializeDemoUsers() {
    const demoUsers = [
      {
        id: 'user_1',
        email: 'admin@certifast.sn',
        firstName: 'Admin',
        lastName: 'CertiFast',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_2',
        email: 'agent@certifast.sn',
        firstName: 'Agent',
        lastName: 'Mairie',
        role: 'agent',
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_3',
        email: 'citizen@example.com',
        firstName: 'Citoyen',
        lastName: 'Sénégalais',
        role: 'citizen',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    demoUsers.forEach(user => {
      this.users.set(user.id, user);
      this.userRoles.set(user.id, user.role);
    });
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Object} Résultat de la création
   */
  async createUser(userData) {
    try {
      const userId = crypto.randomBytes(16).toString('hex');
      
      const newUser = {
        id: userId,
        ...userData,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      // Valider les données utilisateur
      const validation = this.validateUserData(newUser);
      if (!validation.valid) {
        return {
          success: false,
          error: 'Données utilisateur invalides',
          details: validation.errors
        };
      }

      // Vérifier que l'email n'est pas déjà utilisé
      const existingUser = this.findUserByEmail(newUser.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Email déjà utilisé'
        };
      }

      // Créer l'utilisateur
      this.users.set(userId, newUser);
      this.userRoles.set(userId, newUser.role || 'citizen');

      return {
        success: true,
        user: {
          id: userId,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role || 'citizen',
          status: newUser.status,
          createdAt: newUser.createdAt
        },
        message: 'Utilisateur créé avec succès'
      };

    } catch (error) {
      console.error('Error creating user:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la création de l\'utilisateur',
        details: error.message
      };
    }
  }

  /**
   * Obtient un utilisateur par ID
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object|null} Utilisateur ou null
   */
  async getUserById(userId) {
    try {
      const user = this.users.get(userId);
      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
          }
        };
      }
      
      return {
        success: false,
        error: 'Utilisateur non trouvé'
      };
    } catch (error) {
      console.error('Error getting user by ID:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la récupération de l\'utilisateur',
        details: error.message
      };
    }
  }

  /**
   * Obtient tous les utilisateurs
   * @param {Object} filters - Filtres à appliquer
   * @returns {Array} Liste des utilisateurs
   */
  async getAllUsers(filters = {}) {
    try {
      let users = Array.from(this.users.values());
      
      // Appliquer les filtres
      if (filters.role) {
        users = users.filter(user => user.role === filters.role);
      }
      
      if (filters.status) {
        users = users.filter(user => user.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        users = users.filter(user => 
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      // Trier par date de création
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        })),
        total: users.length
      };
    } catch (error) {
      console.error('Error getting all users:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs',
        details: error.message
      };
    }
  }

  /**
   * Met à jour un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Object} Résultat de la mise à jour
   */
  async updateUser(userId, updateData) {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Valider les données de mise à jour
      const validation = this.validateUserData({ ...user, ...updateData });
      if (!validation.valid) {
        return {
          success: false,
          error: 'Données de mise à jour invalides',
          details: validation.errors
        };
      }

      // Mettre à jour l'utilisateur
      const updatedUser = {
        ...user,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.users.set(userId, updatedUser);
      
      // Mettre à jour le rôle si nécessaire
      if (updateData.role) {
        this.userRoles.set(userId, updateData.role);
      }

      return {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          role: updatedUser.role,
          status: updatedUser.status,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt
        },
        message: 'Utilisateur mis à jour avec succès'
      };

    } catch (error) {
      console.error('Error updating user:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la mise à jour de l\'utilisateur',
        details: error.message
      };
    }
  }

  /**
   * Supprime un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Object} Résultat de la suppression
   */
  async deleteUser(userId) {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      // Vérifier que ce n'est pas le dernier admin
      if (user.role === 'admin') {
        const adminCount = Array.from(this.users.values()).filter(u => u.role === 'admin').length;
        if (adminCount <= 1) {
          return {
            success: false,
            error: 'Impossible de supprimer le dernier administrateur'
          };
        }
      }

      // Supprimer l'utilisateur
      this.users.delete(userId);
      this.userRoles.delete(userId);

      return {
        success: true,
        message: 'Utilisateur supprimé avec succès'
      };

    } catch (error) {
      console.error('Error deleting user:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la suppression de l\'utilisateur',
        details: error.message
      };
    }
  }

  /**
   * Obtient les permissions d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Array} Permissions de l'utilisateur
   */
  async getUserPermissions(userId) {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé'
        };
      }

      const permissions = this.getRolePermissions(user.role);

      return {
        success: true,
        permissions,
        role: user.role
      };
    } catch (error) {
      console.error('Error getting user permissions:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la récupération des permissions',
        details: error.message
      };
    }
  }

  /**
   * Vérifie si un utilisateur a une permission
   * @param {string} userId - ID de l'utilisateur
   * @param {string} permission - Permission à vérifier
   * @returns {boolean} A la permission
   */
  async hasPermission(userId, permission) {
    try {
      const user = this.users.get(userId);
      if (!user) {
        return false;
      }

      const permissions = this.getRolePermissions(user.role);
      return permissions.includes(permission);
    } catch (error) {
      console.error('Error checking user permission:', error.message);
      return false;
    }
  }

  /**
   * Obtient les permissions d'un rôle
   * @param {string} role - Rôle de l'utilisateur
   * @returns {Array} Permissions du rôle
   */
  getRolePermissions(role) {
    const rolePermissions = {
      admin: [
        'create_certificate',
        'view_certificate',
        'verify_certificate',
        'delete_certificate',
        'manage_users',
        'view_analytics',
        'manage_settings',
        'view_payments',
        'manage_payments'
      ],
      agent: [
        'create_certificate',
        'view_certificate',
        'verify_certificate',
        'view_payments'
      ],
      citizen: [
        'request_certificate',
        'view_own_certificates',
        'verify_certificate'
      ]
    };

    return rolePermissions[role] || [];
  }

  /**
   * Valide les données utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Object} Résultat de la validation
   */
  validateUserData(userData) {
    const errors = [];

    // Validation de l'email
    if (!userData.email || !userData.email.includes('@')) {
      errors.push('Email invalide');
    }

    // Validation du prénom
    if (!userData.firstName || userData.firstName.length < 2) {
      errors.push('Prénom requis (minimum 2 caractères)');
    }

    // Validation du nom
    if (!userData.lastName || userData.lastName.length < 2) {
      errors.push('Nom de famille requis (minimum 2 caractères)');
    }

    // Validation du rôle
    const validRoles = ['admin', 'agent', 'citizen'];
    if (userData.role && !validRoles.includes(userData.role)) {
      errors.push('Rôle invalide');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Trouve un utilisateur par email
   * @param {string} email - Email de l'utilisateur
   * @returns {Object|null} Utilisateur ou null
   */
  findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  /**
   * Obtient les statistiques des utilisateurs
   * @returns {Object} Statistiques des utilisateurs
   */
  async getUserStats() {
    try {
      const users = Array.from(this.users.values());
      
      const stats = {
        total: users.length,
        byRole: {
          admin: users.filter(u => u.role === 'admin').length,
          agent: users.filter(u => u.role === 'agent').length,
          citizen: users.filter(u => u.role === 'citizen').length
        },
        byStatus: {
          active: users.filter(u => u.status === 'active').length,
          inactive: users.filter(u => u.status === 'inactive').length
        },
        recent: users.filter(u => {
          const createdAt = new Date(u.createdAt);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return createdAt > weekAgo;
        }).length
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting user stats:', error.message);
      return {
        success: false,
        error: 'Erreur lors de la récupération des statistiques',
        details: error.message
      };
    }
  }
}

export default new UserService();
