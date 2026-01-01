# ⚠️ IMPORTANT - À LIRE AVANT DE DÉMARRER

## 🔴 Prérequis OBLIGATOIRES

### 1. MySQL doit être installé et démarré

**Vérifier si MySQL est installé :**
```bash
mysql --version
```

**Démarrer MySQL (selon votre installation) :**

#### XAMPP
1. Ouvrez XAMPP Control Panel
2. Cliquez sur "Start" pour MySQL

#### WAMP
1. Ouvrez WAMP
2. Assurez-vous que l'icône est verte

#### MySQL Standalone
```bash
# Windows (en tant qu'administrateur)
net start MySQL80

# Ou via Services Windows
services.msc → MySQL → Démarrer
```

### 2. Créer la base de données

Une fois MySQL démarré, ouvrez un terminal et :

```bash
mysql -u root -p
```

Puis dans MySQL :
```sql
CREATE DATABASE gestion_formation CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**OU** utilisez phpMyAdmin (XAMPP/WAMP) :
1. Allez sur http://localhost/phpmyadmin
2. Créez une nouvelle base de données nommée `gestion_formation`
3. Sélectionnez l'encodage `utf8mb4_unicode_ci`

### 3. Vérifier le fichier .env

Ouvrez `backend/.env` et vérifiez :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Votre mot de passe MySQL (vide par défaut)
DB_NAME=gestion_formation
```

Si vous avez un mot de passe MySQL, ajoutez-le !

## ✅ Démarrage de l'Application

### Option 1 : Script automatique (Windows)
Double-cliquez sur `start.bat`

### Option 2 : Manuel

**Terminal 1 - Backend :**
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

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

## 🐛 Problèmes Courants

### ❌ "Erreur de connexion MySQL"
**Solution :**
1. Vérifiez que MySQL est démarré
2. Vérifiez le mot de passe dans `.env`
3. Vérifiez que le port 3306 est libre

### ❌ "Database 'gestion_formation' does not exist"
**Solution :**
Créez la base de données (voir étape 2 ci-dessus)

### ❌ "Port 5000 already in use"
**Solution :**
Changez le port dans `backend/.env` :
```env
PORT=5001
```

### ❌ "Cannot find module"
**Solution :**
```bash
cd backend
npm install

cd ../frontend
npm install
```

## 📝 Créer un Compte Admin

### Méthode 1 : Script automatique
```bash
cd backend
node createAdmin.js
```

Credentials créés :
- Email : admin@formation.com
- Password : admin123

### Méthode 2 : Via l'API
Utilisez Postman ou curl :
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nom\":\"Admin\",\"prenom\":\"Super\",\"email\":\"admin@formation.com\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

## 🎯 Ordre de Démarrage

1. ✅ Installer MySQL
2. ✅ Démarrer MySQL
3. ✅ Créer la base de données
4. ✅ Vérifier le fichier .env
5. ✅ Démarrer le backend
6. ✅ Créer un admin (optionnel)
7. ✅ Démarrer le frontend
8. ✅ Ouvrir http://localhost:5173

## 🆘 Besoin d'Aide ?

1. Vérifiez les logs du backend dans le terminal
2. Vérifiez la console du navigateur (F12)
3. Assurez-vous que MySQL est bien démarré
4. Vérifiez que les deux serveurs tournent

## 📞 Checklist de Démarrage

- [ ] MySQL installé
- [ ] MySQL démarré
- [ ] Base de données `gestion_formation` créée
- [ ] Fichier `.env` configuré
- [ ] Dépendances installées (`npm install`)
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 5173)
- [ ] Compte admin créé
- [ ] Application accessible sur http://localhost:5173

**Une fois tous les points cochés, vous êtes prêt ! 🚀**
