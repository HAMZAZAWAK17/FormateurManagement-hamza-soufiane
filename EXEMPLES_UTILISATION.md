# 📘 EXEMPLES D'UTILISATION - Composants Professionnels

## 🎯 Guide Pratique pour Intégrer le Nouveau Design

Ce fichier contient des exemples concrets d'utilisation des nouveaux composants professionnels.

---

## 1. 📐 Utiliser le Thème

### Dans App.jsx (Déjà fait ✅)
```jsx
import theme from './theme';
import { ThemeProvider } from '@mui/material';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Votre application */}
    </ThemeProvider>
  );
}
```

---

## 2. 🎨 ProfessionalSidebar

### Exemple Dashboard Admin
```jsx
import React from 'react';
import { Box } from '@mui/material';
import ProfessionalSidebar from '../components/ProfessionalSidebar';
import ProfessionalHeader from '../components/ProfessionalHeader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
    { path: '/admin/formations', label: 'Formations', icon: <SchoolIcon /> },
    { path: '/admin/formateurs', label: 'Formateurs', icon: <PeopleIcon /> },
    { path: '/admin/sessions', label: 'Sessions', icon: <EventIcon /> }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <ProfessionalSidebar
        open={true}
        menuItems={menuItems}
        user={user}
      />
      
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: '#BBE1FA', minHeight: '100vh' }}>
        <ProfessionalHeader title="Dashboard Admin" />
        
        <Box sx={{ p: 3, mt: 8 }}>
          {/* Votre contenu ici */}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
```

---

## 3. 🃏 ProfessionalCard

### Exemple 1 : Card Formation
```jsx
import ProfessionalCard from '../components/ProfessionalCard';
import SchoolIcon from '@mui/icons-material/School';
import { Button } from '@mui/material';

<ProfessionalCard
  title="Formation React Avancé"
  subtitle="Développement Web"
  description="Maîtrisez React, Redux, et les hooks avancés en 40 heures de formation intensive."
  status="Disponible"
  statusColor="success"
  icon={<SchoolIcon />}
  actions={
    <>
      <Button size="small" variant="outlined" sx={{ borderColor: '#3282B8', color: '#3282B8' }}>
        Détails
      </Button>
      <Button size="small" variant="contained" color="secondary">
        S'inscrire
      </Button>
    </>
  }
/>
```

### Exemple 2 : Card Statistique
```jsx
import ProfessionalCard from '../components/ProfessionalCard';
import PeopleIcon from '@mui/icons-material/People';
import { Typography } from '@mui/material';

<ProfessionalCard
  icon={<PeopleIcon />}
>
  <Typography variant="h3" fontWeight={600} color="#1E2A32">
    245
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Participants inscrits
  </Typography>
</ProfessionalCard>
```

### Exemple 3 : Card avec Click
```jsx
<ProfessionalCard
  title="Formation Node.js"
  subtitle="Backend Development"
  description="Créez des APIs RESTful avec Node.js et Express"
  onClick={() => navigate('/formation/123')}
/>
```

---

## 4. 📊 ProfessionalTable

### Exemple : Table Formations
```jsx
import ProfessionalTable from '../components/ProfessionalTable';
import { Chip } from '@mui/material';

const columns = [
  { id: 'titre', label: 'Titre' },
  { id: 'categorie', label: 'Catégorie' },
  { 
    id: 'duree', 
    label: 'Durée',
    render: (row) => `${row.duree} heures`
  },
  {
    id: 'statut',
    label: 'Statut',
    render: (row) => (
      <Chip
        label={row.statut}
        size="small"
        color={row.statut === 'actif' ? 'success' : 'default'}
      />
    )
  }
];

const formations = [
  { id: 1, titre: 'React', categorie: 'Web', duree: 40, statut: 'actif' },
  { id: 2, titre: 'Node.js', categorie: 'Backend', duree: 30, statut: 'actif' }
];

<ProfessionalTable
  columns={columns}
  data={formations}
  onView={(row) => console.log('Voir', row)}
  onEdit={(row) => console.log('Modifier', row)}
  onDelete={(row) => console.log('Supprimer', row)}
  emptyMessage="Aucune formation disponible"
/>
```

### Exemple : Table Sans Actions
```jsx
<ProfessionalTable
  columns={columns}
  data={formations}
  emptyMessage="Aucune donnée"
/>
```

---

## 5. 🎯 ProfessionalHeader

### Exemple Simple
```jsx
import ProfessionalHeader from '../components/ProfessionalHeader';

<ProfessionalHeader title="Dashboard Formateur" />
```

### Exemple avec Menu Mobile
```jsx
const [mobileOpen, setMobileOpen] = useState(false);

<ProfessionalHeader
  title="Dashboard Participant"
  onMenuClick={() => setMobileOpen(!mobileOpen)}
/>
```

---

## 6. 🎨 Boutons avec Thème

### Bouton Principal (Secondary)
```jsx
<Button variant="contained" color="secondary">
  Ajouter une formation
</Button>
```

### Bouton Modifier (Accent)
```jsx
<Button
  variant="outlined"
  sx={{
    borderColor: '#3282B8',
    color: '#3282B8',
    '&:hover': {
      borderColor: '#25628F',
      backgroundColor: 'rgba(50, 130, 184, 0.1)'
    }
  }}
>
  Modifier
</Button>
```

### Bouton Supprimer (Rouge)
```jsx
<Button
  variant="outlined"
  sx={{
    borderColor: '#DC2626',
    color: '#DC2626',
    '&:hover': {
      borderColor: '#B91C1C',
      backgroundColor: 'rgba(220, 38, 38, 0.1)'
    }
  }}
>
  Supprimer
</Button>
```

---

## 7. 🏷️ Chips/Badges

### Status Formations
```jsx
// Actif
<Chip label="Actif" color="success" size="small" />

// En attente
<Chip label="En attente" color="warning" size="small" />

// Terminé
<Chip label="Terminé" color="default" size="small" />

// Annulé
<Chip label="Annulé" color="error" size="small" />
```

### Rôles
```jsx
<Chip
  label="Admin"
  size="small"
  sx={{
    backgroundColor: '#1E2A32',
    color: '#FFFFFF',
    fontWeight: 500
  }}
/>
```

---

## 8. 📝 Formulaires

### TextField avec Focus Accent
```jsx
<TextField
  label="Titre de la formation"
  variant="outlined"
  fullWidth
  // Le focus sera automatiquement en Accent (#3282B8)
/>
```

### Select
```jsx
<TextField
  select
  label="Catégorie"
  fullWidth
>
  <MenuItem value="web">Développement Web</MenuItem>
  <MenuItem value="mobile">Développement Mobile</MenuItem>
</TextField>
```

---

## 9. 🔔 Feedback Utilisateur

### Loading
```jsx
import { CircularProgress, Box } from '@mui/material';

<Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
  <CircularProgress sx={{ color: '#3282B8' }} />
</Box>
```

### Alerts
```jsx
import { Alert } from '@mui/material';

// Succès
<Alert severity="success">Formation ajoutée avec succès !</Alert>

// Erreur
<Alert severity="error">Une erreur est survenue</Alert>

// Avertissement
<Alert severity="warning">Attention, cette action est irréversible</Alert>

// Info
<Alert severity="info">Nouvelle fonctionnalité disponible</Alert>
```

---

## 10. 📱 Layout Complet

### Template Dashboard
```jsx
import React from 'react';
import { Box, Container, Grid } from '@mui/material';
import ProfessionalSidebar from '../components/ProfessionalSidebar';
import ProfessionalHeader from '../components/ProfessionalHeader';
import ProfessionalCard from '../components/ProfessionalCard';
import ProfessionalTable from '../components/ProfessionalTable';

const DashboardTemplate = () => {
  const menuItems = [
    // Vos items de menu
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <ProfessionalSidebar
        open={true}
        menuItems={menuItems}
        user={user}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#BBE1FA',
          minHeight: '100vh'
        }}
      >
        {/* Header */}
        <ProfessionalHeader title="Mon Dashboard" />

        {/* Content */}
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
          {/* Statistiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <ProfessionalCard
                title="120"
                subtitle="Formations"
                icon={<SchoolIcon />}
              />
            </Grid>
            {/* Autres cards */}
          </Grid>

          {/* Table */}
          <ProfessionalTable
            columns={columns}
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardTemplate;
```

---

## 11. 🎨 Grid Layout

### 3 Colonnes
```jsx
<Grid container spacing={3}>
  <Grid item xs={12} md={4}>
    <ProfessionalCard title="Card 1" />
  </Grid>
  <Grid item xs={12} md={4}>
    <ProfessionalCard title="Card 2" />
  </Grid>
  <Grid item xs={12} md={4}>
    <ProfessionalCard title="Card 3" />
  </Grid>
</Grid>
```

### 4 Colonnes (Statistiques)
```jsx
<Grid container spacing={3}>
  {stats.map((stat) => (
    <Grid item xs={12} sm={6} md={3} key={stat.id}>
      <ProfessionalCard
        title={stat.value}
        subtitle={stat.label}
        icon={stat.icon}
      />
    </Grid>
  ))}
</Grid>
```

---

## 12. 🔍 Filtres

### Barre de Filtres Horizontale
```jsx
<Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
  <TextField
    label="Rechercher"
    variant="outlined"
    size="small"
    sx={{ minWidth: 250 }}
  />
  <TextField
    select
    label="Catégorie"
    size="small"
    sx={{ minWidth: 150 }}
  >
    <MenuItem value="all">Toutes</MenuItem>
    <MenuItem value="web">Web</MenuItem>
  </TextField>
  <Button variant="contained" color="secondary">
    Filtrer
  </Button>
</Box>
```

---

## ✅ Checklist d'Intégration

### Pour chaque Dashboard
- [ ] Importer ProfessionalSidebar
- [ ] Importer ProfessionalHeader
- [ ] Définir menuItems
- [ ] Utiliser ProfessionalCard pour les stats
- [ ] Utiliser ProfessionalTable pour les listes
- [ ] Appliquer le background #BBE1FA
- [ ] Tester responsive

### Vérifications
- [ ] Couleurs Primary/Secondary/Accent respectées
- [ ] Border-radius 8-12px
- [ ] Ombres légères
- [ ] Typographie Inter/Roboto
- [ ] Feedback utilisateur (loading, alerts)
- [ ] Navigation claire

---

**Tous les composants sont prêts à l'emploi ! 🚀**

*Copiez-collez ces exemples et adaptez-les à vos besoins*
