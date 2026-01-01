# 📡 Documentation API

Base URL : `http://localhost:5000/api`

## 🔐 Authentification

### Inscription
```
POST /auth/register
Content-Type: application/json

Body:
{
  "nom": "Doe",
  "prenom": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "participant", // ou "formateur" ou "admin"
  "telephone": "0612345678"
}

Response 201:
{
  "message": "Utilisateur créé avec succès",
  "userId": 1
}
```

### Connexion
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Doe",
    "prenom": "John",
    "email": "john@example.com",
    "role": "participant",
    "telephone": "0612345678"
  }
}
```

### Profil utilisateur
```
GET /auth/profile
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "nom": "Doe",
  "prenom": "John",
  "email": "john@example.com",
  "role": "participant",
  "telephone": "0612345678",
  "created_at": "2024-01-01T10:00:00.000Z"
}
```

## 📚 Formations

### Récupérer toutes les formations (Public)
```
GET /formations?categorie=Informatique&ville=Casablanca

Response 200:
[
  {
    "id": 1,
    "titre": "Formation React",
    "description": "Apprendre React de A à Z",
    "heures": 40,
    "cout": 5000,
    "objectifs": "Maîtriser React",
    "programme": "Module 1, Module 2...",
    "categorie": "Informatique",
    "ville": "Casablanca",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
]
```

### Récupérer une formation par ID (Public)
```
GET /formations/:id

Response 200:
{
  "id": 1,
  "titre": "Formation React",
  ...
}
```

### Créer une formation (Admin uniquement)
```
POST /formations
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "titre": "Formation React",
  "description": "Apprendre React de A à Z",
  "heures": 40,
  "cout": 5000,
  "objectifs": "Maîtriser React",
  "programme": "Module 1, Module 2...",
  "categorie": "Informatique",
  "ville": "Casablanca"
}

Response 201:
{
  "message": "Formation créée avec succès",
  "formationId": 1
}
```

### Mettre à jour une formation (Admin uniquement)
```
PUT /formations/:id
Authorization: Bearer {token}
Content-Type: application/json

Body: (mêmes champs que POST)

Response 200:
{
  "message": "Formation mise à jour avec succès"
}
```

### Supprimer une formation (Admin uniquement)
```
DELETE /formations/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Formation supprimée avec succès"
}
```

## 👨‍🏫 Formateurs

### Récupérer tous les formateurs
```
GET /formateurs
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "competences": "React, Node.js",
    "remarques": "Excellent formateur",
    "nom": "Doe",
    "prenom": "John",
    "email": "john@example.com",
    "telephone": "0612345678"
  }
]
```

### Récupérer un formateur par ID
```
GET /formateurs/:id
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "competences": "React, Node.js",
  ...
}
```

### Mettre à jour un formateur (Admin uniquement)
```
PUT /formateurs/:id
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "competences": "React, Node.js, TypeScript",
  "remarques": "Formateur senior"
}

Response 200:
{
  "message": "Formateur mis à jour avec succès"
}
```

### Récupérer les formations d'un formateur
```
GET /formateurs/:id/formations
Authorization: Bearer {token}

Response 200:
[
  {
    "session_id": 1,
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-15",
    "lieu": "Casablanca",
    "statut": "planifiee",
    "titre": "Formation React",
    "heures": 40
  }
]
```

### Récupérer les évaluations d'un formateur
```
GET /formateurs/:id/evaluations
Authorization: Bearer {token}

Response 200:
[
  {
    "note": 5,
    "commentaire": "Excellent formateur",
    "created_at": "2024-02-20T10:00:00.000Z",
    "formation_titre": "Formation React",
    "participant_nom": "Jane Smith"
  }
]
```

## 📅 Sessions

### Récupérer toutes les sessions
```
GET /sessions

Response 200:
[
  {
    "id": 1,
    "formation_id": 1,
    "formateur_id": 1,
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-15",
    "lieu": "Casablanca",
    "places_disponibles": 20,
    "statut": "planifiee",
    "formation_titre": "Formation React",
    "formation_heures": 40,
    "formateur_nom": "John Doe"
  }
]
```

### Créer une session (Admin uniquement)
```
POST /sessions
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "formation_id": 1,
  "formateur_id": 1,
  "date_debut": "2024-02-01",
  "date_fin": "2024-02-15",
  "lieu": "Casablanca",
  "places_disponibles": 20
}

Response 201:
{
  "message": "Session créée avec succès",
  "sessionId": 1
}
```

### Mettre à jour une session (Admin uniquement)
```
PUT /sessions/:id
Authorization: Bearer {token}
Content-Type: application/json

Body: (mêmes champs que POST + statut)

Response 200:
{
  "message": "Session mise à jour avec succès"
}
```

### Supprimer une session (Admin uniquement)
```
DELETE /sessions/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Session supprimée avec succès"
}
```

## 📝 Inscriptions

### S'inscrire à une session (Participant uniquement)
```
POST /inscriptions
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "session_id": 1
}

Response 201:
{
  "message": "Inscription réussie",
  "inscriptionId": 1
}
```

### Récupérer mes inscriptions (Participant uniquement)
```
GET /inscriptions/mes-inscriptions
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "statut": "confirmee",
    "date_inscription": "2024-01-15T10:00:00.000Z",
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-15",
    "lieu": "Casablanca",
    "titre": "Formation React",
    "heures": 40,
    "formateur_nom": "John Doe"
  }
]
```

### Annuler une inscription (Participant uniquement)
```
DELETE /inscriptions/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Inscription annulée avec succès"
}
```

### Récupérer toutes les inscriptions (Admin uniquement)
```
GET /inscriptions
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "statut": "confirmee",
    "date_inscription": "2024-01-15T10:00:00.000Z",
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-15",
    "formation_titre": "Formation React",
    "participant_nom": "Jane Smith",
    "participant_email": "jane@example.com"
  }
]
```

## ⭐ Évaluations

### Créer une évaluation (Participant uniquement)
```
POST /evaluations
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "inscription_id": 1,
  "note": 5,
  "commentaire": "Excellente formation"
}

Response 201:
{
  "message": "Évaluation enregistrée avec succès",
  "evaluationId": 1
}
```

### Récupérer mes évaluations (Participant uniquement)
```
GET /evaluations/mes-evaluations
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "note": 5,
    "commentaire": "Excellente formation",
    "created_at": "2024-02-20T10:00:00.000Z",
    "formation_titre": "Formation React",
    "date_debut": "2024-02-01",
    "date_fin": "2024-02-15"
  }
]
```

### Récupérer toutes les évaluations (Admin uniquement)
```
GET /evaluations
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "note": 5,
    "commentaire": "Excellente formation",
    "created_at": "2024-02-20T10:00:00.000Z",
    "formation_titre": "Formation React",
    "participant_nom": "Jane Smith",
    "formateur_nom": "John Doe"
  }
]
```

## 🔒 Codes d'Erreur

- **400** : Requête invalide (données manquantes ou incorrectes)
- **401** : Non authentifié (token manquant ou invalide)
- **403** : Accès interdit (permissions insuffisantes)
- **404** : Ressource non trouvée
- **500** : Erreur serveur

## 📌 Notes Importantes

1. Toutes les routes protégées nécessitent un header `Authorization: Bearer {token}`
2. Le token est obtenu lors de la connexion
3. Les rôles sont vérifiés côté serveur
4. Les dates doivent être au format ISO (YYYY-MM-DD)
5. Les notes d'évaluation sont entre 1 et 5
