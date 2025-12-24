# Gestion Centre de Formation

Projet de fin de module pour la gestion d'un centre de formation.

## Structure du Projet

- `/Backend`: Serveur Express.js avec MySQL.
- `/Frontend`: Application React.js avec Vite, Tailwind CSS et Framer Motion.

## Installation

### 1. Base de données
Exécutez le script `database.sql` dans votre environnement MySQL (phpMyAdmin, MySQL Workbench, etc.).

### 2. Backend
```bash
cd Backend
npm install
npm run dev
```
Assurez-vous d'avoir un fichier `.env` avec les informations suivantes :
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=formateur_management
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=votre_secret_tres_long_et_sur
```

### 3. Frontend
```bash
cd Frontend
npm install
npm run dev
```

## Fonctionnalités (Tâche 1)
- Interface d'authentification moderne et responsive.
- Gestion des rôles : Admin, Formateur, Assistant.
- Sécurisation des routes et des mots de passe (Bcrypt + JWT).

## Fonctionnalités (Tâche 2)
- Interface de gestion des formations (liste et ajout).
- CRUD formations avec validation des données (backend).
- Composant Layout réutilisable avec sidebar de navigation.

## Fonctionnalités (Tâche 3)
- Interface de gestion des formateurs (liste et ajout).
- CRUD formateurs avec mots-clés et remarques.
- Validation des données et gestion des compétences.
- Accès réservé aux administrateurs.

## Fonctionnalités (Tâche 4)
- Interface de gestion des entreprises clientes (liste et ajout).
- CRUD entreprises avec coordonnées complètes (nom, adresse, téléphone, email, URL).
- Validation des formats email et téléphone.
- Accès pour Admin et Assistant.
