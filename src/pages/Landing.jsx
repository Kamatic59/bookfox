import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn, OrganicCard, MagneticButton } from '../components/shared/Animations';

// FAQ Accordion with soft organic styling
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#2E4036]/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex justify-between items-center text-left gap-4 group"
      >
        <span className="font-semibold text-[#1A1A1A] text-lg group-hover:text-[#CC5833] transition-colors font-['Plus_Jakarta_Sans']">{q}</span>
        <span className={`
          w-8 h-8 rounded-full bg-[#2E4036] 
          text-[#F2F0E9] flex items-center justify-center text-xl font-bold
          transition-all duration-300 shadow-md shadow-[#2E4036]/20
          ${open ? 'rotate-45 scale-110 bg-[#CC5833]' : 'group-hover:scale-110 group-hover:bg-[#CC5833]'}
        `}>+</span>
      </button>
      <div className={`
        overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
        ${open ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'}
      `}>
        <p className="text-[#2E4036]/80 text-lg leading-relaxed font-['Outfit']">{a}</p>
      </div>
    </div>
  );
}

// Feature Card with hover glow
function FeatureCard({ icon, title, desc, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <OrganicCard className="p-6 hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-start gap-4">
          <span className="
            text-3xl p-3 rounded-2xl 
            bg-[#CC5833]/10 text-[#CC5833]
          ">{icon}</span>
          <div>
            <h3 className="font-bold text-[#1A1A1A] text-lg font-['Plus_Jakarta_Sans']">{title}</h3>
            <p className="text-[#2E4036]/70 mt-1 font-['Outfit']">{desc}</p>
          </div>
        </div>
      </OrganicCard>
    </FadeIn>
  );
}



export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[#1A1A1A] overflow-hidden font-sans">

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2E4036]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#CC5833]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      </div>

      {/* Urgency Banner */}
      <div className="sticky top-0 z-50 bg-[#2E4036] text-[#F2F0E9] text-center py-3 text-sm font-medium shadow-md font-['Plus_Jakarta_Sans']">
        🔥 Launch Special: First 50 customers lock in $199/mo forever •
        <strong className="text-[#CC5833] ml-1">37 spots left</strong> •
        <Link to="/signup" className="underline ml-1 hover:text-white transition-colors">Claim yours →</Link>
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
                <div className="absolute inset-0 bg-[#2E4036]/10 rounded-full blur-xl scale-150" />
              </div>
              <span className="text-3xl lg:text-4xl font-bold font-['Cormorant_Garamond'] italic text-[#1A1A1A]">Book<span className="text-[#CC5833]">Fox</span></span>
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#1A1A1A] leading-tight mb-6 font-['Plus_Jakarta_Sans']">
              Never Miss Another{' '}
              <span className="relative inline-block mt-2 sm:mt-0">
                <span className="relative z-10 text-[#CC5833] font-['Cormorant_Garamond'] italic pr-2">Job Call</span>
                <span className="absolute bottom-1 left-0 right-0 h-4 bg-[#CC5833]/20 -z-10 rounded-sm" />
              </span>
              {' '}Again
            </h1>
          </FadeIn>

          {/* Subheadline */}
          <FadeIn delay={200}>
            <p className="text-lg sm:text-xl lg:text-2xl text-[#2E4036]/80 mb-10 leading-relaxed font-['Outfit'] font-medium">
              BookFox answers calls and books jobs for trade businesses — <span className="font-bold text-[#1A1A1A]">24/7</span>.
            </p>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={300}>
            <Link to="/signup">
              <MagneticButton className="w-full sm:w-auto text-xl py-5 px-10">Start Free 14-Day Trial →</MagneticButton>
            </Link>
          </FadeIn>

          {/* Micro-trust */}
          <FadeIn delay={400}>
            <p className="text-[#2E4036]/60 text-sm mt-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 font-bold font-['IBM_Plex_Mono']">
              <span className="flex items-center gap-1.5"><span className="text-[#CC5833]">✓</span> NO CREDIT CARD REQUIRED</span>
              <span className="hidden sm:inline text-[#2E4036]/30">•</span>
              <span className="flex items-center gap-1.5"><span className="text-[#CC5833]">✓</span> SETUP IN 10 MINUTES</span>
              <span className="hidden sm:inline text-[#2E4036]/30">•</span>
              <span className="flex items-center gap-1.5"><span className="text-[#CC5833]">✓</span> CANCEL ANYTIME</span>
            </p>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={500}>
            <div className="flex items-center justify-start gap-4 text-[#2E4036]/80 text-sm mt-12 bg-white/40 backdrop-blur-sm rounded-full py-2 px-6 shadow-sm inline-flex w-fit border border-[#2E4036]/10">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#F2F0E9] bg-gradient-to-br from-[#2E4036] to-[#141e19] shadow-sm opacity-${100 - (i * 10)}`} />
                ))}
              </div>
              <div className="flex flex-col text-left font-['Plus_Jakarta_Sans'] font-medium">
                <span>Join <strong className="text-[#CC5833]">127+ businesses</strong> using BookFox</span>
                <span className="text-xs text-[#2E4036]/60">★★★★★ 4.9/5 from customers</span>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-[#2E4036]/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-[#2E4036]/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 2: PAIN */}
      {/* ==================== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <OrganicCard className="p-8 sm:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-overlay" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-10 font-['Plus_Jakarta_Sans']">
                  Missed Calls = <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Lost Jobs</span>
                </h2>

                <ul className="space-y-5 text-lg sm:text-xl text-[#2E4036]/80 font-['Outfit'] font-medium">
                  {[
                    "Customers call the next contractor",
                    "After-hours leads go cold",
                    "You're stuck answering the phone",
                    "Hiring a human dispatcher is expensive",
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 100}>
                      <li className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#CC5833]/5 transition-colors border border-transparent hover:border-[#CC5833]/10">
                        <span className="w-3 h-3 bg-[#CC5833] rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    </FadeIn>
                  ))}
                </ul>

                <FadeIn delay={500}>
                  <div className="mt-10 p-6 bg-[#CC5833]/10 rounded-2xl border border-[#CC5833]/20">
                    <p className="text-xl text-[#2E4036] font-['Plus_Jakarta_Sans']">
                      Miss 5 calls a week? That's{' '}
                      <span className="font-bold text-[#CC5833] text-2xl font-['IBM_Plex_Mono'] tracking-tight">$2,000–5,000/mo</span>{' '}
                      gone.
                    </p>
                  </div>
                </FadeIn>
              </div>
            </OrganicCard>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 3: HOW IT WORKS */}
      {/* ==================== */}
      <section className="relative py-24 px-6 bg-[#2E4036] text-[#F2F0E9] overflow-hidden">
        {/* Organic Texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#CC5833]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#1A1A1A]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center font-['Plus_Jakarta_Sans']">
              How It <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Works</span>
            </h2>
            <p className="text-[#F2F0E9]/80 text-xl text-center mb-16 max-w-2xl mx-auto font-['Outfit']">
              Never miss another job. BookFox handles calls 24/7 and books appointments automatically.
            </p>
          </FadeIn>

          {/* Steps with benefits */}
          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-[#CC5833] rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 font-['IBM_Plex_Mono'] text-white">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-['Plus_Jakarta_Sans']">Customer calls</h3>
                    <p className="text-[#F2F0E9]/70 text-lg font-['Outfit']">You're busy on a job or it's after hours - BookFox answers instantly.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-[#CC5833] rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 font-['IBM_Plex_Mono'] text-white">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-['Plus_Jakarta_Sans']">AI qualifies the lead</h3>
                    <p className="text-[#F2F0E9]/70 text-lg font-['Outfit']">Asks about the problem, urgency, location - just like you would.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-[#CC5833] rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 font-['IBM_Plex_Mono'] text-white">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-['Plus_Jakarta_Sans']">Books appointment</h3>
                    <p className="text-[#F2F0E9]/70 text-lg font-['Outfit']">Checks your calendar and schedules the job - confirmed and ready.</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-[#CC5833] rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 font-['IBM_Plex_Mono'] text-white">
                    4
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 font-['Plus_Jakarta_Sans']">You show up & get paid</h3>
                    <p className="text-[#F2F0E9]/70 text-lg font-['Outfit']">No tire-kickers, no spam calls - just qualified jobs that make money.</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={500}>
            <div className="mt-16 flex justify-center">
              <Link to="/signup">
                <MagneticButton secondary className="text-xl py-4 px-10">Start Free Trial</MagneticButton>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 4: PRICING */}
      {/* ==================== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4 text-center font-['Plus_Jakarta_Sans']">
              Simple, <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Transparent</span> Pricing
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-lg sm:text-xl text-[#2E4036]/70 mb-16 text-center max-w-2xl mx-auto font-['Outfit'] font-medium">
              Start small or go all-in. Every plan includes a 14-day free trial.
            </p>
          </FadeIn>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* STARTER */}
            <FadeIn delay={100}>
              <OrganicCard className="p-8 hover:shadow-xl transition-all duration-300 border border-[#2E4036]/10 h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Starter</h3>
                  <p className="text-[#2E4036]/60 text-sm font-['IBM_Plex_Mono']">Perfect for trying it out</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#1A1A1A]">$199</span>
                    <span className="text-xl text-[#2E4036]/60">/mo</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span><strong>200 calls/month</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>AI SMS assistant</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>Lead capture & tracking</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>Email support</span>
                  </li>
                </ul>

                <Link to="/signup" className="mt-auto block">
                  <MagneticButton secondary className="w-full">Start Free Trial</MagneticButton>
                </Link>
              </OrganicCard>
            </FadeIn>

            {/* PRO (Most Popular) */}
            <FadeIn delay={200}>
              <OrganicCard glow className="p-8 transition-all duration-300 md:transform md:-translate-y-4 z-10 h-full flex flex-col">
                {/* Most Popular Badge */}
                <div className="mb-4 md:absolute md:-top-4 md:left-1/2 md:-translate-x-1/2 md:mb-0 flex justify-center">
                  <div className="bg-[#CC5833] text-[#F2F0E9] px-6 py-2 rounded-full text-sm font-bold shadow-[0_4px_12px_rgba(204,88,51,0.3)] font-['IBM_Plex_Mono'] border border-[#CC5833]/20">
                    MOST POPULAR
                  </div>
                </div>
                <div className="text-center mb-6 mt-4 md:mt-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Pro</h3>
                  <p className="text-[#CC5833] font-medium text-sm font-['IBM_Plex_Mono']">Everything you need to scale</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#CC5833]">$349</span>
                    <span className="text-xl text-[#2E4036]/60">/mo</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-start gap-3 text-[#1A1A1A] font-['Outfit']">
                    <span className="w-5 h-5 bg-[#CC5833]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#CC5833]/30">
                      <span className="text-[#CC5833] text-xs font-bold">✓</span>
                    </span>
                    <span><strong>Unlimited calls & SMS</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-[#1A1A1A] font-['Outfit']">
                    <span className="w-5 h-5 bg-[#CC5833]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#CC5833]/30">
                      <span className="text-[#CC5833] text-xs font-bold">✓</span>
                    </span>
                    <span><strong>AI voice + SMS assistant</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#CC5833]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#CC5833] text-xs font-bold">✓</span>
                    </span>
                    <span>Advanced AI qualification</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#CC5833]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#CC5833] text-xs font-bold">✓</span>
                    </span>
                    <span>Calendar integrations</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#CC5833]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#CC5833] text-xs font-bold">✓</span>
                    </span>
                    <span>Priority support</span>
                  </li>
                </ul>

                <Link to="/signup" className="mt-auto block">
                  <MagneticButton className="w-full">Start Free Trial</MagneticButton>
                </Link>
              </OrganicCard>
            </FadeIn>

            {/* ENTERPRISE */}
            <FadeIn delay={300}>
              <OrganicCard className="p-8 hover:shadow-xl transition-all duration-300 border border-[#2E4036]/10 h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Enterprise</h3>
                  <p className="text-[#2E4036]/60 text-sm font-['IBM_Plex_Mono']">For growing businesses</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#1A1A1A]">$599</span>
                    <span className="text-xl text-[#2E4036]/60">/mo</span>
                  </div>
                  <p className="text-sm text-[#CC5833] mt-2 font-bold font-['IBM_Plex_Mono'] uppercase">Unlimited power</p>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span><strong>Everything in Pro</strong></span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>Multi-location support</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>Custom AI training</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>API access</span>
                  </li>
                  <li className="flex items-start gap-3 text-[#2E4036]/80 font-['Outfit']">
                    <span className="w-5 h-5 bg-[#2E4036]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#2E4036] text-xs font-bold">✓</span>
                    </span>
                    <span>Dedicated account manager</span>
                  </li>
                </ul>

                <a href="mailto:hello@bookfox.ai" className="mt-auto block">
                  <MagneticButton secondary className="w-full">
                    Contact Sales
                  </MagneticButton>
                </a>
              </OrganicCard>
            </FadeIn>
          </div>

          {/* Money-Back Guarantee */}
          <FadeIn delay={400}>
            <div className="bg-[#2E4036] border-2 border-[#2E4036] rounded-[2rem] p-8 mt-16 max-w-3xl mx-auto flex items-start sm:items-center gap-6 shadow-[0_8px_32px_rgba(46,64,54,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
              <div className="text-5xl relative z-10 drop-shadow-md border border-[#F2F0E9]/20 p-3 rounded-2xl bg-white/10 backdrop-blur-sm">🛡️</div>
              <div className="relative z-10">
                <h3 className="font-bold text-[#F2F0E9] text-xl mb-2 font-['Plus_Jakarta_Sans']">
                  60-Day Money-Back Guarantee
                </h3>
                <p className="text-[#F2F0E9]/80 text-base sm:text-lg font-['Outfit']">
                  If BookFox doesn't catch at least 1 extra job in your first month,
                  we'll refund 100% of your money. <span className="text-[#CC5833] font-bold">No questions asked</span>.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 5: WHO IT'S FOR */}
      {/* ==================== */}
      <section className="relative py-24 px-6 bg-[#2E4036]/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-12 text-center font-['Plus_Jakarta_Sans']">
              Is BookFox <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Right For You?</span>
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Great for */}
            <FadeIn delay={100}>
              <OrganicCard className="p-8 border-[#2E4036]/20 shadow-[0_4px_16px_rgba(46,64,54,0.05)] h-full">
                <h3 className="font-bold text-[#2E4036] text-xl mb-6 flex items-center gap-3 font-['Plus_Jakarta_Sans']">
                  <span className="w-10 h-10 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center text-[#2E4036]">✓</span>
                  Great for:
                </h3>
                <ul className="space-y-4 text-lg text-[#1A1A1A] font-medium font-['Outfit']">
                  {["Plumbers", "HVAC", "Electricians", "Contractors"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <span className="w-2 h-2 bg-[#CC5833] rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OrganicCard>
            </FadeIn>

            {/* Not for */}
            <FadeIn delay={200}>
              <OrganicCard className="p-8 border-[#2E4036]/5 bg-white/40 h-full">
                <h3 className="font-bold text-[#2E4036]/50 text-xl mb-6 flex items-center gap-3 font-['Plus_Jakarta_Sans']">
                  <span className="w-10 h-10 bg-white/80 rounded-2xl flex items-center justify-center border border-[#2E4036]/10">✕</span>
                  Not for:
                </h3>
                <ul className="space-y-4 text-lg text-[#2E4036]/60 font-medium font-['Outfit']">
                  {["One-off handyman gigs", "No steady calls"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <span className="w-2 h-2 bg-[#2E4036]/30 rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OrganicCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 6: FAQ */}
      {/* ==================== */}
      <section className="relative py-24 px-6">
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-12 text-center font-['Plus_Jakarta_Sans']">
              Questions
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <OrganicCard className="p-6 sm:p-10">
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
            </OrganicCard>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 7: FINAL CTA */}
      {/* ==================== */}
      <section className="relative py-24 px-6 bg-[#2E4036] text-[#F2F0E9] overflow-hidden">
        {/* Organic Texture */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CC5833]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-['Plus_Jakarta_Sans']">
              Every Missed Call Is a <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Lost Job</span>
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <p className="text-xl lg:text-2xl text-[#F2F0E9]/80 mb-12 font-['Outfit']">
              Your competitors answer their phones. Do you?
            </p>
          </FadeIn>

          <FadeIn delay={200}>
            <Link to="/signup" className="inline-block">
              <MagneticButton className="px-12 py-5 text-xl">
                Start Free Trial →
              </MagneticButton>
            </Link>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-[#F2F0E9]/50 text-sm mt-8 flex items-center justify-center gap-4 flex-wrap font-bold font-['IBM_Plex_Mono']">
              <span className="flex items-center gap-2">
                <span className="text-[#CC5833]">✓</span>
                FREE TRIAL
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="text-[#CC5833]">✓</span>
                NO CREDIT CARD
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="text-[#CC5833]">✓</span>
                15 MIN SETUP
              </span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ==================== */}
      {/* FOOTER */}
      {/* ==================== */}
      <footer className="relative py-12 px-6 bg-[var(--color-cream)] border-t border-[#2E4036]/10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10 drop-shadow-sm" />
            </div>
            <span className="font-bold text-2xl font-['Cormorant_Garamond'] italic text-[#1A1A1A]">Book<span className="text-[#CC5833]">Fox</span></span>
          </div>
          <p className="text-[#2E4036]/50 text-sm mb-4 font-['IBM_Plex_Mono']">© 2026 BookFox</p>
          <div className="flex justify-center gap-6 text-[#2E4036]/70 text-sm font-semibold font-['Plus_Jakarta_Sans']">
            <a href="#" className="hover:text-[#CC5833] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#CC5833] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
/* Force rebuild Mon Feb  9 19:39:41 UTC 2026 */
