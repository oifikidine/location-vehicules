// ======================================================
// IMPORTS : on charge les outils dont on a besoin
// ======================================================

// Express : le framework pour créer le serveur web
const express = require('express');
// mysql2 : le pilote pour communiquer avec MySQL.
const mysql2 = require('mysql2');
// express-myconnection : middleware pour connecter Express à MySQL
const myConnection = require('express-myconnection');
// path : module Node.js pour gérer les chemins de fichiers
const path = require('path');
// express-session : pour gérer les sessions (garder un client connecte)
const session = require('express-session');

// =======================================================
// CREATION DE L'APPLICATION EXPRESS
// =======================================================
const app = express();

// ====================================================
// CONFIGURATION DU MOTEUR DE TEMPLATE (EJS)
// ====================================================

// On dit à Express : "utilise EJS pour transformer les fichiers .ejs en HTML"
// Sans cette ligne, Express ne sait pas lire les fichiers EJS
app.set('view engine', 'ejs');


// On dit à Express : "les fichiers .ejs sont dans le dossier views/"
// __dirname = le chemin du dossier où se trouve ce fichier (app.js)
// path.join = colle les morceaux du chemin ensemble (gère les / et \ automatiquement)
app.set('views', path.join(__dirname, 'views'));

// ====================================================
// MIDDLEWARES
// Un middleware = une fonction qui s'exécute à CHAQUE requête
// avant d'arriver dans tes routes
// C'est comme un agent de sécurité : tout le monde passe devant lui
// ====================================================

// Permet à Express de lire les données envoyées en format JSON
app.use(express.json());


// Permet à Express de lire les données envoyées par un formulaire HTML
// Sans ça, quand un utilisateur clique "Envoyer", req.body serait vide
// C'est LE middleware le plus important pour les formulaires
app.use(express.urlencoded({ extended: true }));

// Tout ce qui est dans le dossier public/ est accessible par le navigateur
// Exemple : <link href="/css/style.css"> → Express va chercher public/css/style.css
// C'est grâce à cette ligne que le CSS, les images et le SQL sont accessibles
app.use(express.static(path.join(__dirname, 'public')));

// Active le système de sessions (garder un utilisateur connecté)
// secret = une clé pour sécuriser le cookie (peut être n'importe quel texte)
// resave: false = ne pas re-sauvegarder une session qui n'a pas changé
// saveUninitialized: false = ne pas créer de session vide pour rien
app.use(session({
    secret: 'location-vehicules-secret',
    resave: false,
    saveUninitialized: false
}));


// ====================================================
// CONNEXION A LA BASE DE DONNEES MYSQL
// ====================================================
const optionsConnexionBaseDeDonnees = {
    host: 'localhost',
    user: 'root',
    password: 'rsma2026',
    database: 'location_vehicules',
};
// Middleware de connexion : chaque requete aura accès à la BDD
app.use(myConnection(mysql2, optionsConnexionBaseDeDonnees, 'pool'));

// ====================================================
// ROUTES (on les ajoutera a l etape 6)
// ====================================================
// Route d'accueil - pour tester que le serveur marche
app.get('/', (req, res) => {
    res.render('accueil');
});

// ====================================================
// EXPORT : on exporte app pour que server.js puisse l'utiliser
// ====================================================
module.exports = app;