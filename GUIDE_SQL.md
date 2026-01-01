# 📊 Guide d'Utilisation du Script SQL

## 📁 Fichier : `database_complete.sql`

Ce fichier contient **TOUT** ce dont vous avez besoin pour créer et remplir la base de données.

## 🎯 Contenu du Script

### 1. Création de la Base de Données
- Supprime la base si elle existe (⚠️ ATTENTION)
- Crée la base `gestion_formation` avec encodage UTF-8

### 2. Création des 6 Tables
- ✅ **users** : Tous les utilisateurs (admin, formateurs, participants)
- ✅ **formations** : Catalogue de formations
- ✅ **formateurs** : Profils détaillés des formateurs
- ✅ **sessions** : Planification des formations
- ✅ **inscriptions** : Inscriptions des participants
- ✅ **evaluations** : Évaluations post-formation

### 3. Insertion de Données d'Exemple
- **1 Admin** : admin@formation.com
- **4 Formateurs** : Experts en différents domaines
- **5 Participants** : Utilisateurs test
- **10 Formations** : Dans 5 catégories différentes
- **13 Sessions** : Planifiées et terminées
- **17 Inscriptions** : Avec différents statuts
- **7 Évaluations** : Notes et commentaires

## 🚀 Comment Exécuter le Script

### Méthode 1 : MySQL Command Line (Recommandé)

```bash
# 1. Ouvrir le terminal
# 2. Se connecter à MySQL
mysql -u root -p

# 3. Exécuter le script
source C:/Users/Hamza/Desktop/projects/Gestion-formation/database_complete.sql

# Ou sur Windows avec chemin complet
\. C:/Users/Hamza/Desktop/projects/Gestion-formation/database_complete.sql
```

### Méthode 2 : phpMyAdmin (XAMPP/WAMP)

1. Ouvrez **phpMyAdmin** : http://localhost/phpmyadmin
2. Cliquez sur l'onglet **"SQL"** en haut
3. Cliquez sur **"Parcourir"** ou **"Choose File"**
4. Sélectionnez le fichier `database_complete.sql`
5. Cliquez sur **"Exécuter"** ou **"Go"**

### Méthode 3 : MySQL Workbench

1. Ouvrez **MySQL Workbench**
2. Connectez-vous à votre serveur MySQL
3. Menu : **File** → **Open SQL Script**
4. Sélectionnez `database_complete.sql`
5. Cliquez sur l'icône **éclair** (Execute) ou appuyez sur **Ctrl+Shift+Enter**

### Méthode 4 : Ligne de Commande Directe

```bash
mysql -u root -p < C:/Users/Hamza/Desktop/projects/Gestion-formation/database_complete.sql
```

## 👥 Comptes Créés

### 🔴 Admin
- **Email** : admin@formation.com
- **Mot de passe** : admin123
- **Rôle** : Administrateur complet

### 👨‍🏫 Formateurs

| Nom | Email | Mot de passe | Spécialité |
|-----|-------|--------------|------------|
| Mohammed Alami | mohammed.alami@formation.com | formateur123 | Informatique |
| Fatima Benali | fatima.benali@formation.com | formateur123 | Management |
| Youssef Chakir | youssef.chakir@formation.com | formateur123 | Marketing |
| Amina Drissi | amina.drissi@formation.com | formateur123 | Comptabilité |

### 👨‍🎓 Participants

| Nom | Email | Mot de passe |
|-----|-------|--------------|
| Sara El Amrani | sara.elamrani@email.com | participant123 |
| Karim Fassi | karim.fassi@email.com | participant123 |
| Leila Ghazi | leila.ghazi@email.com | participant123 |
| Omar Hamdi | omar.hamdi@email.com | participant123 |
| Nadia Idrissi | nadia.idrissi@email.com | participant123 |

## 📚 Formations Créées

### Informatique (3 formations)
1. **Développement Web avec React** - 40h - 5000 DH
2. **Backend avec Node.js et Express** - 35h - 4500 DH
3. **Python pour Data Science** - 45h - 5500 DH

### Management (2 formations)
4. **Management d'Équipe** - 30h - 3500 DH
5. **Gestion de Projet Agile** - 25h - 3000 DH

### Marketing (2 formations)
6. **Marketing Digital** - 30h - 3500 DH
7. **Réseaux Sociaux pour Entreprises** - 20h - 2500 DH

### Langues (1 formation)
8. **Anglais des Affaires** - 40h - 4000 DH

### Comptabilité (2 formations)
9. **Comptabilité Générale** - 35h - 3800 DH
10. **Excel Avancé pour la Finance** - 25h - 2800 DH

## 📅 Sessions Planifiées

- **10 sessions à venir** (février-mars 2026)
- **3 sessions terminées** (décembre 2025) avec évaluations

## ⚠️ IMPORTANT

### Mots de Passe
Les mots de passe dans le script SQL sont des **hash bcrypt d'exemple**.

**Pour créer de vrais comptes sécurisés :**
1. Utilisez l'API `/api/auth/register`
2. Ou utilisez le script `createAdmin.js`

### Suppression de Données
Le script commence par :
```sql
DROP DATABASE IF EXISTS gestion_formation;
```

⚠️ **ATTENTION** : Cela supprime TOUTES les données existantes !

Si vous voulez conserver vos données, commentez cette ligne :
```sql
-- DROP DATABASE IF EXISTS gestion_formation;
```

## ✅ Vérification

Après exécution du script, vérifiez :

```sql
USE gestion_formation;

-- Compter les enregistrements
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'formateurs', COUNT(*) FROM formateurs
UNION ALL
SELECT 'formations', COUNT(*) FROM formations
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'inscriptions', COUNT(*) FROM inscriptions
UNION ALL
SELECT 'evaluations', COUNT(*) FROM evaluations;
```

**Résultat attendu :**
- users : 10
- formateurs : 4
- formations : 10
- sessions : 13
- inscriptions : 17
- evaluations : 7

## 🔍 Requêtes Utiles

### Voir tous les utilisateurs
```sql
SELECT id, CONCAT(prenom, ' ', nom) as nom_complet, email, role 
FROM users 
ORDER BY role, nom;
```

### Voir toutes les formations avec sessions
```sql
SELECT 
  f.titre,
  f.categorie,
  f.ville,
  COUNT(s.id) as nb_sessions
FROM formations f
LEFT JOIN sessions s ON f.id = s.formation_id
GROUP BY f.id
ORDER BY f.categorie, f.titre;
```

### Voir les inscriptions actives
```sql
SELECT 
  CONCAT(u.prenom, ' ', u.nom) as participant,
  f.titre as formation,
  s.date_debut,
  s.date_fin,
  i.statut
FROM inscriptions i
JOIN users u ON i.participant_id = u.id
JOIN sessions s ON i.session_id = s.id
JOIN formations f ON s.formation_id = f.id
WHERE i.statut = 'confirmee'
ORDER BY s.date_debut;
```

### Voir les évaluations avec détails
```sql
SELECT 
  f.titre as formation,
  CONCAT(u.prenom, ' ', u.nom) as participant,
  e.note,
  e.commentaire,
  e.created_at
FROM evaluations e
JOIN inscriptions i ON e.inscription_id = i.id
JOIN users u ON i.participant_id = u.id
JOIN sessions s ON i.session_id = s.id
JOIN formations f ON s.formation_id = f.id
ORDER BY e.created_at DESC;
```

## 🎯 Prochaines Étapes

Après avoir exécuté le script :

1. ✅ Vérifiez que les tables sont créées
2. ✅ Vérifiez que les données sont insérées
3. ✅ Démarrez le backend : `cd backend && npm run dev`
4. ✅ Démarrez le frontend : `cd frontend && npm run dev`
5. ✅ Connectez-vous avec un compte test
6. ✅ Explorez l'application !

## 🆘 Problèmes Courants

### Erreur : "Access denied"
**Solution** : Vérifiez vos identifiants MySQL

### Erreur : "Database exists"
**Solution** : Le script supprime et recrée la base automatiquement

### Erreur : "Foreign key constraint"
**Solution** : Exécutez le script complet d'un coup (ne pas exécuter ligne par ligne)

### Tables vides
**Solution** : Vérifiez que tout le script a été exécuté jusqu'à la fin

## 📝 Notes

- Les hash de mots de passe sont des exemples
- Les dates des sessions sont en 2026 (à venir) et 2025 (passées)
- Les données sont en français
- Les emails sont fictifs
- Les téléphones sont au format marocain

---

**Prêt à créer votre base de données ? Exécutez le script ! 🚀**
