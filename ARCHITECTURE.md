# 📐 Architecture Technique

## 🎯 Vue d'ensemble

Cette application suit une architecture **client-serveur** classique avec séparation claire entre le frontend et le backend.

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Material UI)                     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Context  │  │ Services │   │
│  │          │  │          │  │  (Auth)  │  │  (API)   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST + JWT
                              │
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                   (Node.js + Express)                        │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │→ │Controllers│→ │  Models  │→ │   DB     │   │
│  │          │  │          │  │          │  │ (MySQL)  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│       ↑                                                      │
│  ┌──────────┐                                               │
│  │Middleware│                                               │
│  │  (Auth)  │                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Structure Backend

### Configuration (`config/`)
- **database.js** : Configuration de la connexion MySQL avec pool de connexions
- Initialisation automatique des tables au démarrage

### Middleware (`middleware/`)
- **auth.js** : 
  - `authMiddleware` : Vérifie la présence et validité du token JWT
  - `roleMiddleware` : Vérifie les permissions selon le rôle

### Controllers (`controllers/`)
Contiennent la logique métier de l'application :
- **authController.js** : Inscription, connexion, profil
- **formationController.js** : CRUD formations
- **formateurController.js** : Gestion formateurs
- **sessionController.js** : Planification sessions
- **inscriptionController.js** : Gestion inscriptions
- **evaluationController.js** : Système d'évaluation

### Routes (`routes/`)
Définissent les endpoints de l'API :
- **authRoutes.js** : `/api/auth/*`
- **formationRoutes.js** : `/api/formations/*`
- **formateurRoutes.js** : `/api/formateurs/*`
- **sessionRoutes.js** : `/api/sessions/*`
- **inscriptionRoutes.js** : `/api/inscriptions/*`
- **evaluationRoutes.js** : `/api/evaluations/*`

### Serveur (`server.js`)
Point d'entrée de l'application :
1. Configuration Express
2. Middlewares globaux (CORS, JSON)
3. Montage des routes
4. Gestion des erreurs
5. Démarrage du serveur

## 🎨 Structure Frontend

### Pages (`pages/`)
Composants de page complets :
- **Accueil.jsx** : Page publique avec catalogue
- **Login.jsx** : Authentification
- **Register.jsx** : Inscription
- **AdminDashboard.jsx** : Interface admin
- **FormateurDashboard.jsx** : Interface formateur
- **ParticipantDashboard.jsx** : Interface participant

### Components (`components/`)
Composants réutilisables :
- **ProtectedRoute.jsx** : HOC pour protéger les routes

### Context (`context/`)
- **AuthContext.jsx** : Gestion globale de l'authentification
  - État utilisateur
  - Token JWT
  - Fonctions login/logout
  - Vérification de rôle

### Services (`services/`)
- **api.js** : Configuration Axios centralisée
  - Intercepteurs pour JWT
  - Services pour chaque entité
  - Gestion des erreurs

### Routing (`App.jsx`)
- Configuration React Router
- Routes publiques et protégées
- Redirection selon rôle

## 🔐 Flux d'Authentification

```
1. Utilisateur se connecte
   ↓
2. Backend vérifie credentials
   ↓
3. Backend génère JWT token
   ↓
4. Frontend stocke token + user dans localStorage
   ↓
5. Chaque requête inclut le token dans header Authorization
   ↓
6. Middleware backend vérifie le token
   ↓
7. Si valide, requête traitée
   Si invalide, erreur 401
```

## 🗄️ Modèle de Données

### Tables Principales

**users**
- Stocke tous les utilisateurs (admin, formateur, participant)
- Champ `role` pour la distinction

**formations**
- Catalogue des formations disponibles
- Informations complètes (titre, heures, coût, etc.)

**formateurs**
- Profil détaillé des formateurs
- Lié à `users` via `user_id`

**sessions**
- Planification des formations
- Lie `formations` et `formateurs`
- Gère les places disponibles

**inscriptions**
- Inscriptions des participants aux sessions
- Statut : en_attente, confirmee, annulee

**evaluations**
- Évaluations post-formation
- Note de 1 à 5 + commentaire

### Relations

```
users (formateur) ←─┐
                    │
formateurs ←────────┘
    │
    │
    ↓
sessions ←── formations
    │
    │
    ↓
inscriptions ←── users (participant)
    │
    │
    ↓
evaluations
```

## 🔒 Sécurité

### Backend
✅ Mots de passe hashés avec bcrypt (10 rounds)
✅ JWT avec expiration (7 jours par défaut)
✅ Validation des données entrantes
✅ Protection des routes par middleware
✅ Vérification des rôles côté serveur
✅ Requêtes préparées (protection SQL injection)

### Frontend
✅ Token stocké dans localStorage
✅ Intercepteur Axios pour auto-déconnexion si 401
✅ Routes protégées par composant ProtectedRoute
✅ Vérification de rôle avant affichage

## 🚀 Flux de Données

### Exemple : Inscription à une formation

```
1. Participant clique "S'inscrire" (Frontend)
   ↓
2. inscriptionService.inscrire({ session_id }) (API Service)
   ↓
3. POST /api/inscriptions avec JWT (HTTP)
   ↓
4. authMiddleware vérifie le token (Middleware)
   ↓
5. roleMiddleware vérifie role='participant' (Middleware)
   ↓
6. inscriptionController.inscrireParticipant() (Controller)
   ↓
7. Vérification places disponibles (Logique)
   ↓
8. INSERT dans table inscriptions (Database)
   ↓
9. UPDATE places_disponibles -1 (Database)
   ↓
10. Réponse 201 avec inscriptionId (HTTP)
    ↓
11. Mise à jour de l'UI (Frontend)
```

## 📦 Dépendances Clés

### Backend
- **express** : Framework web
- **mysql2** : Driver MySQL avec support Promise
- **bcryptjs** : Hashage des mots de passe
- **jsonwebtoken** : Génération et vérification JWT
- **cors** : Gestion des requêtes cross-origin
- **dotenv** : Variables d'environnement

### Frontend
- **react** : Bibliothèque UI
- **react-router-dom** : Routing
- **@mui/material** : Composants Material UI
- **axios** : Client HTTP
- **@emotion/react** : Styling (requis par MUI)

## 🎯 Principes de Conception

### Simplicité
- Code clair et bien commenté
- Pas de sur-ingénierie
- Architecture MVC simple

### Séparation des Responsabilités
- Backend : Logique métier + données
- Frontend : Présentation + UX
- Chaque controller a une responsabilité unique

### Réutilisabilité
- Services API centralisés
- Composants React modulaires
- Middleware réutilisables

### Sécurité par Défaut
- Toutes les routes sensibles protégées
- Validation côté serveur
- Pas de données sensibles exposées

## 🔄 Cycle de Vie d'une Requête

```
Frontend Component
    ↓
API Service (axios)
    ↓
HTTP Request + JWT
    ↓
Express Server
    ↓
CORS Middleware
    ↓
JSON Parser
    ↓
Route Handler
    ↓
Auth Middleware (si protégé)
    ↓
Role Middleware (si restriction)
    ↓
Controller
    ↓
Database Query
    ↓
Response JSON
    ↓
Axios Interceptor
    ↓
Component Update
```

## 📝 Bonnes Pratiques Implémentées

✅ Gestion centralisée des erreurs
✅ Validation des données
✅ Code commenté en français
✅ Nommage cohérent
✅ Séparation config/code
✅ Variables d'environnement
✅ Gestion des états de chargement
✅ Feedback utilisateur (messages d'erreur)
✅ Protection CSRF via JWT
✅ Expiration des tokens

## 🎓 Points Pédagogiques

Cette architecture est idéale pour l'apprentissage car :
- Structure claire et logique
- Pas de complexité cachée
- Chaque fichier a un rôle précis
- Facile à debugger
- Extensible facilement
- Suit les standards de l'industrie
