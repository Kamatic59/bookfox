import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
            <span className="text-xl font-bold text-stone-800">Book<span className="text-primary-600">Fox</span></span>
          </Link>

          <h1 className="text-3xl font-bold text-stone-800 mb-2">Start Your <span className="text-primary-600">Free Trial</span></h1>
          <p className="text-stone-500 mb-8">No credit card required. Setup in <span className="text-indigo-600 font-medium">10 minutes</span>.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-stone-500 mt-1.5">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-stone-500">
              Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Log in</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right - Benefits (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-primary-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">Get started in 10 minutes</h2>
          <p className="text-primary-100 text-lg mb-8">We'll walk you through everything. Here's what we'll do:</p>
          
          <div className="space-y-4">
            {[
              { check: '✓', text: 'Connect your lead sources', time: '3 min' },
              { check: '✓', text: 'Teach BookFox about your business', time: '5 min' },
              { check: '✓', text: 'See it respond to a test lead', time: '2 min' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.check}
                  </span>
                  <span>{item.text}</span>
                </div>
                <span className="text-primary-200 text-sm">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/20">
            <div className="flex gap-1 mb-3">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-amber-400">{s}</span>)}</div>
            <p className="text-white/90 italic mb-3">"Setup took 12 minutes. Now I never miss a lead."</p>
            <p className="text-primary-200 text-sm">— Carlos Martinez, Wasatch Plumbing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
