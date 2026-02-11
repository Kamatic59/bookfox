import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FadeIn, GlassCard } from '../components/shared/Animations';

// Settings section component
function SettingsSection({ title, description, children, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <GlassCard className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/50">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {description && <p className="text-slate-600 text-sm mt-1">{description}</p>}
        </div>
        <div className="p-6">{children}</div>
      </GlassCard>
    </FadeIn>
  );
}

// Input field component
function InputField({ label, type = 'text', value, onChange, placeholder, helpText, disabled, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all disabled:bg-stone-100 disabled:text-stone-500 ${
          error ? 'border-red-300' : 'border-stone-300'
        }`}
      />
      {helpText && <p className="text-stone-500 text-xs mt-2">{helpText}</p>}
      {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
    </div>
  );
}

// Textarea component
function TextArea({ label, value, onChange, placeholder, helpText, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
      />
      {helpText && <p className="text-stone-500 text-xs mt-2">{helpText}</p>}
    </div>
  );
}

// Toggle switch component
function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium text-stone-800">{label}</p>
        {description && <p className="text-stone-500 text-sm mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          enabled ? 'bg-primary-600' : 'bg-stone-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
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
        // No settings yet, create default
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
      // Validate phone format
      const phoneRegex = /^\+?[1-9]\d{10,14}$/;
      if (!phoneRegex.test(twilioPhone.replace(/[\s()-]/g, ''))) {
        throw new Error('Invalid phone format. Use: +15551234567');
      }

      const { error } = await supabase
        .from('businesses')
        .update({
          twilio_phone: twilioPhone,
        })
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
        .update({
          name: businessName,
          email: businessEmail,
          address_line1: businessAddress,
        })
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
        .upsert({
          business_id: business.id,
          ...aiSettings,
        }, {
          onConflict: 'business_id'
        });
      
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
      setAiSettings({
        ...aiSettings,
        services_offered: [...aiSettings.services_offered, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (index) => {
    setAiSettings({
      ...aiSettings,
      services_offered: aiSettings.services_offered.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setAiSettings({
        ...aiSettings,
        qualification_questions: [...aiSettings.qualification_questions, newQuestion.trim()]
      });
      setNewQuestion('');
    }
  };

  const removeQuestion = (index) => {
    setAiSettings({
      ...aiSettings,
      qualification_questions: aiSettings.qualification_questions.filter((_, i) => i !== index)
    });
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
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600 mt-1">Configure your AI receptionist</p>
        </div>
      </FadeIn>

      {/* Success Message */}
      {successMessage && (
        <FadeIn delay={100}>
          <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 rounded-xl flex items-center gap-3 shadow-sm">
            <span className="text-xl">✅</span>
            {successMessage}
          </div>
        </FadeIn>
      )}

      {/* Error Message */}
      {errorMessage && (
        <FadeIn delay={100}>
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-100'
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
          <SettingsSection 
            title="Twilio Phone Number" 
            delay={200} 
            description="Connect your Twilio phone number to receive calls and texts"
          >
            <div className="space-y-6">
              {!twilioConfigured && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-800">Setup Required</p>
                      <p className="text-amber-700 text-sm mt-1">
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
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">Phone Number Configured</p>
                      <p className="text-green-700 text-sm mt-1">
                        Now configure your Twilio webhooks to complete setup.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSaveTwilio}
                disabled={saving || !twilioPhone}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : twilioConfigured ? 'Update Phone Number' : 'Save Phone Number'}
              </button>
            </div>
          </SettingsSection>

          {twilioConfigured && (
            <SettingsSection 
              title="Webhook Configuration" 
              delay={300} 
              description="Copy these URLs into your Twilio phone number settings"
            >
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Voice Webhook (When a call comes in)</p>
                  <code className="block bg-white p-3 rounded-lg text-sm text-slate-700 font-mono border border-slate-200 break-all">
                    {webhookUrl}/twilio-voice
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    Set this in: Twilio Console → Phone Numbers → {twilioPhone} → Voice Configuration → "A CALL COMES IN" → Webhook
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">SMS Webhook (When a message comes in)</p>
                  <code className="block bg-white p-3 rounded-lg text-sm text-slate-700 font-mono border border-slate-200 break-all">
                    {webhookUrl}/twilio-sms
                  </code>
                  <p className="text-xs text-slate-500 mt-2">
                    Set this in: Twilio Console → Phone Numbers → {twilioPhone} → Messaging Configuration → "A MESSAGE COMES IN" → Webhook
                  </p>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-semibold text-primary-800">Quick Setup Guide</p>
                      <ol className="text-primary-700 text-sm mt-2 space-y-1 list-decimal list-inside">
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
                <label className="block text-sm font-medium text-stone-700 mb-2">Response Delay (seconds)</label>
                <input
                  type="number"
                  value={aiSettings.response_delay_seconds}
                  onChange={(e) => setAiSettings({ ...aiSettings, response_delay_seconds: parseInt(e.target.value) || 30 })}
                  min="0"
                  max="300"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <p className="text-stone-500 text-xs mt-2">
                  How long to wait before sending the first SMS after a missed call (0-300 seconds)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Max Messages Before Human Handoff</label>
                <input
                  type="number"
                  value={aiSettings.max_messages_before_human}
                  onChange={(e) => setAiSettings({ ...aiSettings, max_messages_before_human: parseInt(e.target.value) || 10 })}
                  min="3"
                  max="50"
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <p className="text-stone-500 text-xs mt-2">
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
                  className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  onClick={addService}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
                >
                  Add
                </button>
              </div>

              {aiSettings.services_offered.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {aiSettings.services_offered.map((service, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg">
                      <span className="text-sm">{service}</span>
                      <button
                        onClick={() => removeService(index)}
                        className="text-primary-600 hover:text-primary-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm italic">No services added yet. Add your first service above.</p>
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
                  className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
                <button
                  onClick={addQuestion}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
                >
                  Add
                </button>
              </div>

              {aiSettings.qualification_questions.length > 0 ? (
                <div className="space-y-2">
                  {aiSettings.qualification_questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700">{question}</span>
                      <button
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-800 font-bold flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-sm italic">No questions added yet. Add your first question above.</p>
              )}
            </div>
          </SettingsSection>

          <button
            onClick={handleSaveAiSettings}
            disabled={saving}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50"
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
              <InputField
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Plumbing Co."
              />
              
              <InputField
                label="Email"
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                placeholder="contact@acmeplumbing.com"
              />
              
              <InputField
                label="Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="123 Main St, Salt Lake City, UT"
              />

              <button
                onClick={handleSaveBusinessSettings}
                disabled={saving}
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50"
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
