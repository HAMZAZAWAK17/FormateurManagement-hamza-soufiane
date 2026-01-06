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

## 📦 Bibliothèques et Dépendances

### 🔧 Backend (Node.js/Express)

#### **Dépendances de Production**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **express** | ^4.18.2 | Framework web minimaliste et flexible pour Node.js |
| **mysql2** | ^3.6.5 | Driver MySQL avec support Promise et requêtes préparées |
| **bcryptjs** | ^2.4.3 | Hashage sécurisé des mots de passe (10 rounds) |
| **jsonwebtoken** | ^9.0.2 | Génération et vérification de tokens JWT pour l'authentification |
| **cors** | ^2.8.5 | Middleware pour gérer les requêtes cross-origin (CORS) |
| **dotenv** | ^16.3.1 | Chargement des variables d'environnement depuis fichier .env |
| **express-validator** | ^7.0.1 | Middleware de validation et sanitisation des données entrantes |
| **multer** | ^2.0.2 | Middleware pour gérer l'upload de fichiers multipart/form-data |

#### **Dépendances de Développement**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **nodemon** | ^3.0.2 | Redémarrage automatique du serveur lors des modifications de code |

---

### 🎨 Frontend (React/Vite)

#### **Dépendances de Production**

**Framework & Core**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **react** | ^18.2.0 | Bibliothèque JavaScript pour construire des interfaces utilisateur |
| **react-dom** | ^18.2.0 | Package pour manipuler le DOM avec React |
| **react-router-dom** | ^6.20.1 | Routing déclaratif pour applications React (navigation) |

**UI & Styling**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **@mui/material** | ^5.15.0 | Composants React Material Design (UI principale) |
| **@mui/icons-material** | ^5.15.0 | Bibliothèque d'icônes Material Design |
| **@emotion/react** | ^11.11.1 | Bibliothèque CSS-in-JS pour le styling (requis par MUI) |
| **@emotion/styled** | ^11.11.0 | API styled-components pour Emotion |

**Calendrier & Planification**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **@fullcalendar/react** | ^6.1.20 | Composant React pour afficher des calendriers interactifs |
| **@fullcalendar/daygrid** | ^6.1.20 | Plugin vue grille/jour pour FullCalendar |
| **@fullcalendar/timegrid** | ^6.1.20 | Plugin vue grille temporelle pour FullCalendar |
| **@fullcalendar/interaction** | ^6.1.20 | Plugin d'interaction (drag & drop, resize) pour FullCalendar |

**Utilitaires**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **axios** | ^1.6.2 | Client HTTP pour effectuer des requêtes API REST |
| **dayjs** | ^1.11.19 | Bibliothèque légère pour manipuler et formater les dates |

#### **Dépendances de Développement**
| Bibliothèque | Version | Description |
|--------------|---------|-------------|
| **vite** | ^5.0.8 | Outil de build ultra-rapide et serveur de développement |
| **@vitejs/plugin-react** | ^4.2.1 | Plugin officiel Vite pour le support React (Fast Refresh) |
| **@types/react** | ^18.2.43 | Définitions TypeScript pour React |
| **@types/react-dom** | ^18.2.17 | Définitions TypeScript pour React DOM |

---

### 📊 Statistiques

| Catégorie | Backend | Frontend | Total |
|-----------|---------|----------|-------|
| **Production** | 8 | 13 | **21** |
| **Développement** | 1 | 4 | **5** |
| **TOTAL** | **9** | **17** | **26** |

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
