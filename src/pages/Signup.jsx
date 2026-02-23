import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FadeIn, MagneticButton } from '../components/shared/Animations';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pass firstName as business name for now, they'll set real business name in onboarding
      await signUp(email, password, firstName + "'s Business");
      // Store firstName for onboarding
      localStorage.setItem('bookfox_firstName', firstName);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-cream)] relative overflow-hidden">
      {/* Background glow effects for the left side */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2E4036]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#CC5833]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          <FadeIn delay={0}>
            <Link to="/" className="inline-flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="BookFox" className="w-14 h-14" />
              <span className="text-2xl font-bold font-['Cormorant_Garamond'] italic text-[#1A1A1A]">Book<span className="text-[#CC5833]">Fox</span></span>
            </Link>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Start Your <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Free Trial</span></h1>
            <p className="text-[#2E4036]/70 mb-8 font-medium">No credit card required. Setup in 10 minutes.</p>
          </FadeIn>

          <FadeIn delay={200}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-[#CC5833]/10 border border-[#CC5833]/20 text-[#CC5833] rounded-xl text-sm font-['Outfit']">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 font-['Plus_Jakarta_Sans']">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition shadow-sm"
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 font-['Plus_Jakarta_Sans']">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition shadow-sm"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5 font-['Plus_Jakarta_Sans']">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition shadow-sm"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <p className="text-xs text-[#2E4036]/60 mt-1.5 font-['IBM_Plex_Mono']">Must be at least 6 characters</p>
              </div>

              <div className="pt-2">
                <MagneticButton type="submit" disabled={loading} loading={loading} className="w-full py-3.5">
                  {loading ? 'Creating account...' : 'Create Account'}
                </MagneticButton>
              </div>

              <p className="text-center text-sm text-[#2E4036]/70 mt-6 font-medium">
                Already have an account? <Link to="/login" className="text-[#CC5833] font-bold hover:underline">Log in</Link>
              </p>
            </form>
          </FadeIn>
        </div>
      </div>

      {/* Right - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-[#2E4036] items-center justify-center p-12 relative overflow-hidden">
        {/* Organic texture overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

        <div className="max-w-md text-[#F2F0E9] relative z-10">
          <h2 className="text-3xl font-bold mb-6 font-['Plus_Jakarta_Sans'] text-white">Get started in 10 minutes</h2>
          <p className="text-[#F2F0E9]/80 text-lg mb-8 font-['Outfit']">We'll walk you through everything. Here's what we'll do:</p>

          <div className="space-y-4">
            {[
              { check: '✓', text: 'Connect your lead sources', time: '3 min' },
              { check: '✓', text: 'Teach BookFox about your business', time: '5 min' },
              { check: '✓', text: 'See it respond to a test lead', time: '2 min' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#CC5833] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.check}
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] font-medium">{item.text}</span>
                </div>
                <span className="text-[#F2F0E9]/60 text-sm font-['IBM_Plex_Mono']">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex gap-1 mb-3">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-[#CC5833]">{s}</span>)}</div>
            <p className="text-white/90 font-['Cormorant_Garamond'] italic text-lg mb-3">"Setup took 12 minutes. Now I never miss a lead."</p>
            <p className="text-[#F2F0E9]/60 text-sm font-['IBM_Plex_Mono'] uppercase tracking-wider">— Carlos Martinez, Wasatch Plumbing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
