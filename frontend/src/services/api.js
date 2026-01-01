import axios from 'axios';

/**
 * Configuration Axios pour les appels API
 */
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Intercepteur pour ajouter le token JWT à chaque requête
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Intercepteur pour gérer les erreurs de réponse
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expiré ou invalide
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Services d'authentification
 */
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data)
};

/**
 * Services pour les formations
 */
export const formationService = {
    getAll: (params) => api.get('/formations', { params }),
    getById: (id) => api.get(`/formations/${id}`),
    create: (data) => api.post('/formations', data),
    update: (id, data) => api.put(`/formations/${id}`, data),
    delete: (id) => api.delete(`/formations/${id}`)
};

/**
 * Services pour les formateurs
 */
export const formateurService = {
    getAll: () => api.get('/formateurs'),
    getById: (id) => api.get(`/formateurs/${id}`),
    update: (id, data) => api.put(`/formateurs/${id}`, data),
    getFormations: (id) => api.get(`/formateurs/${id}/formations`), // Sessions
    getEvaluations: (id) => api.get(`/formateurs/${id}/evaluations`),
    getMyFormations: (id) => api.get(`/formateurs/${id}/my-formations`),
    getMyStudents: (id) => api.get(`/formateurs/${id}/etudiants`),
    addRessource: (data) => api.post(`/formateurs/ressources`, data),
    getRessources: (formationId) => api.get(`/formateurs/formations/${formationId}/ressources`),
    deleteRessource: (id) => api.delete(`/formateurs/ressources/${id}`),
    delete: (id) => api.delete(`/formateurs/${id}`)
};

/**
 * Services pour les sessions
 */
export const sessionService = {
    getAll: () => api.get('/sessions'),
    getById: (id) => api.get(`/sessions/${id}`),
    getByFormateur: (id) => api.get(`/sessions/formateur/${id}`),
    create: (data) => api.post('/sessions', data),
    update: (id, data) => api.put(`/sessions/${id}`, data),
    delete: (id) => api.delete(`/sessions/${id}`)
};

/**
 * Services pour les inscriptions
 */
export const inscriptionService = {
    inscrire: (data) => api.post('/inscriptions', data),
    getMesInscriptions: () => api.get('/inscriptions/mes-inscriptions'),
    getByParticipant: (id) => api.get(`/inscriptions/participant/${id}`),
    annuler: (id) => api.delete(`/inscriptions/${id}`),
    getAll: () => api.get('/inscriptions')
};

/**
 * Services pour les évaluations
 */
export const evaluationService = {
    create: (data) => api.post('/evaluations', data),
    getMesEvaluations: () => api.get('/evaluations/mes-evaluations'),
    getByFormateur: (id) => api.get(`/evaluations/formateur/${id}`),
    getAll: () => api.get('/evaluations')
};

export default api;
