# 🚀 Guide de Démarrage Rapide

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (version 16 ou supérieure)
- **MySQL** (version 8 ou supérieure)
- **npm** ou **yarn**

## 🗄️ Configuration de la Base de Données

### 1. Créer la base de données MySQL

```sql
CREATE DATABASE gestion_formation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Vérifier la connexion

Assurez-vous que MySQL est démarré et accessible avec les identifiants par défaut :
- **Host** : localhost
- **User** : root
- **Password** : (vide par défaut, ou votre mot de passe)

## ⚙️ Installation du Backend

### 1. Naviguer vers le dossier backend

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Le fichier `.env` est déjà créé. Modifiez-le si nécessaire :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_formation
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT** : Changez le `JWT_SECRET` en production !

### 4. Démarrer le serveur backend

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:5000**

✅ Les tables seront créées automatiquement au premier démarrage !

## 🎨 Installation du Frontend

### 1. Ouvrir un nouveau terminal et naviguer vers le dossier frontend

```bash
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer l'application React

```bash
npm run dev
```

L'application s'ouvre automatiquement sur **http://localhost:5173**

## 👤 Créer un Compte Admin

### Option 1 : Via l'API directement

Utilisez un outil comme **Postman** ou **curl** :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin",
    "prenom": "Super",
    "email": "admin@formation.com",
    "password": "admin123",
    "role": "admin",
    "telephone": "0612345678"
  }'
```

### Option 2 : Via l'interface

1. Allez sur **http://localhost:5173/register**
2. Remplissez le formulaire
3. Sélectionnez le rôle **"Participant"** ou **"Formateur"**
4. Pour créer un admin, utilisez l'Option 1

### Connexion

Utilisez les identifiants créés sur **http://localhost:5173/login**

## 📱 Utilisation de l'Application

### Rôle ADMIN
- Accès : `/admin`
- Fonctionnalités :
  - ✅ Créer, modifier, supprimer des formations
  - ✅ Gérer les formateurs
  - ✅ Planifier des sessions
  - ✅ Voir toutes les inscriptions

### Rôle FORMATEUR
- Accès : `/formateur`
- Fonctionnalités :
  - ✅ Voir ses formations assignées
  - ✅ Consulter ses évaluations

### Rôle PARTICIPANT
- Accès : `/participant`
- Fonctionnalités :
  - ✅ S'inscrire aux formations
  - ✅ Voir ses inscriptions
  - ✅ Évaluer les formations suivies

## 🛠️ Commandes Utiles

### Backend
```bash
npm start          # Démarrer en mode production
npm run dev        # Démarrer en mode développement (nodemon)
```

### Frontend
```bash
npm run dev        # Démarrer le serveur de développement
npm run build      # Créer le build de production
npm run preview    # Prévisualiser le build de production
```

## 🐛 Dépannage

### Erreur de connexion MySQL
- Vérifiez que MySQL est démarré
- Vérifiez les identifiants dans `.env`
- Vérifiez que la base de données `gestion_formation` existe

### Port déjà utilisé
- Backend : Changez `PORT` dans `.env`
- Frontend : Changez le port dans `vite.config.js`

### Erreur CORS
- Vérifiez que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend

## 📚 Structure du Projet

```
Gestion-formation/
├── backend/
│   ├── config/          # Configuration DB
│   ├── controllers/     # Logique métier
│   ├── middleware/      # Middleware JWT
│   ├── routes/          # Routes API
│   ├── .env             # Variables d'environnement
│   └── server.js        # Point d'entrée
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── context/     # Contexte Auth
│   │   ├── pages/       # Pages de l'application
│   │   ├── services/    # Services API
│   │   ├── App.jsx      # Composant principal
│   │   └── main.jsx     # Point d'entrée
│   └── package.json
│
└── README.md
```

## 🎯 Fonctionnalités Implémentées

✅ Authentification JWT complète
✅ Gestion des rôles (Admin, Formateur, Participant)
✅ CRUD complet des formations
✅ Gestion des formateurs
✅ Planification des sessions
✅ Système d'inscription
✅ Système d'évaluation
✅ Interface Material UI moderne
✅ Filtres sur la page d'accueil
✅ Protection des routes

## 📝 Comptes de Test

Après avoir créé un compte admin, vous pouvez créer des comptes de test :

**Admin**
- Email : admin@formation.com
- Password : admin123

**Formateur**
- Créez via l'inscription avec le rôle "Formateur"

**Participant**
- Créez via l'inscription avec le rôle "Participant"

## 🎓 Projet Pédagogique

Ce projet est conçu pour être simple et pédagogique :
- Code clair et bien commenté
- Architecture MVC simple
- Pas de complexité inutile
- Idéal pour l'apprentissage

## 📞 Support

En cas de problème :
1. Vérifiez que MySQL est démarré
2. Vérifiez les logs du backend dans le terminal
3. Vérifiez la console du navigateur pour les erreurs frontend
4. Assurez-vous que les deux serveurs (backend et frontend) sont démarrés

Bon développement ! 🚀
