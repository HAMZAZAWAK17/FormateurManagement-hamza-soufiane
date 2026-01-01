# 🔧 SOLUTION RAPIDE - Problème de Connexion Admin

## ❌ Problème
Impossible de se connecter avec `admin@formation.com` / `admin123`

## ✅ Solution

Le problème vient des hash bcrypt dans le fichier SQL qui sont des exemples et ne fonctionnent pas.

### Option 1 : Utiliser le script Node.js (RECOMMANDÉ)

```bash
cd backend
node createAdmin.js
```

Cela va créer un admin avec :
- Email : `admin@formation.com`
- Mot de passe : `admin123`

### Option 2 : Utiliser le script SQL rapide

```bash
mysql -u root -p < create_admin_quick.sql
```

Ou dans phpMyAdmin, exécutez le fichier `create_admin_quick.sql`

### Option 3 : S'inscrire via l'interface

1. Allez sur http://localhost:5173/register
2. Remplissez le formulaire
3. Sélectionnez le rôle "Participant" ou "Formateur"
4. Connectez-vous avec vos identifiants

**Note** : Pour créer un admin via l'interface, vous devez modifier temporairement le code ou utiliser l'API directement.

### Option 4 : Utiliser l'API directement

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"nom\":\"Admin\",\"prenom\":\"Super\",\"email\":\"admin@test.com\",\"password\":\"admin123\",\"role\":\"admin\",\"telephone\":\"0612345678\"}"
```

## 🎯 Vérification

Après avoir créé l'admin, essayez de vous connecter :
- Email : `admin@formation.com`
- Mot de passe : `admin123`

## 🔐 Mot de Passe Oublié

Si vous oubliez votre mot de passe :

1. Allez sur http://localhost:5173/forgot-password
2. Entrez votre email
3. Un lien de réinitialisation sera généré
4. Cliquez sur le lien pour réinitialiser votre mot de passe

**Note** : En mode développement, le lien s'affiche directement. En production, il serait envoyé par email.

## 📝 Comptes de Test Disponibles

Une fois le script SQL complet exécuté (`database_complete.sql`), vous aurez :

### Admin
- Email : `admin@formation.com`
- Mot de passe : `admin123`

### Formateurs
- `mohammed.alami@formation.com` / `formateur123`
- `fatima.benali@formation.com` / `formateur123`
- `youssef.chakir@formation.com` / `formateur123`
- `amina.drissi@formation.com` / `formateur123`

### Participants
- `sara.elamrani@email.com` / `participant123`
- `karim.fassi@email.com` / `participant123`
- `leila.ghazi@email.com` / `participant123`
- `omar.hamdi@email.com` / `participant123`
- `nadia.idrissi@email.com` / `participant123`

## ⚠️ Important

Les hash bcrypt dans le fichier `database_complete.sql` sont des exemples.

**Pour que les mots de passe fonctionnent, vous DEVEZ :**
1. Soit utiliser `createAdmin.js` pour créer les comptes
2. Soit s'inscrire via l'interface (qui génère les bons hash)
3. Soit utiliser l'API `/api/auth/register`

## 🆘 Toujours des problèmes ?

1. Vérifiez que le backend est démarré
2. Vérifiez les logs du backend dans le terminal
3. Vérifiez que MySQL est démarré
4. Vérifiez que la base de données `gestion_formation` existe
5. Essayez de créer un nouveau compte via `/register`

---

**La solution la plus simple : `node createAdmin.js` dans le dossier backend ! 🚀**
