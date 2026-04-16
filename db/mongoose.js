const mongoose = require('mongoose');
require('dotenv').config();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// NE PAS quitter l'application en cas d'erreur de connexion
mongoose.connect(process.env.MONGODB_URI, options)
  .then(() => {
    console.log('🔌 Connexion à MongoDB établie');
  })
  .catch((err) => {
    console.error('💥 Erreur de connexion:', err.message);
    console.log('⚠️ L\'application continue sans base de données (mode dégradé)');
    // Ne pas appeler process.exit(1)
  });

mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️ Erreur Mongoose:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose déconnecté de MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Connexion fermée - Arrêt de l\'application');
  process.exit(0);
});

module.exports = mongoose;