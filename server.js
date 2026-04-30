// ====================================================
// DEMARRAGE DU SERVEUR
// ====================================================

// On importe l'application configuree dans app.js
const app = require('./app');

// Le port sur lequel le serveur va ecouter
const PORT = 3000;

// On demarre le serveur
app.listen(PORT, () => {
    console.log('Serveur démarre sur http://localhost:' + PORT );
});

