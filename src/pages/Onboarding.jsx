import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FadeIn, GlassCard, CTAButton, Progress } from '../components/shared/Animations';

export default function Onboarding() {
  const { user, business, refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get first name from signup
  const firstName = localStorage.getItem('bookfox_firstName') || 'there';

  // Form data
  const [data, setData] = useState({
    companyName: '',
    serviceType: '',
    serviceArea: '',
    phone: '',
    useExistingPhone: true,
    leadSources: [],
    responseTime: 'same_day',
    freeEstimates: 'yes',
    priceMin: 500,
    priceMax: 10000,
    emergencyService: 'business_hours',
    schedule: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '09:00', close: '17:00', enabled: false },
      sunday: { open: '09:00', close: '17:00', enabled: false },
    },
    appointmentDuration: 60,
    bufferTime: 30,
  });

  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const totalSteps = 7;

  const next = () => {
    setError(null);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };
  const back = () => step > 0 && setStep(step - 1);

  // Final save - using direct Supabase instead of Edge Function
  const finish = async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔵 Starting onboarding finish...');
    
    try {
      // Get current user
      console.log('🔵 Getting user...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      console.log('✅ User found:', user.id);

      // Check if user already has a business
      console.log('🔵 Checking for existing business...');
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('business_id, business:businesses(*)')
        .eq('user_id', user.id)
        .single();

      if (existingMember?.business) {
        console.log('✅ User already has business:', existingMember.business_id);
        console.log('🔵 Refreshing business data...');
        await refreshBusiness();
        console.log('✅ Business refreshed');
        localStorage.removeItem('bookfox_firstName');
        console.log('🔵 Navigating to dashboard...');
        navigate('/dashboard');
        return;
      }

      console.log('🔵 Creating new business...');
      // Create the business (RLS allows authenticated users to insert)
      const { data: newBusiness, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: data.companyName.trim(),
          trade_type: data.serviceType || null,
          business_hours: data.schedule,
        })
        .select()
        .single();

      if (bizError) {
        console.error('❌ Business creation error:', bizError);
        throw new Error(`Failed to create business: ${bizError.message}`);
      }
      console.log('✅ Business created:', newBusiness.id);

      // Create team member link
      console.log('🔵 Creating team member link...');
      const { error: teamError } = await supabase
        .from('team_members')
        .insert({
          user_id: user.id,
          business_id: newBusiness.id,
          role: 'owner',
        });

      if (teamError) {
        console.error('❌ Team member error:', teamError);
        // Try to clean up
        await supabase.from('businesses').delete().eq('id', newBusiness.id);
        throw new Error(`Failed to link to business: ${teamError.message}`);
      }
      console.log('✅ Team member created');

      console.log('🔵 Refreshing business data...');
      await refreshBusiness();
      console.log('✅ Business refreshed');
      
      localStorage.removeItem('bookfox_firstName');
      
      console.log('🔵 Navigating to dashboard...');
      navigate('/dashboard');
      console.log('✅ Navigation called');
    } catch (err) {
      console.error('❌ Save error:', err);
      setError(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      console.log('🔵 Setting loading to false');
      setLoading(false);
    }
  };

  // STEP 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        
        <GlassCard className="max-w-xl w-full p-8 lg:p-12 relative z-10">
          <FadeIn delay={0}>
            <div className="relative w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/30">
              <img src="/logo.png" alt="BookFox" className="w-16 h-16 lg:w-20 lg:h-20" />
              <div className="absolute inset-0 bg-primary-400/30 rounded-2xl blur-xl scale-150" />
            </div>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3 text-center">
              Welcome to <span className="text-primary-600">BookFox</span>, {firstName}!
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-slate-600 text-lg mb-8 text-center">
              We're going to get you set up in about <span className="text-primary-600 font-semibold">10 minutes</span>. Here's what we'll do:
            </p>
          </FadeIn>
          
          <div className="space-y-3 text-left mb-8">
            {[
              { icon: '🔗', text: 'Connect your lead sources', time: '3 min' },
              { icon: '💼', text: 'Teach BookFox about your business', time: '5 min' },
              { icon: '✅', text: 'See it respond to a test lead', time: '2 min' },
            ].map((item, i) => (
              <FadeIn key={i} delay={300 + i * 100}>
                <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                  <span className="text-slate-400 text-sm font-medium">{item.time}</span>
                </div>
              </FadeIn>
            ))}
          </div>
          
          <FadeIn delay={600}>
            <CTAButton onClick={next}>
              Let's Get Started
            </CTAButton>
          </FadeIn>
        </GlassCard>
      </div>
    );
  }

  // STEP 1: Business Basics
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={1} total={6} />
          
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
              Tell Us About Your <span className="text-primary-600">Business</span>
            </h2>
            <p className="text-slate-600 mb-8">
              Just the basics — takes <span className="text-primary-600 font-semibold">60 seconds</span>.
            </p>
          </FadeIn>

          <GlassCard className="p-6 lg:p-8">
            <div className="space-y-6">
              <FadeIn delay={100}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={data.companyName}
                    onChange={(e) => update('companyName', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Acme Plumbing"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">What service do you provide?</label>
                  <select
                    value={data.serviceType}
                    onChange={(e) => update('serviceType', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  >
                    <option value="">Select a service...</option>
                    <option value="hvac">HVAC</option>
                    <option value="roofing">Roofing</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="solar">Solar Installation</option>
                    <option value="general">General Contracting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </FadeIn>

              <FadeIn delay={300}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">What area do you serve?</label>
                  <input
                    type="text"
                    value={data.serviceArea}
                    onChange={(e) => update('serviceArea', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="Salt Lake County"
                  />
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button 
                  onClick={back} 
                  className="sm:w-auto px-6 py-3 text-slate-600 font-semibold hover:bg-white/80 rounded-xl transition-all border border-slate-200"
                >
                  Back
                </button>
                <CTAButton
                  onClick={next}
                  disabled={!data.companyName || !data.serviceType}
                  className="flex-1"
                >
                  Next
                </CTAButton>
              </div>
            </FadeIn>
          </GlassCard>
        </div>
      </div>
    );
  }

  // STEP 2: Phone Number
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        <div className="absolute top-20 left-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={2} total={6} />
          
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Your Business <span className="text-primary-600">Phone Number</span></h2>
            <p className="text-slate-600 mb-8">BookFox will text leads from this number.</p>
          </FadeIn>

          <GlassCard className="p-6 lg:p-8">

            <div className="space-y-4 mb-6">
              <FadeIn delay={100}>
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    data.useExistingPhone ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                  onClick={() => update('useExistingPhone', true)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    data.useExistingPhone ? 'border-primary-500' : 'border-slate-300'
                  }`}>
                    {data.useExistingPhone && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Use my existing number</p>
                    <p className="text-sm text-slate-600">Free — works with your current business line</p>
                  </div>
                </label>
              </FadeIn>

              <FadeIn delay={200}>
                <label 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    !data.useExistingPhone ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-slate-300 bg-white/60'
                  }`}
                  onClick={() => update('useExistingPhone', false)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    !data.useExistingPhone ? 'border-primary-500' : 'border-slate-300'
                  }`}>
                    {!data.useExistingPhone && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Get a new local number from BookFox</p>
                    <p className="text-sm text-slate-600">+$15/month — separate line for leads</p>
                  </div>
                </label>
              </FadeIn>
            </div>

            {data.useExistingPhone && (
              <FadeIn delay={300}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Your Phone Number</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="w-full px-4 py-3.5 bg-white/60 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </FadeIn>
            )}

            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={back} className="sm:w-auto px-6 py-3 text-slate-600 font-semibold hover:bg-white/80 rounded-xl transition-all border border-slate-200">Back</button>
                <CTAButton onClick={next} className="flex-1">
                  Next
                </CTAButton>
              </div>
            </FadeIn>
          </GlassCard>
        </div>
      </div>
    );
  }

  // STEP 3: Lead Sources
  if (step === 3) {
    const sources = [
      { id: 'website', label: 'Website contact form', icon: '🌐' },
      { id: 'facebook', label: 'Facebook/Instagram messages', icon: '📘' },
      { id: 'google', label: 'Google Business messages', icon: '🔍' },
      { id: 'missed_calls', label: 'Missed phone calls', icon: '📞' },
      { id: 'email', label: 'Email leads', icon: '📧' },
      { id: 'yelp', label: 'Yelp messages', icon: '⭐' },
      { id: 'homeadvisor', label: 'HomeAdvisor/Angi', icon: '🏠' },
    ];

    const toggle = (id) => {
      const current = data.leadSources;
      if (current.includes(id)) {
        update('leadSources', current.filter(s => s !== id));
      } else {
        update('leadSources', [...current, id]);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={3} total={6} />
          
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Where Do Your <span className="text-purple-600">Leads</span> Come From?</h2>
            <p className="text-slate-600 mb-6">Check all that apply. We'll help you connect them.</p>
          </FadeIn>

          <GlassCard className="p-6 lg:p-8">
            <div className="space-y-2">
              {sources.map((s, i) => (
                <FadeIn key={s.id} delay={100 + i * 50}>
                  <button
                    onClick={() => toggle(s.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                      data.leadSources.includes(s.id) 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-slate-200 hover:border-slate-300 bg-white/60'
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-semibold text-slate-700 flex-1">{s.label}</span>
                    {data.leadSources.includes(s.id) && (
                      <span className="w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">✓</span>
                    )}
                  </button>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={500}>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button onClick={back} className="sm:w-auto px-6 py-3 text-slate-600 font-semibold hover:bg-white/80 rounded-xl transition-all border border-slate-200">Back</button>
                <CTAButton onClick={next} className="flex-1">
                  Next
                </CTAButton>
              </div>
            </FadeIn>

            <FadeIn delay={600}>
              <button onClick={next} className="w-full text-slate-400 text-sm mt-4 hover:text-slate-600 font-medium transition-colors">
                I'll do this later →
              </button>
            </FadeIn>
          </GlassCard>
        </div>
      </div>
    );
  }

  // STEP 4: Business Questions
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
        
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={4} total={6} />
          
          <FadeIn>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">How Should <span className="text-primary-600">BookFox</span> Talk To Leads?</h2>
            <p className="text-slate-600 mb-6">Quick questions so BookFox knows what to say.</p>
          </FadeIn>

          <GlassCard className="p-6 lg:p-8">
            <div className="space-y-6">
            {/* Response Time */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Typical response time for quotes?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'same_day', label: 'Same day' },
                  { value: '24_hours', label: 'Within 24 hours' },
                  { value: '2_3_days', label: '2-3 days' },
                  { value: 'depends', label: 'Depends' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('responseTime', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                      data.responseTime === o.value 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Estimates */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Free estimates?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'yes', label: 'Yes, always' },
                  { value: 'sometimes', label: 'Sometimes' },
                  { value: 'no', label: 'No' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('freeEstimates', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                      data.freeEstimates === o.value 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Service */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Emergency service available?</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: '24_7', label: 'Yes, 24/7 emergency service' },
                  { value: 'business_hours', label: 'Yes, during business hours only' },
                  { value: 'no', label: 'No, appointments only' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('emergencyService', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition ${
                      data.emergencyService === o.value 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={back} className="sm:w-auto px-6 py-3 text-slate-600 font-semibold hover:bg-white/80 rounded-xl transition-all border border-slate-200">Back</button>
              <CTAButton onClick={next} className="flex-1">
                Next
              </CTAButton>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // STEP 5: Availability
  if (step === 5) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

    const toggleDay = (day) => {
      const newSchedule = { ...data.schedule };
      newSchedule[day].enabled = !newSchedule[day].enabled;
      update('schedule', newSchedule);
    };

    const copyToAll = () => {
      const mon = data.schedule.monday;
      const newSchedule = { ...data.schedule };
      days.forEach(d => {
        if (d !== 'saturday' && d !== 'sunday') {
          newSchedule[d] = { ...mon };
        }
      });
      update('schedule', newSchedule);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={5} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">When Can You Take <span className="text-green-600">Jobs</span>?</h2>
          <p className="text-stone-500 mb-6">BookFox will only book during these times.</p>

          <div className="space-y-2 mb-6">
            {days.map(day => (
              <div 
                key={day}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  data.schedule[day].enabled ? 'border-primary-200 bg-primary-50' : 'border-stone-200 bg-stone-50'
                }`}
              >
                <button
                  onClick={() => toggleDay(day)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    data.schedule[day].enabled ? 'bg-primary-500 border-primary-500 text-white' : 'border-stone-300'
                  }`}
                >
                  {data.schedule[day].enabled && '✓'}
                </button>
                <span className="w-10 font-medium text-stone-700">{dayLabels[day]}</span>
                {data.schedule[day].enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={data.schedule[day].open}
                      onChange={(e) => {
                        const newSchedule = { ...data.schedule };
                        newSchedule[day].open = e.target.value;
                        update('schedule', newSchedule);
                      }}
                      className="px-2 py-1 border border-stone-300 rounded-lg text-sm"
                    />
                    <span className="text-stone-400">to</span>
                    <input
                      type="time"
                      value={data.schedule[day].close}
                      onChange={(e) => {
                        const newSchedule = { ...data.schedule };
                        newSchedule[day].close = e.target.value;
                        update('schedule', newSchedule);
                      }}
                      className="px-2 py-1 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-stone-400 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>

          <button onClick={copyToAll} className="text-primary-600 text-sm font-medium mb-6 hover:underline">
            Copy Monday to all weekdays
          </button>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Appointment length</label>
              <select
                value={data.appointmentDuration}
                onChange={(e) => update('appointmentDuration', Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
              >
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Buffer between</label>
              <select
                value={data.bufferTime}
                onChange={(e) => update('bufferTime', Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
              >
                <option value={0}>None</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button onClick={next} className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 6: Test & Finish
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50/30 to-slate-50 p-6 relative overflow-hidden">
        <div className="max-w-2xl mx-auto pt-8 relative z-10">
          <Progress step={6} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">You're <span className="text-green-600">All Set</span>! Let's <span className="text-primary-600">Test It</span>.</h2>
          <p className="text-stone-500 mb-6">Here's how BookFox will respond to leads:</p>

          {/* Conversation Preview */}
          <div className="bg-stone-100 rounded-2xl p-4 mb-6">
            <p className="text-xs text-stone-500 text-center mb-3">Sample Conversation</p>
            <div className="space-y-3">
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"Hey, my AC isn't working"</p>
              </div>
              <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Hi! I can help with that. I'm with {data.companyName || 'your company'}. Is this an emergency or can it wait until tomorrow?</p>
              </div>
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"Pretty urgent, it's really hot"</p>
              </div>
              <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Got it. I have availability today at 2pm or 4pm. Which works better?</p>
              </div>
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"2pm works"</p>
              </div>
              <div className="bg-primary-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Perfect! You're booked for 2pm. I'll send a reminder. See you then! 🙂</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-green-800">Your customers won't know it's AI</p>
                <p className="text-sm text-green-700">Natural language • Books appointments • Works 24/7</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button
              onClick={finish}
              disabled={loading}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Go To Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
