# 🎓 Application de Gestion de Centre de Formation

## 📋 Description
Application web complète pour la gestion d'un centre de formation avec 3 rôles utilisateurs : Admin, Formateur et Participant.

## 🛠️ Stack Technique
- **Frontend** : React (Vite) + Material UI
- **Backend** : Node.js + Express
- **Base de données** : MySQL
- **Authentification** : JWT (JSON Web Tokens)

## 📁 Structure du Projet
```
Gestion-formation/
├── backend/              # API REST avec Express
│   ├── config/          # Configuration (DB, JWT)
│   ├── controllers/     # Logique métier
│   ├── models/          # Modèles de données
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware (auth, validation)
│   └── server.js        # Point d'entrée
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages par rôle
│   │   ├── services/    # Services API
│   │   └── App.jsx      # Composant principal
│   └── package.json
│
└── README.md
```

## 👥 Rôles Utilisateurs

### 1. ADMIN
- Gestion des formations (CRUD)
- Gestion des formateurs (CRUD)
- Planification des sessions
- Vue d'ensemble des inscriptions

### 2. FORMATEUR
- Consultation de ses formations assignées
- Consultation des évaluations reçues
- Gestion de son profil

### 3. PARTICIPANT
- Consultation du catalogue de formations
- Inscription aux formations
- Évaluation des formations suivies

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- MySQL (v8+)
- npm ou yarn

### Backend
```bash
cd backend
npm install
# Configurer .env (voir .env.example)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🗄️ Base de Données

### Tables principales
- **users** : Utilisateurs (admin, formateur, participant)
- **formations** : Catalogue de formations
- **formateurs** : Profils des formateurs
- **sessions** : Planification des formations
- **inscriptions** : Inscriptions des participants
- **evaluations** : Évaluations post-formation

## 🔐 Authentification
- JWT stocké dans localStorage
- Middleware de protection des routes
- Rôles gérés côté backend et frontend

## 📱 Fonctionnalités Principales

### Page Publique
- Liste des formations disponibles
- Filtres : catégorie, ville, date
- Formulaire d'inscription participant

### Dashboard Admin
- Gestion complète des formations
- Gestion des formateurs
- Planification des sessions
- Statistiques

### Dashboard Formateur
- Mes formations
- Mes évaluations
- Mon profil

### Dashboard Participant
- Mes inscriptions
- Formations disponibles
- Évaluer mes formations

## 🎨 Design
- Interface Material UI moderne
- Design professionnel et épuré
- Responsive (mobile-friendly)
- UX intuitive pour débutants

## 📝 Licence
Projet pédagogique - Libre d'utilisation
