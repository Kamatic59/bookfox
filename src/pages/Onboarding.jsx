import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FadeIn, OrganicCard, MagneticButton, Progress } from '../components/shared/Animations';

export default function Onboarding() {
  const { refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const firstName = localStorage.getItem('bookfox_firstName') || 'User';

  const [data, setData] = useState({
    companyName: '',
    serviceType: '',
    aiName: 'Alex',
    aiTone: 'friendly',
    schedule: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '09:00', close: '17:00', enabled: false },
      sunday: { open: '09:00', close: '17:00', enabled: false },
    },
  });

  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const totalSteps = 5; // Welcome, Basics, Personalization, Hours, Test

  const next = () => {
    setError(null);
    if (step < totalSteps - 1) setStep(step + 1);
  };
  const back = () => step > 0 && setStep(step - 1);

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existingMember } = await supabase
        .from('team_members')
        .select('business_id, business:businesses(*)')
        .eq('user_id', user.id)
        .single();

      if (existingMember?.business) {
        await refreshBusiness();
        localStorage.removeItem('bookfox_firstName');
        navigate('/dashboard');
        return;
      }

      // We technically just need name, trade_type, business_hours for DB
      const { data: newBusiness, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: data.companyName.trim() || 'My Business',
          trade_type: data.serviceType || 'general',
          business_hours: data.schedule
          // Note for future: we can add settings JSONB column to save aiName and aiTone
        })
        .select()
        .single();

      if (bizError) throw new Error(`Business creation failed: ${bizError.message}`);

      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          user_id: user.id,
          business_id: newBusiness.id,
          role: 'owner',
        });

      if (teamError) {
        await supabase.from('businesses').delete().eq('id', newBusiness.id);
        throw new Error(`Linking failed: ${teamError.message}`);
      }

      await refreshBusiness();
      localStorage.removeItem('bookfox_firstName');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getChatPreview = () => {
    const aiIntroMap = {
      professional: `Hello, I serve as the virtual receptionist for ${data.companyName}. How may I assist you with your ${data.serviceType || 'home'} needs today?`,
      friendly: `Hi there! 👋 I'm ${data.aiName}, the assistant for ${data.companyName}. How can we help get your ${data.serviceType || 'project'} sorted out today?`,
      direct: `Hi, ${data.companyName} assistant here. What's the issue?`
    };

    const aiResponseMap = {
      professional: `I understand. I have an opening available tomorrow morning to schedule a proper assessment. Shall I book that for you?`,
      friendly: `Oh no, so sorry to hear that! 😔 We can definitely help. I've got a spot tomorrow morning to get one of our techs out there. Does that time work?`,
      direct: `Got it. We can have someone there tomorrow morning. Sound good?`
    };

    return [
      { sender: 'user', text: "Hey, I need a quote for some work, it's pretty urgent." },
      { sender: 'ai', text: aiIntroMap[data.aiTone] || aiIntroMap.friendly },
      { sender: 'user', text: "My system completely broke down." },
      { sender: 'ai', text: aiResponseMap[data.aiTone] || aiResponseMap.friendly },
      { sender: 'user', text: "Yes, book it!" },
      { sender: 'system', text: "✅ APPOINTMENT BOOKED SECURELY" }
    ];
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Background glow effects matching Login/Signup */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2E4036]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#CC5833]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">

        {/* Header Logo */}
        <FadeIn delay={0}>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3">
              <img src="/logo.png" alt="BookFox" className="w-12 h-12" />
              <span className="text-2xl font-bold font-['Cormorant_Garamond'] italic text-[#1A1A1A]">Book<span className="text-[#CC5833]">Fox</span></span>
            </div>
          </div>
        </FadeIn>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <FadeIn delay={100}>
            <OrganicCard className="p-8 lg:p-12 text-center">
              <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-[#2E4036] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#2E4036]/20">
                <img src="/logo.png" alt="BookFox" className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-md brightness-0 invert" />
                <div className="absolute inset-0 bg-[#2E4036]/30 rounded-[2rem] blur-xl scale-150 -z-10" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3 text-center font-['Plus_Jakarta_Sans']">
                Welcome to <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">BookFox</span>, {firstName}!
              </h1>

              <p className="text-[#2E4036]/80 text-lg mb-8 text-center max-w-lg mx-auto font-['Outfit']">
                Your 24/7 AI Receptionist is almost ready. Let's customize it for your business in just <span className="text-[#CC5833] font-semibold">3 simple steps</span>.
              </p>

              <div className="space-y-3 text-left mb-10 max-w-md mx-auto">
                {[
                  { icon: '🏢', text: 'Business Basics' },
                  { icon: '🤖', text: 'AI Personalization' },
                  { icon: '📅', text: 'Bookable Hours' },
                ].map((item, i) => (
                  <FadeIn key={i} delay={300 + i * 100}>
                    <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-[#2E4036]/10 shadow-sm">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[#1A1A1A] font-medium text-lg font-['Plus_Jakarta_Sans']">{item.text}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <MagneticButton onClick={next} className="w-full sm:w-80 mx-auto">
                Customize My AI →
              </MagneticButton>
            </OrganicCard>
          </FadeIn>
        )}

        {/* STEP 1: Business Basics */}
        {step === 1 && (
          <FadeIn>
            <Progress step={1} total={4} />
            <OrganicCard className="p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">
                Your <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Business Setup</span>
              </h2>
              <p className="text-[#2E4036]/70 mb-8 font-medium">What are we answering the phone for?</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Company Name</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => update('companyName', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition-all shadow-sm"
                    placeholder="e.g. Apex Plumbing"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Trade / Service</label>
                  <select
                    value={data.serviceType}
                    onChange={(e) => update('serviceType', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition-all shadow-sm appearance-none"
                  >
                    <option value="" disabled>Select your trade...</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="hvac">HVAC</option>
                    <option value="electrical">Electrical</option>
                    <option value="roofing">Roofing</option>
                    <option value="general">General Contracting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <MagneticButton secondary onClick={back} className="sm:w-auto px-6">
                  Back
                </MagneticButton>
                <MagneticButton onClick={next} disabled={!data.companyName || !data.serviceType} className="flex-1">
                  Continue
                </MagneticButton>
              </div>
            </OrganicCard>
          </FadeIn>
        )}

        {/* STEP 2: AI Assistant Setup */}
        {step === 2 && (
          <FadeIn>
            <Progress step={2} total={4} />
            <OrganicCard className="p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">
                Personalize Your <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">AI Receptionist</span>
              </h2>
              <p className="text-[#2E4036]/70 mb-8 font-medium">Give your AI a name and personality to match your brand.</p>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">AI Receptionist Name</label>
                  <input
                    type="text"
                    value={data.aiName}
                    onChange={(e) => update('aiName', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#CC5833] focus:border-[#CC5833] outline-none transition-all shadow-sm"
                    placeholder="e.g. Sarah, Mike, BotFox"
                  />
                  <p className="text-xs text-[#2E4036]/60 mt-2 font-['IBM_Plex_Mono']">Example: "Hi, I'm {data.aiName} from {data.companyName || 'your company'}!"</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-3 font-['Plus_Jakarta_Sans']">AI Personality Tone</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'professional', label: 'Professional', desc: 'Formal, polite, standard business' },
                      { id: 'friendly', label: 'Friendly', desc: 'Warm, empathetic, uses emojis' },
                      { id: 'direct', label: 'Direct', desc: 'Straight to the point, minimal fluff' }
                    ].map(tone => (
                      <button
                        key={tone.id}
                        onClick={() => update('aiTone', tone.id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all ${data.aiTone === tone.id
                          ? 'border-[#CC5833] bg-[#CC5833]/5 shadow-[0_4px_12px_rgba(204,88,51,0.1)] transform -translate-y-1'
                          : 'border-[#2E4036]/10 hover:border-[#CC5833]/50 bg-white/60 hover:shadow-sm'
                          }`}
                      >
                        <h3 className={`font-bold mb-1 ${data.aiTone === tone.id ? 'text-[#CC5833]' : 'text-[#1A1A1A]'}`}>
                          {tone.label}
                        </h3>
                        <p className="text-xs text-[#2E4036]/60 leading-snug">{tone.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <MagneticButton secondary onClick={back} className="sm:w-auto px-6">
                  Back
                </MagneticButton>
                <MagneticButton onClick={next} disabled={!data.aiName} className="flex-1">
                  Continue
                </MagneticButton>
              </div>
            </OrganicCard>
          </FadeIn>
        )}

        {/* STEP 3: Availability */}
        {step === 3 && (
          <FadeIn>
            <Progress step={3} total={4} />
            <OrganicCard className="p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">
                Bookable <span className="text-[#2E4036] font-['Cormorant_Garamond'] italic">Hours</span>
              </h2>
              <p className="text-[#2E4036]/70 mb-8 font-medium">When should {data.aiName} schedule jobs for your team?</p>

              <div className="space-y-3 mb-6">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div
                    key={day}
                    className={`flex items-center gap-3 p-3 lg:p-4 rounded-2xl border transition-all ${data.schedule[day].enabled ? 'border-[#2E4036]/20 bg-white shadow-[0_2px_8px_rgba(46,64,54,0.05)]' : 'border-[#2E4036]/10 bg-[#2E4036]/5 opacity-70'
                      }`}
                  >
                    {/* Toggle */}
                    <button
                      onClick={() => {
                        const newSched = { ...data.schedule };
                        newSched[day].enabled = !newSched[day].enabled;
                        update('schedule', newSched);
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${data.schedule[day].enabled ? 'bg-[#CC5833]' : 'bg-[#2E4036]/20'}`}
                    >
                      <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${data.schedule[day].enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>

                    <span className="w-12 font-semibold text-[#1A1A1A] uppercase text-sm font-['IBM_Plex_Mono'] tracking-tight">{day.substring(0, 3)}</span>

                    {data.schedule[day].enabled ? (
                      <div className="flex items-center gap-2 flex-1 justify-end sm:justify-start">
                        <input
                          type="time"
                          value={data.schedule[day].open}
                          onChange={(e) => {
                            const newSched = { ...data.schedule };
                            newSched[day].open = e.target.value;
                            update('schedule', newSched);
                          }}
                          className="px-2 lg:px-3 py-1.5 border border-[#2E4036]/20 rounded-lg text-sm bg-white/80 focus:ring-1 focus:ring-[#CC5833] outline-none font-medium text-[#1A1A1A]"
                        />
                        <span className="text-[#2E4036]/50 text-xs font-semibold font-['IBM_Plex_Mono']">TO</span>
                        <input
                          type="time"
                          value={data.schedule[day].close}
                          onChange={(e) => {
                            const newSched = { ...data.schedule };
                            newSched[day].close = e.target.value;
                            update('schedule', newSched);
                          }}
                          className="px-2 lg:px-3 py-1.5 border border-[#2E4036]/20 rounded-lg text-sm bg-white/80 focus:ring-1 focus:ring-[#CC5833] outline-none font-medium text-[#1A1A1A]"
                        />
                      </div>
                    ) : (
                      <span className="text-[#2E4036]/50 text-sm font-semibold flex-1 text-right sm:text-left font-['IBM_Plex_Mono']">OFFLINE</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  const mon = data.schedule.monday;
                  const newSched = { ...data.schedule };
                  ['tuesday', 'wednesday', 'thursday', 'friday'].forEach(d => newSched[d] = { ...mon });
                  update('schedule', newSched);
                }}
                className="text-[#CC5833] text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                Sync Monday to all weekdays
              </button>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <MagneticButton secondary onClick={back} className="sm:w-auto px-6">
                  Back
                </MagneticButton>
                <MagneticButton onClick={next} className="flex-1">Continue</MagneticButton>
              </div>
            </OrganicCard>
          </FadeIn>
        )}

        {/* STEP 4: Test & Finish */}
        {step === 4 && (
          <FadeIn>
            <Progress step={4} total={4} />
            <OrganicCard className="p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">
                System <span className="text-[#CC5833] font-['Cormorant_Garamond'] italic">Active</span>
              </h2>
              <p className="text-[#2E4036]/70 mb-8 font-medium">Test out <strong>{data.aiName}</strong> before launching!</p>

              {/* Dynamic Chat Simulation */}
              <div className="bg-[#2E4036] border border-[#2E4036] rounded-3xl p-4 lg:p-6 mb-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
                <div className="relative z-10">
                  <p className="text-xs font-bold text-[#F2F0E9]/50 uppercase tracking-wider text-center mb-4 border-b border-[#F2F0E9]/10 pb-2 font-['IBM_Plex_Mono']">
                    Simulation: {data.aiTone} Tone
                  </p>
                  <div className="space-y-4">
                    {getChatPreview().map((msg, idx) => (
                      <FadeIn key={idx} delay={idx * 200}>
                        {msg.sender === 'user' && (
                          <div className="flex justify-start">
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 text-[#F2F0E9] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] shadow-sm">
                              <span className="text-xs font-bold text-[#F2F0E9]/50 block mb-1 font-['IBM_Plex_Mono']">Customer</span>
                              <span className="text-sm font-['Outfit']">{msg.text}</span>
                            </div>
                          </div>
                        )}

                        {msg.sender === 'ai' && (
                          <div className="flex justify-end">
                            <div className="bg-[#CC5833] text-[#F2F0E9] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-[0_4px_12px_rgba(204,88,51,0.3)]">
                              <span className="text-xs font-bold text-[#F2F0E9]/80 block mb-1 font-['IBM_Plex_Mono']">{data.aiName}</span>
                              <span className="text-sm shadow-sm font-['Outfit']">{msg.text}</span>
                            </div>
                          </div>
                        )}

                        {msg.sender === 'system' && (
                          <div className="flex justify-center mt-6">
                            <div className="inline-flex items-center gap-2 bg-[#F2F0E9] text-[#2E4036] border border-[#2E4036]/20 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm font-['IBM_Plex_Mono']">
                              <span className="w-2 h-2 rounded-full bg-[#CC5833] animate-pulse" />
                              {msg.text}
                            </div>
                          </div>
                        )}
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-[#CC5833]/10 border border-[#CC5833]/20 text-[#CC5833] p-4 rounded-xl text-sm font-medium mb-6 font-['Outfit']">
                  Error: {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton secondary onClick={back} className="sm:w-auto px-6">
                  Back
                </MagneticButton>
                <MagneticButton onClick={finish} loading={loading} className="flex-1 text-lg">
                  {loading ? 'Booting System...' : 'Launch BookFox'}
                </MagneticButton>
              </div>
            </OrganicCard>
          </FadeIn>
        )}

      </div>
    </div>
  );
}
