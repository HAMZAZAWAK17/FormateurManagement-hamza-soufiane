# Migration de la base de données - Participants

## Problème
L'erreur 500 lors de l'inscription des participants est causée par des colonnes manquantes dans la table `participants`.

## Solution
Exécutez le script SQL suivant dans phpMyAdmin ou via la ligne de commande MySQL.

## Instructions

### Option 1: Via phpMyAdmin
1. Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
2. Sélectionnez la base de données `formateur_management`
3. Cliquez sur l'onglet "SQL"
4. Copiez et collez le contenu du fichier `add_participants_columns.sql`
5. Cliquez sur "Exécuter"

### Option 2: Via la ligne de commande
```bash
mysql -u root -p formateur_management < migrations/add_participants_columns.sql
```

## Vérification
Après l'exécution, vérifiez que la table `participants` contient bien les colonnes:
- `utilisateur_id` (INT, NULL)
- `password_temporaire` (VARCHAR(255), NULL)

## Test
Essayez de nouveau de vous inscrire en tant que participant. L'erreur 500 devrait être résolue.
