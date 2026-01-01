# 🚀 DÉMARRAGE RAPIDE - Application Gestion de Formation

## ✅ Tout est Prêt !

Votre application complète de gestion de formation est installée et configurée.

## 📋 Checklist Avant de Démarrer

- [x] Backend installé (`npm install` dans `/backend`)
- [x] Frontend installé (`npm install` dans `/frontend`)
- [x] Base de données MySQL configurée
- [x] Fichiers `.env` créés
- [x] Fonctionnalité "Mot de passe oublié" ajoutée

## 🎯 Démarrage en 3 Étapes

### 1️⃣ Démarrer MySQL
Assurez-vous que MySQL est démarré sur votre machine.

### 2️⃣ Créer/Vérifier la Base de Données

```sql
CREATE DATABASE IF NOT EXISTS gestion_formation 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3️⃣ Créer un Compte Admin

**Option A : Script Node.js (Recommandé)**
```bash
cd backend
node updateAdminPassword.js
```

**Option B : Via l'inscription**
Allez sur http://localhost:5173/register et créez un compte

## 🖥️ Lancer l'Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Attendez de voir :
```
✅ Connexion MySQL établie avec succès
✅ Tables créées avec succès
🚀 Serveur démarré sur le port 5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

L'application s'ouvre automatiquement sur http://localhost:5173

## 🔐 Se Connecter

### Compte Admin
- **Email** : `admin@formation.com`
- **Mot de passe** : `admin123`
- **URL** : http://localhost:5173/login

### Créer d'Autres Comptes
Utilisez la page d'inscription : http://localhost:5173/register

## ✨ Nouvelles Fonctionnalités

### Mot de Passe Oublié
1. Cliquez sur "Mot de passe oublié ?" sur la page de connexion
2. Entrez votre email
3. Cliquez sur le lien généré
4. Définissez un nouveau mot de passe

**Note** : En mode développement, le lien s'affiche directement. En production, il serait envoyé par email.

## 📱 Fonctionnalités Disponibles

### 🔴 Admin (`/admin`)
- ✅ Créer, modifier, supprimer des formations
- ✅ Gérer les formateurs
- ✅ Planifier des sessions
- ✅ Voir toutes les inscriptions
- ✅ Statistiques complètes

### 👨‍🏫 Formateur (`/formateur`)
- ✅ Voir ses formations assignées
- ✅ Consulter ses évaluations
- ✅ Note moyenne

### 👨‍🎓 Participant (`/participant`)
- ✅ S'inscrire aux formations
- ✅ Gérer ses inscriptions
- ✅ Évaluer les formations

### 🌐 Page Publique (`/`)
- ✅ Catalogue de formations
- ✅ Filtres par catégorie et ville
- ✅ Informations détaillées

## 🛠️ Scripts Utiles

### Backend

```bash
# Créer/Mettre à jour l'admin
node updateAdminPassword.js

# Générer des hash bcrypt
node generateHashes.js

# Démarrer le serveur
npm run dev
```

### Frontend

```bash
# Démarrer le dev server
npm run dev

# Build pour production
npm run build
```

### Base de Données

```bash
# Exécuter le script SQL complet
mysql -u root -p < database_complete.sql

# Créer juste l'admin
mysql -u root -p < create_admin_quick.sql
```

## 📚 Documentation

- **README.md** - Vue d'ensemble du projet
- **GUIDE_DEMARRAGE.md** - Guide détaillé de démarrage
- **API_DOCUMENTATION.md** - Documentation complète de l'API
- **ARCHITECTURE.md** - Architecture technique
- **COMPTES_TEST.md** - Liste des comptes de test
- **SOLUTION_CONNEXION.md** - Résolution des problèmes de connexion
- **NOUVELLES_FONCTIONNALITES.md** - Fonctionnalités récentes

## 🐛 Problèmes Courants

### ❌ "Erreur de connexion MySQL"
**Solution** : Vérifiez que MySQL est démarré et que les identifiants dans `.env` sont corrects

### ❌ "Email ou mot de passe incorrect"
**Solution** : Exécutez `node updateAdminPassword.js` dans le dossier backend

### ❌ "Port already in use"
**Solution** : Changez le port dans `.env` (backend) ou `vite.config.js` (frontend)

### ❌ "Cannot find module"
**Solution** : Exécutez `npm install` dans le dossier concerné

## 🎯 Workflow Recommandé

1. **Démarrer MySQL**
2. **Lancer le backend** (`npm run dev` dans `/backend`)
3. **Lancer le frontend** (`npm run dev` dans `/frontend`)
4. **Créer/Mettre à jour l'admin** (`node updateAdminPassword.js`)
5. **Se connecter** sur http://localhost:5173/login
6. **Explorer l'application** !

## 🔒 Sécurité

### Développement
- ✅ Mots de passe simples pour faciliter les tests
- ✅ Token de réinitialisation affiché directement
- ✅ Pas d'envoi d'email

### Production (À Faire)
- ⚠️ Changer `JWT_SECRET` dans `.env`
- ⚠️ Utiliser des mots de passe forts
- ⚠️ Configurer l'envoi d'emails
- ⚠️ Activer HTTPS
- ⚠️ Implémenter le rate limiting

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez `SOLUTION_CONNEXION.md`
2. Vérifiez les logs du backend
3. Vérifiez la console du navigateur (F12)
4. Assurez-vous que MySQL est démarré

## 🎉 C'est Parti !

Tout est configuré et prêt à l'emploi. Lancez les serveurs et commencez à explorer votre application de gestion de formation !

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2 (nouveau terminal)
cd frontend && npm run dev
```

**Bonne utilisation ! 🚀**

---

*Dernière mise à jour : 01/01/2026*
*Version : 1.0.0 avec récupération de mot de passe*
