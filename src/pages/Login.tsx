import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  UserPlus, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuth();

  const [tab, setTab] = useState<'signin' | 'register'>('signin');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Determine redirection target (if redirected from a protected route)
  const from = (location.state as any)?.from?.pathname || '/home';

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || !firstName.trim() || !lastName.trim()) {
      setError('Please fill in your name, email address, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const result = await register({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim() || undefined,
    });
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Registration failed. User may already exist.');
    }
  };

  const fillDemoAccount = () => {
    setTab('signin');
    setEmail('demo@valyou.com');
    setPassword('demo123');
    setError(null);
    setSuccessMsg('Filled demo appraiser credentials. Click "Sign In" below!');
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-background-main overflow-hidden">
      {/* Decorative Memphis Background Accents */}
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full memphis-circle-blue pointer-events-none blur-3xl opacity-50" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full memphis-circle-yellow pointer-events-none blur-3xl opacity-45" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full memphis-circle-orange pointer-events-none blur-3xl opacity-25" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-md bg-white border-2 border-border-light rounded-3xl p-6 sm:p-8 shadow-memphis-card z-10 my-4 sm:my-8 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-pastel/60 mb-3 border border-primary/20 shadow-sm">
            <img 
              src="/logo.png" 
              alt="Valyou Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-sm"
            />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black valyou-gradient-text tracking-tight block">
              Valyou
            </span>
            <p className="text-xs sm:text-sm font-semibold text-text-secondary mt-1">
              Fairness in Every <span className="text-accent-orange font-bold">Square Meter</span>
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex bg-background-main p-1.5 rounded-2xl mb-6 border border-border-light">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
              tab === 'signin'
                ? 'bg-white text-primary shadow-sm border border-border-light/60'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-primary shadow-sm border border-border-light/60'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed animate-in fade-in duration-200">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-semibold flex items-start gap-2.5 leading-relaxed animate-in fade-in duration-200">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock size={18} className="absolute left-3.5 text-text-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-background-main border border-border-light rounded-2xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-text-muted hover:text-text-primary p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-primary to-[#3d8fd9] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg hover:from-primary-hover hover:to-primary active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in with Valyou...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
                  First Name
                </label>
                <div className="relative flex items-center">
                  <UserIcon size={16} className="absolute left-3 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-background-main border border-border-light rounded-2xl text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                  className="w-full px-3.5 py-2.5 bg-background-main border border-border-light rounded-2xl text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  autoComplete="email"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-background-main border border-border-light rounded-2xl text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
                Phone Number (Optional)
              </label>
              <div className="relative flex items-center">
                <Phone size={16} className="absolute left-3 text-text-muted pointer-events-none" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+63 917 123 4567"
                  autoComplete="tel"
                  className="w-full pl-9 pr-3 py-2.5 bg-background-main border border-border-light rounded-2xl text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-text-muted pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  className="w-full pl-9 pr-9 py-2.5 bg-background-main border border-border-light rounded-2xl text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted hover:text-text-primary p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-accent-orange to-[#ffaa40] text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Create Account & Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Demo Account Action */}
        <div className="mt-6 pt-5 border-t border-border-light">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted text-center mb-2.5">
            Quick Demo Access
          </p>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="w-full py-2.5 px-4 bg-primary-pastel hover:bg-primary-pastel/80 text-primary border border-primary/20 rounded-2xl text-xs font-bold flex items-center justify-between active:scale-[0.99] transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Sparkles size={14} />
              </span>
              <div className="text-left">
                <span className="font-extrabold block text-xs">Demo Appraiser</span>
                <span className="text-[11px] text-text-secondary font-medium font-mono">demo@valyou.com</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
              Auto Fill
              <ArrowRight size={13} />
            </span>
          </button>
        </div>

      </div>

      {/* Cloud Sync Status Badge */}
      <div className="text-center text-[11px] text-text-muted flex items-center gap-1.5 z-10 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Valyou Cloud Platform • Secure & Encrypted</span>
      </div>
    </div>
  );
};

export default Login;
