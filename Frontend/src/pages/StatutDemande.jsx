import React, { useState } from 'react';
import { Mail, Search, CheckCircle, XCircle, Clock, User, Tag, Calendar, Key } from 'lucide-react';
import './StatutDemande.css';

const StatutDemande = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [demande, setDemande] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setDemande(null);
        setSearched(false);

        if (!email) {
            setError('Veuillez entrer votre adresse email.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/formateurs/check-statut', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.found) {
                setDemande(data.demande);
            } else {
                setError(data.message || 'Aucune demande trouvée avec cet email.');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur lors de la vérification. Veuillez réessayer.');
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'en_attente':
                return {
                    icon: <Clock className="statut-icon" />,
                    text: 'En attente',
                    className: 'statut-badge statut-attente'
                };
            case 'approuve':
                return {
                    icon: <CheckCircle className="statut-icon" />,
                    text: 'Approuvée',
                    className: 'statut-badge statut-approuve'
                };
            case 'rejete':
                return {
                    icon: <XCircle className="statut-icon" />,
                    text: 'Rejetée',
                    className: 'statut-badge statut-rejete'
                };
            default:
                return {
                    icon: <Clock className="statut-icon" />,
                    text: statut,
                    className: 'statut-badge'
                };
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    return (
        <div className="statut-demande-container">
            <div className="statut-demande-content">
                <div className="statut-header">
                    <div className="statut-icon-wrapper">
                        <Search className="header-icon" />
                    </div>
                    <h1>Vérifier le statut de ma demande</h1>
                    <p className="statut-subtitle">
                        Entrez votre adresse email pour consulter l'état de votre candidature
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="statut-form">
                    <div className="form-group">
                        <label htmlFor="email">
                            <Mail className="label-icon" />
                            Adresse Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre.email@exemple.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <XCircle className="error-icon" />
                            {error}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Recherche en cours...
                            </>
                        ) : (
                            <>
                                <Search className="btn-icon" />
                                Vérifier le statut
                            </>
                        )}
                    </button>
                </form>

                {searched && demande && (
                    <div className="demande-result">
                        <div className="result-header">
                            <h2>Résultat de votre demande</h2>
                            <div className={getStatutBadge(demande.statut).className}>
                                {getStatutBadge(demande.statut).icon}
                                {getStatutBadge(demande.statut).text}
                            </div>
                        </div>

                        <div className="result-details">
                            <div className="detail-item">
                                <User className="detail-icon" />
                                <div>
                                    <span className="detail-label">Nom complet</span>
                                    <span className="detail-value">{demande.prenom} {demande.nom}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <Mail className="detail-icon" />
                                <div>
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{demande.email}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <Tag className="detail-icon" />
                                <div>
                                    <span className="detail-label">Compétences</span>
                                    <span className="detail-value">{demande.mots_cles}</span>
                                </div>
                            </div>

                            <div className="detail-item">
                                <Calendar className="detail-icon" />
                                <div>
                                    <span className="detail-label">Date de soumission</span>
                                    <span className="detail-value">{formatDate(demande.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {demande.statut === 'en_attente' && (
                            <div className="info-box info-attente">
                                <Clock className="info-icon" />
                                <div>
                                    <h3>Votre demande est en cours de traitement</h3>
                                    <p>Notre équipe examine votre candidature. Vous serez informé dès qu'une décision sera prise.</p>
                                </div>
                            </div>
                        )}


                        {demande.statut === 'approuve' && (
                            <>
                                {demande.password_temporaire && (
                                    <div className="password-box">
                                        <div className="password-header">
                                            <Key className="password-icon" />
                                            <h3>Vos identifiants de connexion</h3>
                                        </div>
                                        <div className="password-content">
                                            <div className="password-item">
                                                <span className="password-label">Email :</span>
                                                <span className="password-value">{demande.email}</span>
                                            </div>
                                            <div className="password-item">
                                                <span className="password-label">Mot de passe :</span>
                                                <span className="password-value password-highlight">{demande.password_temporaire}</span>
                                            </div>
                                        </div>
                                        <p className="password-note">
                                            ⚠️ Conservez ces informations en lieu sûr. Nous vous recommandons de changer votre mot de passe après votre première connexion.
                                        </p>
                                    </div>
                                )}
                                <div className="info-box info-approuve">
                                    <CheckCircle className="info-icon" />
                                    <div>
                                        <h3>Félicitations ! Votre demande a été approuvée</h3>
                                        <p>
                                            {demande.password_temporaire
                                                ? "Vous pouvez maintenant vous connecter à la plateforme avec les identifiants ci-dessus."
                                                : "Vous pouvez maintenant vous connecter à la plateforme. Si vous n'avez pas reçu vos informations de connexion, veuillez contacter l'administration."
                                            }
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}


                        {demande.statut === 'rejete' && (
                            <div className="info-box info-rejete">
                                <XCircle className="info-icon" />
                                <div>
                                    <h3>Votre demande n'a pas été retenue</h3>
                                    <p>Malheureusement, votre candidature ne correspond pas à nos critères actuels. N'hésitez pas à postuler à nouveau ultérieurement.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatutDemande;
