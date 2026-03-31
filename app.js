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

// Route de test temporaire pour verifier la connexion BDD 
app.get('/', (req, res) => {
 // req.getConnection vient du middleware express-myconnection
 req.getConnection((err, connection) => {
 if (err) {
 console.log('Erreur connexion BDD :', err);
 return res.send('Erreur de connexion a la base de donnees');
 }
 // On fait une requete simple pour tester
 connection.query('SELECT * FROM vehicules', (err, resultats) => {
 if (err) {
 console.log('Erreur requete :', err);
 return res.send('Erreur dans la requete SQL');
 }
 // On affiche les resultats dans le terminal
 console.log('Vehicules trouves :', resultats);
 // On envoie les resultats a la page EJS
 res.render('accueil', { vehicules: resultats });
 });
 });
});


// ====================================================
// ROUTE : afficher les vehicules disponibles
// Methode : GET (on RECUPERE des donnees)
// URL : /vehicules
// ====================================================
app.get('/vehicules', (req, res) => {
 req.getConnection((err, connection) => {
 if (err) {
 return res.status(500).send('Erreur serveur');
 }
 // On recupere uniquement les vehicules disponibles
 connection.query(
 'SELECT * FROM vehicules WHERE disponible = 1',
 (err, vehicules) => {
 if (err) {
 return res.status(500).send('Erreur requete');
 }
 // On envoie les donnees a la vue EJS
 res.render('vehicules', { vehicules: vehicules });
 }
 );
 });
});

//=================================================
// Afficher le formulaire d inscription 
//=================================================

app.get('/inscription', (req, res) => {
 res.render('inscription');
});

//==========================================
// Traiter le formulaire d inscription 
//==========================================
// Methode : POST (on ENVOIE des donnees)
app.post('/inscription', (req, res) => {
 // req.body contient les donnees du formulaire
 // grace au middleware express.urlencoded()
 const nom = req.body.nom;
 const prenom = req.body.prenom;
 const email = req.body.email;
 const mot_de_passe = req.body.mot_de_passe;
 req.getConnection((err, connection) => {
 if (err) {
 return res.status(500).send('Erreur serveur');
 }
 // Les ? seront remplaces par les valeurs du tableau
 // Dans l ordre : ?, ?, ?, ? = nom, prenom, email, mot_de_passe
 connection.query(
 'INSERT INTO clients (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)',
 [nom, prenom, email, mot_de_passe],
 (err, resultat) => {
 if (err) {
 console.log('Erreur inscription :', err);
 return res.status(500).send('Erreur lors de l inscription');
 }
 // Inscription reussie : on redirige vers la page de connexion
 res.redirect('/connexion');
 }
 );
 });
});

// ===============================================
// Afficher le formulaire de connexion JavaScript
//================================================
app.get('/connexion', (req, res) => {
 res.render('connexion');
});

// =================================================
// Traiter la connexion
// =================================================
app.post('/connexion', (req, res) => {
 const email = req.body.email;
 const mot_de_passe = req.body.mot_de_passe;
 req.getConnection((err, connection) => {
 if (err) {
 return res.status(500).send('Erreur serveur');
 }
 connection.query(
 'SELECT * FROM clients WHERE email = ? AND mot_de_passe = ?',
 [email, mot_de_passe],
 (err, resultats) => {
 if (err) {
 return res.status(500).send('Erreur requete');
 }
 // Si on trouve un client avec cet email et ce mot de passe
 if (resultats.length > 0) {
 // On stocke les infos du client dans la session
 req.session.client = resultats[0];
 res.redirect('/vehicules');
 } else {
 res.send('Email ou mot de passe incorrect');
 }
 }
 );
 });
});

// =============================================================
// Afficher le formulaire de reservation pour un vehicule precis
// =============================================================

// :id est un parametre dynamique dans l URL
// Ex : /reservation/3 => req.params.id = 3
app.get('/reservation/:id', (req, res) => {
 if (!req.session.client) {
 return res.redirect('/connexion');
 }
 req.getConnection((err, connection) => {
 if (err) { return res.status(500).send('Erreur serveur'); }
 connection.query(
 'SELECT * FROM vehicules WHERE id = ?',
 [req.params.id],
 (err, resultats) => {
 if (err) { return res.status(500).send('Erreur requete'); }
 res.render('reservation', { vehicule: resultats[0] });
 }
 );
 });
});


// =====================================================
// Traiter la reservation 
// =====================================================

app.post('/reservation', (req, res) => {
 if (!req.session.client) {
 return res.redirect('/connexion');
 }
 const id_client = req.session.client.id;
 const id_vehicule = req.body.id_vehicule;
 const date_debut = req.body.date_debut;
 const date_fin = req.body.date_fin;
 req.getConnection((err, connection) => {
 if (err) { return res.status(500).send('Erreur serveur'); }
 connection.query(
 'INSERT INTO reservations (id_client, id_vehicule, date_debut, date_fin) VALUES (?, ?, ?, ?)',
 [id_client, id_vehicule, date_debut, date_fin],
 (err, resultat) => {
 if (err) { return res.status(500).send('Erreur reservation'); }
 res.redirect('/mes-reservations');
 }
 );
 });
});
 
// ============================================
// Afficher les reservations du client connecte
// ============================================
app.get('/mes-reservations', (req, res) => {
 if (!req.session.client) {
 return res.redirect('/connexion');
 }
 req.getConnection((err, connection) => {
 if (err) {
 return res.status(500).send('Erreur serveur');
 }
 // JOIN : on recupere les infos du vehicule en meme temps
 connection.query(
 'SELECT r.*, v.marque, v.modele, v.prix_journalier ' +
 'FROM reservations r ' +
 'JOIN vehicules v ON r.id_vehicule = v.id ' +
 'WHERE r.id_client = ?',
 [req.session.client.id],
 (err, reservations) => {
 if (err) {
 return res.status(500).send('Erreur requete');
 }
 res.render('mes-reservations', { reservations: reservations });
 }
 );
 });
});



// ====================================================
// EXPORT : on exporte app pour que server.js puisse l'utiliser
// ====================================================
module.exports = app;