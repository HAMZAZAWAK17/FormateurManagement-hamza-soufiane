import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ShieldCheck, UserCog, GraduationCap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await login(email, password);
        if (result.success) {
            toast.success('Connexion réussie !');
            // Redirect based on role
            if (result.user?.role === 'participant') {
                navigate('/participant/dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            toast.error(result.message);
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-[#1e293b]/50 backdrop-blur-2xl p-8 rounded-3xl border border-[#334155]/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 ring-4 ring-white/5">
                            <LogIn className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenue</h1>
                        <p className="text-slate-400 font-medium">Connectez-vous à votre espace formation</p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group space-y-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1 group-focus-within:text-blue-400 transition-colors">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-300 group-focus-within:text-blue-400 transition-colors">Mot de passe</label>
                                <Link to="/forgot-password" size="sm" className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors">
                                    Oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 transition-colors group-focus-within:text-blue-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f172a]/50 border border-[#334155]/50 text-white pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <LogIn className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#334155] grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                            <ShieldCheck className="text-blue-400 w-5 h-5" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Admin</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                            <GraduationCap className="text-purple-400 w-5 h-5" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Formateur</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity cursor-help">
                            <UserCog className="text-emerald-400 w-5 h-5" />
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assistant</span>
                        </div>
                    </div>
                </div>

                <p className="text-center mt-6 text-slate-500 text-sm">
                    &copy; 2026 Centre de Formation Digital. Tous droits réservés.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
