import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FadeIn, OrganicCard } from '../components/shared/Animations';

// Settings section component
function SettingsSection({ title, description, children, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <OrganicCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2E4036]/10">
          <h3 className="text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{title}</h3>
          {description && <p className="text-[#2E4036]/60 text-sm mt-1 font-['Outfit']">{description}</p>}
        </div>
        <div className="p-6">{children}</div>
      </OrganicCard>
    </FadeIn>
  );
}

// Input field component
function InputField({ label, type = 'text', value, onChange, placeholder, helpText, disabled, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40 outline-none transition-all disabled:bg-[#F2F0E9] disabled:text-[#2E4036]/50 font-['Outfit'] ${error ? 'border-[#CC5833]/40' : 'border-[#2E4036]/20'
          }`}
      />
      {helpText && <p className="text-[#2E4036]/50 text-xs mt-2 font-['IBM_Plex_Mono']">{helpText}</p>}
      {error && <p className="text-[#CC5833] text-xs mt-2 font-['Outfit']">{error}</p>}
    </div>
  );
}

// Textarea component
function TextArea({ label, value, onChange, placeholder, helpText, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40 outline-none transition-all resize-none font-['Outfit']"
      />
      {helpText && <p className="text-[#2E4036]/50 text-xs mt-2 font-['IBM_Plex_Mono']">{helpText}</p>}
    </div>
  );
}

// Toggle switch component
function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{label}</p>
        {description && <p className="text-[#2E4036]/60 text-sm mt-1 font-['Outfit']">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[#2E4036]' : 'bg-[#2E4036]/20'
          }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const { business, user, refreshBusiness } = useAuth();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('twilio');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Twilio settings
  const [twilioPhone, setTwilioPhone] = useState('');
  const [twilioConfigured, setTwilioConfigured] = useState(false);

  // Business settings
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    auto_respond: true,
    assistant_name: 'BookFox',
    services_offered: [],
    pricing_notes: '',
    qualification_questions: [],
    response_delay_seconds: 30,
    max_messages_before_human: 10,
  });

  // Service input
  const [newService, setNewService] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // Load business settings
  useEffect(() => {
    if (business) {
      setBusinessName(business.name || '');
      setBusinessEmail(business.email || '');
      setBusinessAddress(business.address_line1 || '');
      setTwilioPhone(business.twilio_phone || '');
      setTwilioConfigured(!!business.twilio_phone);
    }
  }, [business]);

  // Load AI settings
  useEffect(() => {
    async function loadAiSettings() {
      if (!business?.id) return;

      const { data, error } = await supabase
        .from('ai_settings')
        .select('*')
        .eq('business_id', business.id)
        .single();

      if (data && !error) {
        setAiSettings({
          auto_respond: data.auto_respond ?? true,
          assistant_name: data.assistant_name || 'BookFox',
          services_offered: data.services_offered || [],
          pricing_notes: data.pricing_notes || '',
          qualification_questions: data.qualification_questions || [],
          response_delay_seconds: data.response_delay_seconds || 30,
          max_messages_before_human: data.max_messages_before_human || 10,
        });
      } else if (error && error.code === 'PGRST116') {
        await supabase.from('ai_settings').insert({
          business_id: business.id,
          ...aiSettings,
        });
      }
    }
    loadAiSettings();
  }, [business?.id]);

  const handleSaveTwilio = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const phoneRegex = /^\+?[1-9]\d{10,14}$/;
      if (!phoneRegex.test(twilioPhone.replace(/[\s()-]/g, ''))) {
        throw new Error('Invalid phone format. Use: +15551234567');
      }

      const { error } = await supabase
        .from('businesses')
        .update({ twilio_phone: twilioPhone })
        .eq('id', business.id);

      if (error) throw error;

      await refreshBusiness();
      setTwilioConfigured(true);
      setSuccessMessage('Twilio number saved! Configure your Twilio webhooks now.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Failed to save Twilio settings:', error);
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBusinessSettings = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: businessName, email: businessEmail, address_line1: businessAddress })
        .eq('id', business.id);

      if (error) throw error;

      await refreshBusiness();
      setSuccessMessage('Business settings saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAiSettings = async () => {
    setSaving(true);
    setErrorMessage('');
    try {
      const { error } = await supabase
        .from('ai_settings')
        .upsert({ business_id: business.id, ...aiSettings }, { onConflict: 'business_id' });

      if (error) throw error;

      setSuccessMessage('AI settings saved!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save AI settings:', error);
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (newService.trim()) {
      setAiSettings({ ...aiSettings, services_offered: [...aiSettings.services_offered, newService.trim()] });
      setNewService('');
    }
  };

  const removeService = (index) => {
    setAiSettings({ ...aiSettings, services_offered: aiSettings.services_offered.filter((_, i) => i !== index) });
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setAiSettings({ ...aiSettings, qualification_questions: [...aiSettings.qualification_questions, newQuestion.trim()] });
      setNewQuestion('');
    }
  };

  const removeQuestion = (index) => {
    setAiSettings({ ...aiSettings, qualification_questions: aiSettings.qualification_questions.filter((_, i) => i !== index) });
  };

  const tabs = [
    { id: 'twilio', label: 'Phone Setup', icon: '📞' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'business', label: 'Business Info', icon: '🏢' },
  ];

  const webhookUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Settings</h1>
          <p className="text-[#2E4036]/60 mt-1 font-['Outfit']">Configure your AI receptionist</p>
        </div>
      </FadeIn>

      {/* Success Message */}
      {successMessage && (
        <FadeIn delay={100}>
          <div className="mb-6 p-4 bg-[#2E4036]/10 backdrop-blur-sm border border-[#2E4036]/20 text-[#2E4036] rounded-xl flex items-center gap-3 shadow-sm font-['Outfit']">
            <span className="text-xl">✅</span>
            {successMessage}
          </div>
        </FadeIn>
      )}

      {/* Error Message */}
      {errorMessage && (
        <FadeIn delay={100}>
          <div className="mb-6 p-4 bg-[#CC5833]/10 backdrop-blur-sm border border-[#CC5833]/20 text-[#CC5833] rounded-xl flex items-center gap-3 shadow-sm font-['Outfit']">
            <span className="text-xl">⚠️</span>
            {errorMessage}
          </div>
        </FadeIn>
      )}

      {/* Tabs */}
      <FadeIn delay={100}>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all font-['Plus_Jakarta_Sans'] ${activeTab === tab.id
                  ? 'bg-[#2E4036] text-[#F2F0E9]'
                  : 'text-[#2E4036]/60 hover:bg-[#2E4036]/5'
                }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* TWILIO SETUP TAB */}
      {activeTab === 'twilio' && (
        <div className="space-y-6">
          <SettingsSection title="Twilio Phone Number" delay={200} description="Connect your Twilio phone number to receive calls and texts">
            <div className="space-y-6">
              {!twilioConfigured && (
                <div className="bg-[#CC5833]/10 border border-[#CC5833]/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-[#CC5833] font-['Plus_Jakarta_Sans']">Setup Required</p>
                      <p className="text-[#CC5833]/80 text-sm mt-1 font-['Outfit']">
                        You need a Twilio phone number to receive calls. Don't have one yet?{' '}
                        <a href="https://console.twilio.com/us1/develop/phone-numbers/manage/search" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                          Buy one from Twilio ($1-5/month) →
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <InputField
                label="Twilio Phone Number"
                value={twilioPhone}
                onChange={(e) => setTwilioPhone(e.target.value)}
                placeholder="+15551234567"
                helpText="Format: +1 followed by 10 digits (no spaces or dashes)"
              />

              {twilioConfigured && (
                <div className="bg-[#2E4036]/10 border border-[#2E4036]/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-[#2E4036] font-['Plus_Jakarta_Sans']">Phone Number Configured</p>
                      <p className="text-[#2E4036]/70 text-sm mt-1 font-['Outfit']">
                        Now configure your Twilio webhooks to complete setup.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveTwilio}
                disabled={saving || !twilioPhone}
                className="w-full bg-[#2E4036] text-[#F2F0E9] py-3 rounded-full font-semibold hover:bg-[#1A1A1A] transition disabled:opacity-50 disabled:cursor-not-allowed font-['Plus_Jakarta_Sans']"
              >
                {saving ? 'Saving...' : twilioConfigured ? 'Update Phone Number' : 'Save Phone Number'}
              </button>
            </div>
          </SettingsSection>

          {twilioConfigured && (
            <SettingsSection title="Webhook Configuration" delay={300} description="Copy these URLs into your Twilio phone number settings">
              <div className="space-y-4">
                <div className="bg-[#2E4036]/5 rounded-xl p-4 border border-[#2E4036]/10">
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Voice Webhook (When a call comes in)</p>
                  <code className="block bg-white p-3 rounded-lg text-sm text-[#2E4036] font-['IBM_Plex_Mono'] border border-[#2E4036]/10 break-all">
                    {webhookUrl}/twilio-voice
                  </code>
                  <p className="text-xs text-[#2E4036]/50 mt-2 font-['IBM_Plex_Mono']">
                    Set this in: Twilio Console → Phone Numbers → {twilioPhone} → Voice Configuration → "A CALL COMES IN" → Webhook
                  </p>
                </div>

                <div className="bg-[#2E4036]/5 rounded-xl p-4 border border-[#2E4036]/10">
                  <p className="text-sm font-semibold text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">SMS Webhook (When a message comes in)</p>
                  <code className="block bg-white p-3 rounded-lg text-sm text-[#2E4036] font-['IBM_Plex_Mono'] border border-[#2E4036]/10 break-all">
                    {webhookUrl}/twilio-sms
                  </code>
                  <p className="text-xs text-[#2E4036]/50 mt-2 font-['IBM_Plex_Mono']">
                    Set this in: Twilio Console → Phone Numbers → {twilioPhone} → Messaging Configuration → "A MESSAGE COMES IN" → Webhook
                  </p>
                </div>

                <div className="bg-[#2E4036]/10 border border-[#2E4036]/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-semibold text-[#2E4036] font-['Plus_Jakarta_Sans']">Quick Setup Guide</p>
                      <ol className="text-[#2E4036]/70 text-sm mt-2 space-y-1 list-decimal list-inside font-['Outfit']">
                        <li>Go to <a href="https://console.twilio.com/us1/develop/phone-numbers/manage/active" target="_blank" rel="noopener noreferrer" className="underline font-medium">Twilio Console → Active Numbers</a></li>
                        <li>Click your phone number ({twilioPhone})</li>
                        <li>Scroll to "Voice Configuration" → paste Voice Webhook URL</li>
                        <li>Scroll to "Messaging Configuration" → paste SMS Webhook URL</li>
                        <li>Click "Save" at the bottom</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>
          )}
        </div>
      )}

      {/* AI ASSISTANT TAB */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <SettingsSection title="Assistant Identity" delay={200} description="How your AI introduces itself">
            <div className="space-y-4">
              <InputField
                label="Assistant Name"
                value={aiSettings.assistant_name}
                onChange={(e) => setAiSettings({ ...aiSettings, assistant_name: e.target.value })}
                placeholder="BookFox"
                helpText="What should the AI call itself when talking to customers?"
              />

              <Toggle
                enabled={aiSettings.auto_respond}
                onChange={(val) => setAiSettings({ ...aiSettings, auto_respond: val })}
                label="Auto-Respond to Missed Calls"
                description="Automatically text customers when they call and you can't answer"
              />

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Response Delay (seconds)</label>
                <input
                  type="number"
                  value={aiSettings.response_delay_seconds}
                  onChange={(e) => setAiSettings({ ...aiSettings, response_delay_seconds: parseInt(e.target.value) || 30 })}
                  min="0"
                  max="300"
                  className="w-full px-4 py-3 bg-white border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 outline-none font-['Outfit']"
                />
                <p className="text-[#2E4036]/50 text-xs mt-2 font-['IBM_Plex_Mono']">
                  How long to wait before sending the first SMS after a missed call (0-300 seconds)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-['Plus_Jakarta_Sans']">Max Messages Before Human Handoff</label>
                <input
                  type="number"
                  value={aiSettings.max_messages_before_human}
                  onChange={(e) => setAiSettings({ ...aiSettings, max_messages_before_human: parseInt(e.target.value) || 10 })}
                  min="3"
                  max="50"
                  className="w-full px-4 py-3 bg-white border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 outline-none font-['Outfit']"
                />
                <p className="text-[#2E4036]/50 text-xs mt-2 font-['IBM_Plex_Mono']">
                  After this many messages, escalate to a human team member
                </p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Services Offered" delay={300} description="What services do you provide?">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addService()}
                  placeholder="e.g., Water heater repair"
                  className="flex-1 px-4 py-3 bg-white border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 outline-none font-['Outfit']"
                />
                <button
                  onClick={addService}
                  className="px-6 py-3 bg-[#2E4036] text-[#F2F0E9] rounded-full font-semibold hover:bg-[#1A1A1A] transition font-['Plus_Jakarta_Sans']"
                >
                  Add
                </button>
              </div>

              {aiSettings.services_offered.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {aiSettings.services_offered.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#2E4036]/10 text-[#2E4036] rounded-lg">
                      <span className="text-sm font-['Outfit']">{service}</span>
                      <button onClick={() => removeService(index)} className="text-[#CC5833] hover:text-[#CC5833]/80 font-bold">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#2E4036]/50 text-sm italic font-['Outfit']">No services added yet. Add your first service above.</p>
              )}
            </div>
          </SettingsSection>

          <SettingsSection title="Pricing Information" delay={400} description="Help the AI discuss pricing with customers">
            <TextArea
              label="Pricing Notes"
              value={aiSettings.pricing_notes}
              onChange={(e) => setAiSettings({ ...aiSettings, pricing_notes: e.target.value })}
              placeholder="e.g., $150-300 for most jobs, emergency calls add $50, free estimates available"
              helpText="The AI will use this to answer pricing questions (doesn't have to be exact)"
              rows={4}
            />
          </SettingsSection>

          <SettingsSection title="Qualification Questions" delay={500} description="What should the AI ask to qualify leads?">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
                  placeholder="e.g., Is this an emergency?"
                  className="flex-1 px-4 py-3 bg-white border border-[#2E4036]/20 rounded-xl focus:ring-2 focus:ring-[#2E4036]/20 outline-none font-['Outfit']"
                />
                <button
                  onClick={addQuestion}
                  className="px-6 py-3 bg-[#2E4036] text-[#F2F0E9] rounded-full font-semibold hover:bg-[#1A1A1A] transition font-['Plus_Jakarta_Sans']"
                >
                  Add
                </button>
              </div>

              {aiSettings.qualification_questions.length > 0 ? (
                <div className="space-y-2">
                  {aiSettings.qualification_questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 p-3 bg-[#2E4036]/5 rounded-lg border border-[#2E4036]/10">
                      <span className="text-sm text-[#1A1A1A] font-['Outfit']">{question}</span>
                      <button onClick={() => removeQuestion(index)} className="text-[#CC5833] hover:text-[#CC5833]/80 font-bold flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#2E4036]/50 text-sm italic font-['Outfit']">No questions added yet. Add your first question above.</p>
              )}
            </div>
          </SettingsSection>

          <button
            onClick={handleSaveAiSettings}
            disabled={saving}
            className="w-full bg-[#2E4036] text-[#F2F0E9] py-4 rounded-full font-semibold text-lg hover:bg-[#1A1A1A] transition disabled:opacity-50 font-['Plus_Jakarta_Sans']"
          >
            {saving ? 'Saving...' : 'Save AI Settings'}
          </button>
        </div>
      )}

      {/* BUSINESS INFO TAB */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <SettingsSection title="Business Information" delay={200} description="Basic details about your business">
            <div className="space-y-4">
              <InputField label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Plumbing Co." />
              <InputField label="Email" type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} placeholder="contact@acmeplumbing.com" />
              <InputField label="Business Address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="123 Main St, Salt Lake City, UT" />

              <button
                onClick={handleSaveBusinessSettings}
                disabled={saving}
                className="w-full bg-[#2E4036] text-[#F2F0E9] py-4 rounded-full font-semibold text-lg hover:bg-[#1A1A1A] transition disabled:opacity-50 font-['Plus_Jakarta_Sans']"
              >
                {saving ? 'Saving...' : 'Save Business Info'}
              </button>
            </div>
          </SettingsSection>
        </div>
      )}
    </div>
  );
}
