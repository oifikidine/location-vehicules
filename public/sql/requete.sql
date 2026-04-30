-- Créer la base de données SQL
CREATE DATABASE location_vehicules;
-- Dire à MySQL qu'on veut travailler dans cette base
USE location_vehicules;


CREATE TABLE vehicules ( 
 id INT AUTO_INCREMENT PRIMARY KEY,
 marque VARCHAR(50) NOT NULL,
 modele VARCHAR(50) NOT NULL,
 image VARCHAR(255),
 prix_journalier DECIMAL(10,2) NOT NULL,
 disponible TINYINT(1) DEFAULT 1
);


CREATE TABLE clients ( 
 id INT AUTO_INCREMENT PRIMARY KEY,
 nom VARCHAR(50) NOT NULL,
 prenom VARCHAR(50) NOT NULL,
 email VARCHAR(100) NOT NULL UNIQUE,
 mot_de_passe VARCHAR(255) NOT NULL
);


CREATE TABLE reservations ( 
 id INT AUTO_INCREMENT PRIMARY KEY,
 id_client INT NOT NULL,
 id_vehicule INT NOT NULL,
 date_debut DATE NOT NULL,
 date_fin DATE NOT NULL,
 FOREIGN KEY (id_client) REFERENCES clients(id),
 FOREIGN KEY (id_vehicule) REFERENCES vehicules(id)
);


INSERT INTO vehicules (marque, modele, image, prix_journalier, disponible)
VALUES
('Renault', 'Clio', 'clio.jpg', 35.00, 1),
('Toyota', 'Yaris', 'yaris.jpg', 40.00, 1),
('Peugeot', '208', '208.jpg', 38.00, 1),
('Dacia', 'Sandero', 'sandero.jpg', 30.00, 0);



-- Afficher tous les vehicules disponibles SQL
SELECT * FROM vehicules WHERE disponible = 1;
-- Inscrire un nouveau client
INSERT INTO clients (nom, prenom, email, mot_de_passe)
VALUES (?, ?, ?, ?);
-- Verifier la connexion d un client
SELECT * FROM clients WHERE email = ? AND mot_de_passe = ?;
-- Creer une reservation
INSERT INTO reservations (id_client, id_vehicule, date_debut, date_fin)
VALUES (?, ?, ?, ?);






-- Route POST /vehicules/ajouter : ajouter un nouveau vehicule SQL
INSERT INTO vehicules (marque, modele, image, prix_journalier, disponible)
VALUES (?, ?, ?, ?, 1);
-- Route POST /reservation/supprimer : annuler une reservation
-- On verifie aussi que c'est le bon client (securite)
DELETE FROM reservations WHERE id = ? AND id_client = ?;