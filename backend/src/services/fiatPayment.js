/**
 * Service de paiement classique (Fiat)
 * Remplace l'ancien système Lightning Network
 */
class FiatPaymentService {
  constructor() {
    // Configuration des prix (en CFA par exemple)
    this.PRICING = {
      'residence': 0, // Gratuit
      'birth': 1000,
      'marriage': 2500,
      'death': 1000,
      'identity': 5000
    };
  }

  /**
   * Vérifie si un certificat est gratuit
   */
  isFreeDocument(type) {
    return this.PRICING[type] === 0;
  }

  /**
   * Simule la vérification d'un paiement auprès de Wave/Orange Money/Stripe
   * @param {string} transactionId - Le numéro de reçu donné par le frontend
   * @returns {boolean} - true si le paiement existe et est valide
   */
  async verifyPayment(transactionId) {
    if (!transactionId) {
      return false;
    }

    // Dans la réalité, on ferait un appel axios.get('https://api.wave.com/verify/' + transactionId)
    // Ici on simule une réponse API avec un petit délai
    return new Promise((resolve) => {
      setTimeout(() => {
        // En mode Hackathon/Demo, si le frontend nous donne un transactionId, on le valide
        resolve(transactionId.length > 5); 
      }, 500);
    });
  }
}

module.exports = new FiatPaymentService();
