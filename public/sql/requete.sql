-- Route POST /vehicules/ajouter : ajouter un nouveau vehicule SQL
INSERT INTO vehicules (marque, modele, image, prix_journalier, disponible)
VALUES (?, ?, ?, ?, 1);
-- Route POST /reservation/supprimer : annuler une reservation
-- On verifie aussi que c'est le bon client (securite)
DELETE FROM reservations WHERE id = ? AND id_client = ?;