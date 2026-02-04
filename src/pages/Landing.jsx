import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Logo, LogoLight } from '../components/Logo';
import { AnimateOnScroll, AnimatedCounter, FadeIn } from '../components/Animations';

// Animated counter component
function AnimatedNumber({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

// Feature card component
function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <AnimateOnScroll animation="fade-up">
      <div 
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 h-full"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 shadow-lg shadow-blue-500/20">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-stone-800 mb-2 sm:mb-3">{title}</h3>
        <p className="text-stone-600 leading-relaxed text-sm sm:text-base">{description}</p>
      </div>
    </AnimateOnScroll>
  );
}

// Testimonial card
function TestimonialCard({ quote, name, business, image }) {
  return (
    <AnimateOnScroll animation="fade-up">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-100 h-full">
        <div className="flex gap-1 mb-3 sm:mb-4">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-amber-400 text-sm sm:text-base">★</span>
          ))}
        </div>
        <p className="text-stone-700 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg shadow-blue-500/20 flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-stone-800 truncate">{name}</p>
            <p className="text-stone-500 text-sm truncate">{business}</p>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

// Pricing card
function PricingCard({ name, price, description, features, popular = false, cta = "Start Free Trial" }) {
  return (
    <AnimateOnScroll animation="scale">
      <div className={`rounded-2xl p-6 sm:p-8 h-full flex flex-col ${popular ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-500/30 sm:scale-105' : 'bg-white border border-stone-200'}`}>
        {popular && (
          <span className="inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-4 self-start">
            MOST POPULAR
          </span>
        )}
        <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${popular ? 'text-white' : 'text-stone-800'}`}>{name}</h3>
        <p className={`mb-4 text-sm sm:text-base ${popular ? 'text-blue-100' : 'text-stone-500'}`}>{description}</p>
        <div className="mb-4 sm:mb-6">
          <span className={`text-4xl sm:text-5xl font-bold ${popular ? 'text-white' : 'text-stone-800'}`}>${price}</span>
          <span className={`text-sm sm:text-base ${popular ? 'text-blue-100' : 'text-stone-500'}`}>/month</span>
        </div>
        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 sm:gap-3">
              <span className={`text-base sm:text-lg flex-shrink-0 ${popular ? 'text-blue-200' : 'text-blue-500'}`}>✓</span>
              <span className={`text-sm sm:text-base ${popular ? 'text-blue-50' : 'text-stone-600'}`}>{feature}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/signup"
          className={`block w-full py-3 px-4 rounded-xl font-semibold text-center transition-all active:scale-[0.98] ${
            popular 
              ? 'bg-white text-blue-600 hover:bg-blue-50 active:bg-blue-100' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-500/20'
          }`}
        >
          {cta}
        </Link>
      </div>
    </AnimateOnScroll>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/">
              <Logo size="md" />
            </Link>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-stone-600 hover:text-stone-800 transition">Features</a>
              <a href="#pricing" className="text-stone-600 hover:text-stone-800 transition">Pricing</a>
              <a href="#testimonials" className="text-stone-600 hover:text-stone-800 transition">Reviews</a>
              <Link to="/login" className="text-stone-600 hover:text-stone-800 transition">Sign In</Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden bg-white border-t border-stone-200 overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 px-4 space-y-1">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 active:bg-stone-100 rounded-xl transition-colors">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 active:bg-stone-100 rounded-xl transition-colors">Pricing</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 active:bg-stone-100 rounded-xl transition-colors">Reviews</a>
            <Link to="/login" className="block py-3 px-4 text-stone-600 hover:bg-stone-50 active:bg-stone-100 rounded-xl transition-colors">Sign In</Link>
            <Link to="/signup" className="block bg-blue-600 text-white py-3 px-4 rounded-xl font-medium text-center hover:bg-blue-700 active:bg-blue-800 transition-colors mt-2">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-powered lead qualification
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-stone-800 mb-4 sm:mb-6 leading-[1.1]">
              Never Miss a
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400"> Lead </span>
              Again
            </h1>
            
            <p className="text-base sm:text-xl text-stone-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              BookFox answers your missed calls instantly via SMS, qualifies leads with AI, 
              and books appointments — so you can focus on the job, not the phone.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Free 14-Day Trial
              </Link>
              <a 
                href="#demo" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-stone-700 font-medium hover:text-blue-600 active:text-blue-700 transition px-6 sm:px-8 py-3.5 sm:py-4"
              >
                <span className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                Watch Demo
              </a>
            </div>

            <p className="text-stone-500 text-sm">
              No credit card required • Setup in 5 minutes • Cancel anytime
            </p>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-w-5xl mx-auto">
              <div className="bg-stone-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-lg px-4 py-1 text-sm text-stone-500">bookfox.ai/dashboard</div>
                </div>
              </div>
              <div className="p-6 bg-gradient-to-br from-stone-50 to-blue-50">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Leads Today', value: '12', trend: '+23%', color: 'blue' },
                    { label: 'Calls Caught', value: '8', trend: '+15%', color: 'green' },
                    { label: 'Booked', value: '5', trend: '+40%', color: 'amber' },
                    { label: 'Response Rate', value: '94%', trend: '+5%', color: 'purple' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-stone-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
                      <p className="text-green-600 text-sm font-medium">{stat.trend}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm h-48"></div>
                  <div className="bg-white rounded-xl p-4 shadow-sm h-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600"><AnimatedNumber target={2500} suffix="+" /></p>
              <p className="text-stone-600 mt-1">Trade Businesses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600"><AnimatedNumber target={50000} suffix="+" /></p>
              <p className="text-stone-600 mt-1">Leads Captured</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600"><AnimatedNumber target={98} suffix="%" /></p>
              <p className="text-stone-600 mt-1">Response Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600"><AnimatedNumber target={4.9} suffix="/5" duration={1500} /></p>
              <p className="text-stone-600 mt-1">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Every missed call is a missed opportunity
            </h2>
            <p className="text-xl text-stone-300 mb-8 leading-relaxed">
              You're on a job. The phone rings. You can't answer. That customer calls your competitor instead.
            </p>
            <div className="space-y-4">
              {[
                '85% of callers won\'t leave a voicemail',
                '75% won\'t call back if you don\'t answer',
                'Average missed call costs trade businesses $200-500',
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-400">✕</span>
                  </div>
                  <span className="text-stone-300">{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
              Everything you need to capture every lead
            </h2>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              BookFox works 24/7 so you don't have to. Here's how it turns missed calls into booked jobs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="📱"
              title="Instant SMS Response"
              description="Within seconds of a missed call, BookFox texts your customer automatically. No more lost leads while you're on a job."
              delay={0}
            />
            <FeatureCard
              icon="🤖"
              title="AI Lead Qualification"
              description="Our AI asks the right questions — service needed, urgency, property type — so you know exactly what you're walking into."
              delay={100}
            />
            <FeatureCard
              icon="📅"
              title="Auto-Booking"
              description="Customers can book directly into your calendar. BookFox knows your availability and handles the scheduling."
              delay={200}
            />
            <FeatureCard
              icon="💬"
              title="Smart Conversations"
              description="The AI maintains natural conversations, answers common questions, and knows when to hand off to you."
              delay={300}
            />
            <FeatureCard
              icon="📊"
              title="Lead Dashboard"
              description="See all your leads in one place. Track status, view conversations, and never let a lead slip through the cracks."
              delay={400}
            />
            <FeatureCard
              icon="🔔"
              title="Instant Notifications"
              description="Get notified immediately for hot leads or urgent jobs. Stay in control while the AI handles the rest."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
              How BookFox Works
            </h2>
            <p className="text-xl text-stone-600">Setup takes 5 minutes. Then it just works.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Customer Calls', desc: 'They call your business but you\'re busy on a job' },
              { step: '2', title: 'Instant Text', desc: 'BookFox texts them within seconds of the missed call' },
              { step: '3', title: 'AI Qualifies', desc: 'Our AI asks smart questions and captures lead details' },
              { step: '4', title: 'Job Booked', desc: 'Customer books an appointment or you get notified to follow up' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
              Trusted by trade pros everywhere
            </h2>
            <p className="text-xl text-stone-600">Don't just take our word for it</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="BookFox paid for itself in the first week. I booked 3 jobs that I would have completely missed before."
              name="Mike Johnson"
              business="Johnson Plumbing Co."
            />
            <TestimonialCard
              quote="I used to lose 5-10 calls a day. Now every single one gets followed up automatically. Game changer."
              name="Sarah Martinez"
              business="Cool Air HVAC"
            />
            <TestimonialCard
              quote="The AI is scary good. It asks better questions than my old receptionist did. Customers love the quick response."
              name="Dave Thompson"
              business="Thompson Electric"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-stone-600">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            <PricingCard
              name="Starter"
              price="49"
              description="Perfect for solo operators"
              features={[
                'Up to 100 leads/month',
                'AI SMS responses',
                'Basic lead qualification',
                'Email notifications',
                'Mobile app access',
              ]}
            />
            <PricingCard
              name="Professional"
              price="99"
              description="For growing businesses"
              popular={true}
              features={[
                'Unlimited leads',
                'AI SMS + voice responses',
                'Advanced qualification',
                'Calendar integration',
                'Priority support',
                'Custom AI training',
              ]}
            />
            <PricingCard
              name="Enterprise"
              price="199"
              description="For multi-truck operations"
              features={[
                'Everything in Pro',
                'Multiple phone numbers',
                'Team management',
                'API access',
                'Dedicated account manager',
                'Custom integrations',
              ]}
              cta="Contact Sales"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to stop losing leads?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join 2,500+ trade businesses already using BookFox to capture more customers.
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-xl"
          >
            Start Your Free 14-Day Trial
          </Link>
          <p className="text-blue-200 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <LogoLight size="md" />
              </div>
              <p className="text-sm">
                AI-powered receptionist for trade businesses. Never miss a lead again.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 BookFox. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
