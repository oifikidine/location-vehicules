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

// =======================================================
// CONFIGURATION DU MOTEUR DE TEMPLATE (EJS)
// =======================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =======================================================
// MIDDLEWARES
// =======================================================
app.use