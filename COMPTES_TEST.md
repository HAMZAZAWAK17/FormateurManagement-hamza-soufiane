# 🔑 COMPTES DE TEST - Application Gestion de Formation

## 📋 Liste Complète des Comptes

Tous les comptes ci-dessous sont créés automatiquement lors de l'exécution du script SQL `database_complete.sql`.

---

## 🔴 ADMINISTRATEUR

### Super Admin
- **Email** : `admin@formation.com`
- **Mot de passe** : `admin123`
- **Rôle** : Admin
- **Accès** : Dashboard complet avec toutes les fonctionnalités

**Fonctionnalités disponibles :**
- ✅ Créer, modifier, supprimer des formations
- ✅ Gérer les formateurs
- ✅ Planifier des sessions
- ✅ Voir toutes les inscriptions
- ✅ Voir toutes les évaluations
- ✅ Statistiques complètes

---

## 👨‍🏫 FORMATEURS (4 comptes)

### 1. Mohammed Alami - Expert Informatique
- **Email** : `mohammed.alami@formation.com`
- **Mot de passe** : `formateur123`
- **Téléphone** : 0623456789
- **Spécialité** : React, JavaScript, Node.js, MongoDB
- **Expérience** : Expert en développement web moderne, 10 ans d'expérience
- **Formations assignées** : React, Node.js, Python

### 2. Fatima Benali - Experte Management
- **Email** : `fatima.benali@formation.com`
- **Mot de passe** : `formateur123`
- **Téléphone** : 0634567890
- **Spécialité** : Management, Leadership, Communication
- **Expérience** : Consultante en management avec MBA
- **Formations assignées** : Management d'Équipe, Gestion de Projet Agile, Anglais des Affaires

### 3. Youssef Chakir - Expert Marketing Digital
- **Email** : `youssef.chakir@formation.com`
- **Mot de passe** : `formateur123`
- **Téléphone** : 0645678901
- **Spécialité** : Marketing Digital, SEO, Google Ads, Analytics
- **Expérience** : Certifié Google, 8 ans d'expérience
- **Formations assignées** : Marketing Digital, Réseaux Sociaux

### 4. Amina Drissi - Experte Comptabilité
- **Email** : `amina.drissi@formation.com`
- **Mot de passe** : `formateur123`
- **Téléphone** : 0656789012
- **Spécialité** : Comptabilité, Finance, Excel avancé
- **Expérience** : Expert-comptable diplômé, formateur depuis 5 ans
- **Formations assignées** : Comptabilité Générale, Excel Avancé

**Fonctionnalités disponibles pour les formateurs :**
- ✅ Voir leurs formations assignées
- ✅ Consulter leurs évaluations
- ✅ Voir leur note moyenne
- ✅ Statistiques personnelles

---

## 👨‍🎓 PARTICIPANTS (5 comptes)

### 1. Sara El Amrani
- **Email** : `sara.elamrani@email.com`
- **Mot de passe** : `participant123`
- **Téléphone** : 0667890123
- **Inscriptions** : React (2 sessions), Node.js

### 2. Karim Fassi
- **Email** : `karim.fassi@email.com`
- **Mot de passe** : `participant123`
- **Téléphone** : 0678901234
- **Inscriptions** : React, Management

### 3. Leila Ghazi
- **Email** : `leila.ghazi@email.com`
- **Mot de passe** : `participant123`
- **Téléphone** : 0689012345
- **Inscriptions** : React, Management, Marketing Digital

### 4. Omar Hamdi
- **Email** : `omar.hamdi@email.com`
- **Mot de passe** : `participant123`
- **Téléphone** : 0690123456
- **Inscriptions** : Node.js, Management

### 5. Nadia Idrissi
- **Email** : `nadia.idrissi@email.com`
- **Mot de passe** : `participant123`
- **Téléphone** : 0601234567
- **Inscriptions** : Management, Marketing Digital

**Fonctionnalités disponibles pour les participants :**
- ✅ S'inscrire aux formations disponibles
- ✅ Voir leurs inscriptions
- ✅ Annuler une inscription
- ✅ Évaluer les formations suivies
- ✅ Voir l'historique de leurs évaluations

---

## 🎯 Scénarios de Test Recommandés

### Scénario 1 : Parcours Admin
1. Connectez-vous avec `admin@formation.com`
2. Créez une nouvelle formation
3. Planifiez une session pour cette formation
4. Assignez un formateur
5. Consultez les statistiques

### Scénario 2 : Parcours Formateur
1. Connectez-vous avec `mohammed.alami@formation.com`
2. Consultez vos formations assignées
3. Consultez vos évaluations
4. Vérifiez votre note moyenne

### Scénario 3 : Parcours Participant
1. Connectez-vous avec `sara.elamrani@email.com`
2. Parcourez le catalogue de formations
3. Inscrivez-vous à une nouvelle formation
4. Consultez vos inscriptions
5. Évaluez une formation terminée

### Scénario 4 : Flux Complet
1. **Admin** : Crée une formation "JavaScript Avancé"
2. **Admin** : Planifie une session et assigne Mohammed Alami
3. **Participant** (Sara) : S'inscrit à la session
4. **Admin** : Marque la session comme "terminée"
5. **Participant** (Sara) : Évalue la formation
6. **Formateur** (Mohammed) : Consulte sa nouvelle évaluation

---

## 📊 Données Pré-remplies

### Formations (10)
- 3 en Informatique
- 2 en Management
- 2 en Marketing
- 1 en Langues
- 2 en Comptabilité

### Sessions (13)
- 10 sessions planifiées (février-mars 2026)
- 3 sessions terminées (décembre 2025)

### Inscriptions (17)
- Toutes confirmées
- Réparties sur différentes sessions

### Évaluations (7)
- Notes de 4 à 5 étoiles
- Commentaires détaillés
- Sur les sessions terminées

---

## 🔐 Sécurité

### ⚠️ IMPORTANT - Environnement de Production

**Ces comptes sont pour le DÉVELOPPEMENT et les TESTS uniquement !**

En production :
1. ❌ **NE PAS** utiliser ces comptes
2. ✅ Créer de nouveaux comptes avec des mots de passe forts
3. ✅ Changer le `JWT_SECRET` dans `.env`
4. ✅ Utiliser HTTPS
5. ✅ Activer la validation d'email
6. ✅ Implémenter la récupération de mot de passe

### Mots de Passe Actuels (DEV)
- Admin : `admin123`
- Formateurs : `formateur123`
- Participants : `participant123`

**Ces mots de passe sont volontairement simples pour faciliter les tests.**

---

## 🎨 Interface par Rôle

### Dashboard Admin
- **URL** : http://localhost:5173/admin
- **Onglets** :
  - Formations (CRUD complet)
  - Formateurs (liste et gestion)
  - Sessions (planification)
  - Inscriptions (vue d'ensemble)
- **Statistiques** : 4 cartes avec compteurs

### Dashboard Formateur
- **URL** : http://localhost:5173/formateur
- **Sections** :
  - Mes Formations Assignées
  - Évaluations Reçues
  - Note Moyenne
- **Statistiques** : 3 cartes

### Dashboard Participant
- **URL** : http://localhost:5173/participant
- **Sections** :
  - Mes Inscriptions
  - Formations Disponibles
  - Mes Évaluations
- **Actions** : S'inscrire, Annuler, Évaluer

---

## 📱 Test de l'Application

### 1. Connexion
```
URL : http://localhost:5173/login
```

### 2. Inscription (nouveau compte)
```
URL : http://localhost:5173/register
```

### 3. Page d'accueil (publique)
```
URL : http://localhost:5173/
Filtres : Catégorie, Ville
```

---

## 🛠️ Commandes Utiles

### Créer un nouveau compte admin
```bash
cd backend
node createAdmin.js
```

### Réinitialiser la base de données
```bash
mysql -u root -p < database_complete.sql
```

### Vérifier les comptes dans la base
```sql
SELECT id, CONCAT(prenom, ' ', nom) as nom, email, role 
FROM users 
ORDER BY role;
```

---

## 📝 Notes

- Tous les emails sont fictifs
- Les téléphones sont au format marocain (06...)
- Les hash de mots de passe sont générés avec bcrypt
- Les données sont en français
- Les sessions futures sont en 2026
- Les sessions passées sont en 2025

---

## ✅ Checklist de Test

- [ ] Connexion admin réussie
- [ ] Connexion formateur réussie
- [ ] Connexion participant réussie
- [ ] Création d'une formation (admin)
- [ ] Planification d'une session (admin)
- [ ] Inscription à une formation (participant)
- [ ] Évaluation d'une formation (participant)
- [ ] Consultation des évaluations (formateur)
- [ ] Filtres sur la page d'accueil
- [ ] Déconnexion

---

**Tous les comptes sont prêts à l'emploi ! Commencez vos tests ! 🚀**

*Dernière mise à jour : 01/01/2026*
