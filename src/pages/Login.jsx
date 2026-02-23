import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FadeIn, OrganicCard, MagneticButton } from '../components/shared/Animations';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle organic background textures */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#2E4036]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#CC5833]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <FadeIn delay={0}>
          <Link to="/" className="inline-flex items-center gap-3 mb-8 justify-center w-full">
            <img src="/logo.png" alt="BookFox" className="w-14 h-14" />
            <span className="text-2xl font-bold font-['Cormorant_Garamond'] italic text-[#1A1A1A]">Book<span className="text-[#CC5833]">Fox</span></span>
          </Link>
        </FadeIn>

        <FadeIn delay={100}>
          <OrganicCard className="p-8 sm:p-10">
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Welcome <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">back</span></h1>
            <p className="text-[#2E4036]/70 mb-8 font-medium">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-[#CC5833]/10 border border-[#CC5833]/20 text-[#CC5833] rounded-xl text-sm font-['Outfit']">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 font-['Plus_Jakarta_Sans']">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Password</label>
                  <a href="#" className="text-sm text-[#CC5833] hover:underline font-medium">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="pt-2">
                <MagneticButton type="submit" disabled={loading} loading={loading} className="w-full py-3.5">
                  {loading ? 'Signing in...' : 'Sign In'}
                </MagneticButton>
              </div>

              <p className="text-center text-sm text-[#2E4036]/70 mt-6 font-medium">
                Don't have an account? <Link to="/signup" className="text-[#CC5833] font-bold hover:underline">Start free trial</Link>
              </p>
            </form>
          </OrganicCard>
        </FadeIn>
      </div>
    </div>
  );
}
