import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Animation wrapper - fades in on scroll
function FadeIn({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Glass Card component
function GlassCard({ children, className = '', glow = false }) {
  return (
    <div className={`
      relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 
      shadow-[0_8px_32px_rgba(0,0,0,0.08)] 
      ${glow ? 'shadow-[0_0_40px_rgba(37,99,235,0.15)]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}

// FAQ Accordion with smooth animation
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/50 last:border-0">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full py-5 flex justify-between items-center text-left gap-4 group"
      >
        <span className="font-semibold text-slate-800 text-lg group-hover:text-primary-700 transition-colors">{q}</span>
        <span className={`
          w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
          text-white flex items-center justify-center text-xl font-bold
          transition-all duration-300 shadow-lg shadow-primary-600/25
          ${open ? 'rotate-45 scale-110' : 'group-hover:scale-110'}
        `}>+</span>
      </button>
      <div className={`
        overflow-hidden transition-all duration-500 ease-out
        ${open ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}
      `}>
        <p className="text-slate-600 text-lg leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// Glowing CTA Button
function CTAButton({ children, className = '', full = true }) {
  return (
    <Link 
      to="/signup" 
      className={`
        relative block overflow-hidden
        bg-gradient-to-r from-orange-500 to-orange-600 
        hover:from-orange-400 hover:to-orange-500
        text-white font-bold text-xl px-8 py-5 rounded-2xl text-center 
        transition-all duration-300 active:scale-[0.98]
        shadow-[0_8px_32px_rgba(249,115,22,0.4)]
        hover:shadow-[0_12px_48px_rgba(249,115,22,0.5)]
        hover:-translate-y-0.5
        ${full ? 'w-full' : ''} 
        ${className}
      `}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      <span className="relative">{children}</span>
    </Link>
  );
}

// Feature Card with hover glow
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div className="
        group bg-white/60 backdrop-blur-lg rounded-2xl p-6 
        border border-white/50 
        shadow-[0_4px_24px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_40px_rgba(37,99,235,0.15)]
        hover:border-primary-200/50
        hover:-translate-y-1
        transition-all duration-300
      ">
        <div className="flex items-start gap-4">
          <span className="
            text-3xl p-3 rounded-xl 
            bg-gradient-to-br from-slate-100 to-slate-50
            group-hover:from-primary-100 group-hover:to-primary-50
            transition-colors duration-300
          ">{icon}</span>
          <div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary-800 transition-colors">{title}</h3>
            <p className="text-slate-600 mt-1">{desc}</p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// Step item for How It Works
function StepItem({ num, text, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <li className="flex items-start gap-4 group">
        <span className="
          flex-shrink-0 w-12 h-12 
          bg-gradient-to-br from-primary-500 to-primary-700 
          rounded-full flex items-center justify-center font-bold text-lg text-white
          shadow-lg shadow-primary-600/30
          group-hover:scale-110 group-hover:shadow-primary-600/50
          transition-all duration-300
        ">{num}</span>
        <span className="pt-3 text-lg text-primary-100 group-hover:text-white transition-colors">{text}</span>
      </li>
    </FadeIn>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 text-slate-800 overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-200/30 to-primary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary-200/30 to-purple-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-primary-100/20 to-cyan-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* ==================== */}
      {/* SECTION 1: HERO */}
      {/* ==================== */}
      <section className="relative min-h-[100svh] flex flex-col justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto w-full relative z-10">
          
          {/* Logo */}
          <FadeIn delay={0}>
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <img src="/logo.png" alt="BookFox" className="w-16 h-16 lg:w-20 lg:h-20 relative z-10" />
                <div className="absolute inset-0 bg-primary-400/30 rounded-full blur-xl scale-150" />
              </div>
              <span className="text-3xl lg:text-4xl font-bold">Book<span className="text-primary-600">Fox</span></span>
            </div>
          </FadeIn>
          
          {/* Headline */}
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Never Miss Another{' '}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">Job Call</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-orange-200/60 -z-10 rounded" />
              </span>
              {' '}Again
            </h1>
          </FadeIn>
          
          {/* Subheadline */}
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed">
              BookFox answers calls and books jobs for trade businesses — <span className="font-semibold text-slate-800">24/7</span>.
            </p>
          </FadeIn>
          
          {/* CTA */}
          <FadeIn delay={300}>
            <CTAButton>See It In Action</CTAButton>
          </FadeIn>
          
          {/* Micro-trust */}
          <FadeIn delay={400}>
            <p className="text-slate-400 text-sm text-center mt-5 flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                Takes 2 minutes
              </span>
              <span>•</span>
              <span>No obligation</span>
            </p>
          </FadeIn>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-slate-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 2: PAIN */}
      {/* ==================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <GlassCard className="p-8 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
                Missed Calls = <span className="text-orange-500">Lost Jobs</span>
              </h2>
              
              <ul className="space-y-4 text-lg text-slate-700">
                {[
                  "Customers call the next contractor",
                  "After-hours leads go cold",
                  "You're stuck answering the phone",
                  "Hiring help is expensive",
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 100}>
                    <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50/50 transition-colors">
                      <span className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  </FadeIn>
                ))}
              </ul>
              
              <FadeIn delay={500}>
                <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                  <p className="text-lg text-slate-700">
                    Miss 5 calls a week? That's{' '}
                    <span className="font-bold text-red-600 text-xl">$2,000–5,000/month</span>{' '}
                    gone.
                  </p>
                </div>
              </FadeIn>
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 3: WHAT BOOKFOX DOES */}
      {/* ==================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-10 text-center">
              What <span className="text-primary-700">BookFox</span> Does
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <FeatureCard icon="📞" title="Answers Every Call" desc="Even nights and weekends." delay={100} />
            <FeatureCard icon="📅" title="Books Jobs Automatically" desc="Sends you confirmed, qualified leads." delay={200} />
            <FeatureCard icon="🚫" title="Filters Bad Calls" desc="No tire-kickers or spam." delay={300} />
            <FeatureCard icon="💰" title="Costs Less Than Hiring" desc="No payroll. No sick days." delay={400} />
          </div>
          
          <FadeIn delay={500}>
            <div className="mt-10">
              <CTAButton>See It In Action</CTAButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 4: HOW IT WORKS */}
      {/* ==================== */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 text-center">
              How It <span className="text-primary-500">Works</span>
            </h2>
          </FadeIn>
          
          <ol className="space-y-6">
            <StepItem num="1" text="Customer calls your business" delay={100} />
            <StepItem num="2" text="BookFox answers instantly" delay={200} />
            <StepItem num="3" text="Asks smart questions" delay={300} />
            <StepItem num="4" text="Books the job or sends you the lead" delay={400} />
          </ol>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 5: PRICING */}
      {/* ==================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-4 text-center">
              Simple, <span className="text-primary-700">Transparent</span> Pricing
            </h2>
          </FadeIn>
          
          <FadeIn delay={100}>
            <p className="text-lg sm:text-xl text-slate-600 mb-12 text-center max-w-2xl mx-auto">
              Start small or go all-in. Every plan includes a 14-day free trial.
            </p>
          </FadeIn>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <FadeIn delay={100}>
              <GlassCard className="p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Starter</h3>
                  <p className="text-slate-500 text-sm">Perfect for trying it out</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-slate-900">$99</span>
                    <span className="text-xl text-slate-500">/mo</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span><strong>200 calls/month</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>AI SMS assistant</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>Lead capture & tracking</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>Email support</span>
                  </li>
                </ul>
                
                <Link 
                  to="/signup" 
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 rounded-xl text-center transition-all duration-300 active:scale-95"
                >
                  Start Free Trial
                </Link>
              </GlassCard>
            </FadeIn>
            
            {/* PRO (Most Popular) */}
            <FadeIn delay={200}>
              <div className="relative">
                {/* Most Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/30">
                    🔥 MOST POPULAR
                  </div>
                </div>
                
                <GlassCard className="p-8 border-orange-300 shadow-[0_8px_40px_rgba(249,115,22,0.2)] hover:shadow-[0_12px_48px_rgba(249,115,22,0.3)] transition-all duration-300 transform hover:scale-105">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                    <p className="text-slate-600 text-sm">Everything you need to scale</p>
                  </div>
                  
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">$299</span>
                      <span className="text-xl text-slate-500">/mo</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-slate-700">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs">✓</span>
                      </span>
                      <span><strong>Unlimited calls & SMS</strong></span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs">✓</span>
                      </span>
                      <span><strong>AI voice + SMS assistant</strong></span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs">✓</span>
                      </span>
                      <span>Advanced AI qualification</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs">✓</span>
                      </span>
                      <span>Calendar integrations</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs">✓</span>
                      </span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                  
                  <Link 
                    to="/signup" 
                    className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-center transition-all duration-300 active:scale-95 shadow-lg shadow-orange-500/30"
                  >
                    Start Free Trial
                  </Link>
                </GlassCard>
              </div>
            </FadeIn>
            
            {/* ENTERPRISE */}
            <FadeIn delay={300}>
              <GlassCard className="p-8 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Enterprise</h3>
                  <p className="text-slate-500 text-sm">For growing businesses</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-slate-900">Custom</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Let's talk pricing</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span><strong>Everything in Pro</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>Multi-location support</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>API access</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700">
                    <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-xs">✓</span>
                    </span>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                
                <a 
                  href="mailto:hello@bookfox.ai" 
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-4 rounded-xl text-center transition-all duration-300 active:scale-95"
                >
                  Contact Sales
                </a>
              </GlassCard>
            </FadeIn>
          </div>
          
          {/* ROI Note */}
          <FadeIn delay={400}>
            <div className="mt-12 text-center">
              <p className="text-lg text-slate-600 mb-2">
                Most trade jobs are worth <strong className="text-slate-800">$200–$1,000+</strong>
              </p>
              <p className="text-slate-500">
                Just 1 extra booked job per week pays for BookFox
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 6: WHO IT'S FOR */}
      {/* ==================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-10 text-center">
              Is BookFox <span className="text-primary-600">Right For You?</span>
            </h2>
          </FadeIn>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Great for */}
            <FadeIn delay={100}>
              <GlassCard className="p-6 border-primary-200/50 hover:shadow-[0_8px_40px_rgba(37,99,235,0.1)] transition-shadow">
                <h3 className="font-bold text-primary-700 text-lg mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">✓</span>
                  Great for:
                </h3>
                <ul className="space-y-3 text-lg text-slate-700">
                  {["Plumbers", "HVAC", "Electricians", "Contractors"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-primary-600 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </FadeIn>
            
            {/* Not for */}
            <FadeIn delay={200}>
              <GlassCard className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-slate-500 text-lg mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">✕</span>
                  Not for:
                </h3>
                <ul className="space-y-3 text-lg text-slate-500">
                  {["One-off handyman gigs", "No steady calls"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 7: FAQ */}
      {/* ==================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-10 text-center">
              Questions
            </h2>
          </FadeIn>
          
          <FadeIn delay={100}>
            <GlassCard className="p-6 sm:p-8">
              <FAQ 
                q="Does it sound robotic?" 
                a="No. Customers can't tell it's AI. It sounds natural and friendly." 
              />
              <FAQ 
                q="Can I customize it?" 
                a="Yes. Tell it your services, hours, and how to handle calls." 
              />
              <FAQ 
                q="What if it makes a mistake?" 
                a="It confirms details before booking. If unsure, it sends you the lead." 
              />
              <FAQ 
                q="How fast can I start?" 
                a="15 minutes. We set it up together. Live same day." 
              />
              <FAQ 
                q="What's the cost?" 
                a="Plans start at $99/mo. Most businesses choose Pro at $299/mo. All plans include a 14-day free trial. Cancel anytime." 
              />
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 8: FINAL CTA */}
      {/* ==================== */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary-900 via-slate-900 to-slate-900 text-white overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Every Missed Call Is a <span className="text-orange-400">Lost Job</span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={100}>
            <p className="text-lg sm:text-xl text-slate-400 mb-10">
              Your competitors answer their phones. Do you?
            </p>
          </FadeIn>
          
          <FadeIn delay={200}>
            <CTAButton className="shadow-[0_8px_48px_rgba(249,115,22,0.5)]">
              See It In Action
            </CTAButton>
          </FadeIn>
          
          <FadeIn delay={300}>
            <p className="text-slate-500 text-sm mt-6 flex items-center justify-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-orange-400 rounded-full" />
                Free trial
              </span>
              <span>•</span>
              <span>No credit card</span>
              <span>•</span>
              <span>15 min setup</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* FOOTER */}
      {/* ==================== */}
      <footer className="relative py-10 px-6 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
            </div>
            <span className="font-bold text-xl">Book<span className="text-primary-600">Fox</span></span>
          </div>
          <p className="text-slate-400 text-sm mb-3">© 2026 BookFox</p>
          <div className="flex justify-center gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* ==================== */}
      {/* STICKY MOBILE CTA */}
      {/* ==================== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 z-50 lg:hidden">
        <Link 
          to="/signup" 
          className="
            block w-full py-4 rounded-2xl text-center font-bold text-xl text-white
            bg-gradient-to-r from-orange-500 to-orange-600
            shadow-[0_4px_24px_rgba(249,115,22,0.4)]
            active:scale-[0.98] transition-transform
          "
        >
          Get Demo
        </Link>
      </div>
      
      {/* Spacer for sticky CTA */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}
/* Force rebuild Mon Feb  9 19:39:41 UTC 2026 */
