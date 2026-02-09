import { Link } from 'react-router-dom';
import { useState } from 'react';

// ROI Calculator Component
function ROICalculator() {
  const [leads, setLeads] = useState(50);
  const [jobValue, setJobValue] = useState(3000);
  const [missRate, setMissRate] = useState(40);
  const [showResult, setShowResult] = useState(false);

  const monthlyLoss = Math.round((leads * (missRate / 100) * jobValue));
  const yearlyLoss = monthlyLoss * 12;
  const roi = Math.round(monthlyLoss / 299);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-medium text-stone-700">Leads per month</label>
          <span className="text-blue-600 font-bold">{leads}</span>
        </div>
        <input
          type="range" min="10" max="200" value={leads}
          onChange={(e) => { setLeads(Number(e.target.value)); setShowResult(false); }}
          className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-medium text-stone-700">Average job value</label>
          <span className="text-blue-600 font-bold">${jobValue.toLocaleString()}</span>
        </div>
        <input
          type="range" min="500" max="20000" step="500" value={jobValue}
          onChange={(e) => { setJobValue(Number(e.target.value)); setShowResult(false); }}
          className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-medium text-stone-700">% of leads missed</label>
          <span className="text-blue-600 font-bold">{missRate}%</span>
        </div>
        <input
          type="range" min="10" max="70" value={missRate}
          onChange={(e) => { setMissRate(Number(e.target.value)); setShowResult(false); }}
          className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <button
        onClick={() => setShowResult(true)}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition active:scale-[0.98]"
      >
        Calculate My Losses
      </button>

      {showResult && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <p className="text-stone-600 mb-1">You're losing approximately</p>
          <p className="text-4xl sm:text-5xl font-bold text-red-600 mb-1">${monthlyLoss.toLocaleString()}</p>
          <p className="text-stone-500 text-sm mb-4">per month · ${yearlyLoss.toLocaleString()} per year</p>
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <p className="text-stone-600">BookFox costs <span className="font-bold text-stone-800">$299/month</span></p>
            <p className="text-3xl font-bold text-emerald-600">{roi}x ROI</p>
          </div>
          <Link to="/signup" className="block w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 transition active:scale-[0.98]">
            Start Free Trial — Stop Losing Money
          </Link>
        </div>
      )}
    </div>
  );
}

// FAQ Item Component
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex justify-between items-center text-left gap-4">
        <span className="font-semibold text-stone-800">{q}</span>
        <span className={`flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-stone-600">{a}</p>
      </div>
    </div>
  );
}

// Card wrapper for consistent styling
function Card({ children, className = '', glass = false }) {
  return (
    <div className={`rounded-2xl p-6 sm:p-8 ${glass ? 'bg-white/70 backdrop-blur-lg border border-white/50' : 'bg-white border border-stone-100'} shadow-xl shadow-stone-900/5 ${className}`}>
      {children}
    </div>
  );
}

// Section wrapper
function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 px-4 ${className}`}>
      {children}
    </section>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 via-indigo-50 to-purple-100 relative">
      {/* Global decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-[600px] h-[600px] bg-indigo-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="BookFox" className="w-9 h-9" />
            <span className="text-xl font-bold text-stone-800">Book<span className="text-blue-600">Fox</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-stone-600 hover:text-blue-600 transition">How It Works</a>
            <a href="#pricing" className="text-stone-600 hover:text-blue-600 transition">Pricing</a>
            <Link to="/login" className="text-stone-600 hover:text-blue-600 transition">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25">
              Start Free Trial
            </Link>
          </div>
          <button className="md:hidden p-2 -mr-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-stone-100 p-4 space-y-1">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-stone-700 hover:bg-stone-50 rounded-xl">How It Works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-stone-700 hover:bg-stone-50 rounded-xl">Pricing</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-stone-700 hover:bg-stone-50 rounded-xl">Sign In</Link>
            <Link to="/signup" className="block bg-blue-600 text-white py-4 rounded-xl font-semibold text-center mt-2">Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <Section className="pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 mb-6 leading-tight">
            Never Miss Another <span className="text-blue-600">Lead</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-6 max-w-2xl mx-auto">
            AI responds to every lead in <span className="text-blue-600 font-semibold">60 seconds</span> — even when you're busy
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-stone-500 mb-8">
            <span className="flex items-center gap-2"><span className="text-amber-500">⚡</span> 15-min setup</span>
            <span className="flex items-center gap-2"><span className="text-blue-500">💬</span> Works 24/7</span>
            <span className="flex items-center gap-2"><span className="text-red-500">✕</span> Cancel anytime</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/30 active:scale-[0.98]">
              Start Free 14-Day Trial — No Credit Card
            </Link>
            <a href="#demo" className="w-full sm:w-auto text-stone-600 font-medium hover:text-blue-600 px-6 py-4 flex items-center justify-center gap-3 transition">
              <span className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600">▶</span>
              Watch 60-Second Demo
            </a>
          </div>
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section>
        <div className="max-w-6xl mx-auto relative z-10">
          <Card glass className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-8">
              Contractors Are Booking More Jobs With <span className="text-blue-600">BookFox</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { stars: 5, quote: "Booked 8 extra jobs in 3 weeks", name: "Mike Peterson", biz: "Peterson HVAC", result: "+$18,000", sub: "first month" },
                { stars: 5, quote: "Customers love the instant response", name: "Sarah Chen", biz: "Summit Roofing", result: "73%", sub: "response rate (up from 31%)" },
                { stars: 5, quote: "Setup took 12 minutes", name: "Carlos Martinez", biz: "Wasatch Plumbing", result: "127", sub: "leads responded, month 1" },
              ].map((t, i) => (
                <div key={i} className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-100">
                  <div className="text-amber-400 mb-3 text-lg">{'★'.repeat(t.stars)}</div>
                  <p className="text-stone-800 font-medium mb-4 text-lg">"{t.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                    <div>
                      <p className="font-semibold text-stone-700">{t.name}</p>
                      <p className="text-stone-500 text-sm">{t.biz}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{t.result}</p>
                      <p className="text-xs text-stone-500">{t.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* THE PROBLEM */}
      <Section>
        <div className="max-w-6xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
              You're <span className="text-red-500">Losing Leads</span> Every Single Day
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                { icon: "⏰", title: "Lead comes in at 2pm", desc: "You're on a roof or with a customer", color: "bg-amber-100" },
                { icon: "📱", title: "You call back at 5pm", desc: "3 hours later when you're free", color: "bg-blue-100" },
                { icon: "❌", title: "They already hired someone", desc: "First to respond wins 78% of the time", color: "bg-red-100" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-stone-800 text-lg mb-2">{item.title}</h3>
                  <p className="text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-red-600 mb-6">Every missed lead costs you $2,000-$10,000</p>
              <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                Stop Losing Money — Start Free Trial
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section id="how-it-works">
        <div className="max-w-6xl mx-auto relative z-10">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
              How <span className="text-blue-200">BookFox</span> Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                { icon: "📞", num: "1", title: "Lead Comes In", desc: "From your website, Facebook, Google, or missed calls" },
                { icon: "🤖", num: "2", title: "BookFox Responds Instantly", desc: "In under 60 seconds via text. Qualifies them. Books appointment." },
                { icon: "✅", num: "3", title: "You Get Notified", desc: "Only when they're ready to book. You just show up and do the job." },
              ].map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 border border-white/30">
                    {s.icon}
                  </div>
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-2 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg md:right-4 md:translate-x-0">
                    {s.num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-blue-100">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg active:scale-[0.98]">
                Start Free Trial
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* DEMO / SHOW IN ACTION */}
      <Section id="demo">
        <div className="max-w-6xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
              See A <span className="text-blue-600">Real Conversation</span>
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Phone mockup */}
              <div className="order-2 lg:order-1">
                <div className="bg-stone-900 rounded-[2.5rem] p-3 shadow-2xl max-w-[280px] sm:max-w-xs mx-auto">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    <div className="bg-gradient-to-r from-stone-100 to-stone-50 px-4 py-3 text-center">
                      <p className="text-xs text-stone-500 font-medium">Messages</p>
                    </div>
                    <div className="p-4 space-y-3 min-h-[320px] sm:min-h-[380px]">
                      <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm">Hey I need my AC fixed, it's not cooling</p>
                      </div>
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] ml-auto">
                        <p className="text-sm">I can help! Is this an emergency or can it wait a day or two?</p>
                      </div>
                      <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm">Pretty urgent, it's 95 degrees in here</p>
                      </div>
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] ml-auto">
                        <p className="text-sm">Got it. I can get someone out today at 2pm or 4pm. Which works?</p>
                      </div>
                      <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                        <p className="text-sm">2pm works</p>
                      </div>
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] ml-auto">
                        <p className="text-sm">Perfect! You're booked for 2pm. I'll send a reminder. See you then! 🙂</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Text content */}
              <div className="order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-6">Your customers have no idea it's AI</h3>
                <ul className="space-y-4 mb-8">
                  {[
                    "Sounds natural and friendly — not robotic",
                    "Asks the right questions automatically",
                    "Books appointments directly to your calendar",
                    "Works 24/7, even at 2am on weekends",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-4 text-stone-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* FEATURES */}
      <Section>
        <div className="max-w-6xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
              Everything You Need To <span className="text-blue-600">Capture Every Lead</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: "⚡", title: "60-Second Response Time", desc: "Responds instantly via text — the way customers want. Works 24/7, even holidays.", color: "from-amber-50 to-orange-50" },
                { icon: "🎯", title: "Smart Qualification", desc: "Asks the right questions to figure out if they're ready to buy. Only notifies you about hot leads.", color: "from-blue-50 to-indigo-50" },
                { icon: "📅", title: "Automatic Booking", desc: "Checks your calendar and books appointments without you touching your phone. Sends reminders too.", color: "from-emerald-50 to-teal-50" },
                { icon: "🔗", title: "Works With Everything", desc: "Connects to your website, Facebook, Google, Yelp, missed calls — wherever leads come from.", color: "from-purple-50 to-pink-50" },
              ].map((f, i) => (
                <div key={i} className={`bg-gradient-to-br ${f.color} rounded-xl p-6 border border-stone-100`}>
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-stone-800 text-lg mb-2">{f.title}</h3>
                  <p className="text-stone-600">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                Start Free Trial
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* ROI CALCULATOR */}
      <Section>
        <div className="max-w-lg mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-2">
              How Much Are You <span className="text-red-500">Losing</span> Right Now?
            </h2>
            <p className="text-stone-500 text-center mb-8">Drag the sliders to see your potential losses</p>
            <ROICalculator />
          </Card>
        </div>
      </Section>

      {/* COMPARISON TABLE */}
      <Section>
        <div className="max-w-4xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
              <span className="text-blue-600">BookFox</span> vs. The Alternatives
            </h2>
            <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b-2 border-stone-200">
                    <th className="py-4 px-3 text-left font-semibold text-stone-600"></th>
                    <th className="py-4 px-3 text-center font-semibold text-stone-600">You Do It</th>
                    <th className="py-4 px-3 text-center font-semibold text-stone-600">Hire Someone</th>
                    <th className="py-4 px-3 text-center font-bold text-blue-600 bg-blue-50 rounded-t-xl">BookFox</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {[
                    ["Response Time", "2-4 hours", "10-30 min", "60 seconds"],
                    ["Cost/Month", "Lost jobs", "$3k-5k", "$299"],
                    ["Works 24/7", "❌", "❌", "✓"],
                    ["Never Misses", "❌", "Sometimes", "✓"],
                    ["Setup Time", "N/A", "Weeks", "15 min"],
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-4 px-3 font-medium text-stone-700">{row[0]}</td>
                      <td className="py-4 px-3 text-center text-stone-500">{row[1]}</td>
                      <td className="py-4 px-3 text-center text-stone-500">{row[2]}</td>
                      <td className="py-4 px-3 text-center font-semibold text-blue-600 bg-blue-50">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-8">
              <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                Start Free Trial
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* GUARANTEE / PRICING */}
      <Section id="pricing">
        <div className="max-w-4xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-8">
              Try BookFox <span className="text-emerald-600">Completely Risk-Free</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: "🎁", text: "14-Day Free Trial" },
                { icon: "💳", text: "No Credit Card" },
                { icon: "🚫", text: "Cancel Anytime" },
                { icon: "💰", text: "Money-Back Guarantee" },
              ].map((g, i) => (
                <div key={i} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <span className="text-2xl mb-2 block">{g.icon}</span>
                  <p className="text-stone-700 font-semibold text-sm">{g.text}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-600 max-w-xl mx-auto text-center mb-8 text-lg">
              If BookFox doesn't book you at least <span className="font-bold text-stone-800">one extra job</span> in your first month, we'll refund you 100%. No questions asked.
            </p>
            <div className="text-center">
              <Link to="/signup" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/30 active:scale-[0.98]">
                Start Your Free Trial — Zero Risk
              </Link>
            </div>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="max-w-2xl mx-auto relative z-10">
          <Card glass>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-8">
              Common <span className="text-blue-600">Questions</span>
            </h2>
            <FAQItem q="Will customers know it's AI?" a="Nope. It sounds completely natural. Over 90% of customers have no idea they're talking to AI." />
            <FAQItem q="What if it makes a mistake?" a="You review everything before it goes live. Plus it automatically escalates to you if it's ever unsure how to respond." />
            <FAQItem q="Is it hard to set up?" a="Not at all! We do a 15-minute call together where we set everything up. You'll be live the same day." />
            <FAQItem q="What if I want to cancel?" a="One-click cancel anytime. No contracts, no cancellation fees, no hassle." />
            <FAQItem q="How much after the trial?" a="$299/month. One extra job pays for 10+ months of BookFox." />
            <FAQItem q="Does it work with my calendar?" a="Yes! Google Calendar, Outlook, Apple Calendar — whatever you use, we integrate with it." />
          </Card>
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="pb-0">
        <div className="max-w-6xl mx-auto relative z-10">
          <Card className="bg-gradient-to-br from-stone-900 to-stone-800 border-0 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Start Capturing <span className="text-blue-400">Every Lead</span> Today
            </h2>
            <p className="text-stone-400 mb-8 text-lg">Join 50+ contractors who never miss another lead</p>
            <Link to="/signup" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-500 transition shadow-xl shadow-blue-500/40 active:scale-[0.98]">
              Start Free 14-Day Trial — No Credit Card Required
            </Link>
            <p className="text-stone-500 text-sm mt-6">Setup takes 15 minutes. You'll be responding to leads in under an hour.</p>
            <p className="text-stone-600 text-sm mt-4">Questions? Email <a href="mailto:hello@bookfox.ai" className="text-blue-400 hover:underline">hello@bookfox.ai</a></p>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="relative z-10 py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto">
          <Card glass className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="BookFox" className="w-8 h-8" />
                <span className="font-bold text-stone-800">Book<span className="text-blue-600">Fox</span></span>
              </div>
              <p className="text-stone-500 text-sm">© 2026 BookFox. All rights reserved.</p>
              <div className="flex gap-6 text-stone-500 text-sm">
                <a href="#" className="hover:text-blue-600 transition">Privacy</a>
                <a href="#" className="hover:text-blue-600 transition">Terms</a>
              </div>
            </div>
          </Card>
        </div>
      </footer>
    </div>
  );
}
