import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Settings section component
function SettingsSection({ title, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100">
        <h3 className="text-lg font-bold text-stone-800">{title}</h3>
        {description && <p className="text-stone-500 text-sm mt-1">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Input field component
function InputField({ label, type = 'text', value, onChange, placeholder, helpText, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-stone-100 disabled:text-stone-500"
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
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-stone-300'
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
  const [activeTab, setActiveTab] = useState('business');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Business settings
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessTimezone, setBusinessTimezone] = useState('America/Denver');
  
  // AI settings
  const [aiSettings, setAiSettings] = useState({
    auto_respond: true,
    assistant_name: 'BookFox',
    greeting_template: '',
    response_delay_seconds: 30,
    max_messages_before_human: 10,
  });

  // Load settings
  useEffect(() => {
    if (business) {
      setBusinessName(business.name || '');
      setBusinessPhone(business.phone || '');
      setBusinessEmail(business.email || '');
      setBusinessAddress(business.address_line1 || '');
      setBusinessTimezone(business.timezone || 'America/Denver');
    }
  }, [business]);

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
          greeting_template: data.greeting_template || '',
          response_delay_seconds: data.response_delay_seconds || 30,
          max_messages_before_human: data.max_messages_before_human || 10,
        });
      }
    }
    loadAiSettings();
  }, [business?.id]);

  const handleSaveBusinessSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: businessName,
          phone: businessPhone,
          email: businessEmail,
          address_line1: businessAddress,
          timezone: businessTimezone,
        })
        .eq('id', business.id);
      
      if (error) throw error;
      
      await refreshBusiness();
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAiSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('ai_settings')
        .update(aiSettings)
        .eq('business_id', business.id);
      
      if (error) throw error;
      
      setSuccessMessage('AI settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save AI settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'business', label: 'Business', icon: '🏢' },
    { id: 'ai', label: 'AI Assistant', icon: '🤖' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'team', label: 'Team', icon: '👥' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800">Settings</h1>
        <p className="text-stone-500 mt-1">Manage your business and AI configuration</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3">
          <span className="text-xl">✅</span>
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Settings */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <SettingsSection title="Business Information" description="Basic details about your business">
            <div className="space-y-4">
              <InputField
                label="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Plumbing Co."
              />
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Phone Number"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="(385) 555-0100"
                />
                <InputField
                  label="Email"
                  type="email"
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                  placeholder="contact@acmeplumbing.com"
                />
              </div>
              <InputField
                label="Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="123 Main St, Salt Lake City, UT"
              />
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Timezone</label>
                <select
                  value={businessTimezone}
                  onChange={(e) => setBusinessTimezone(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveBusinessSettings}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="BookFox Phone Number" description="Your dedicated phone number for catching missed calls">
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
              <div>
                <p className="font-mono text-xl font-bold text-stone-800">
                  {business?.twilio_phone || 'Not configured'}
                </p>
                <p className="text-stone-500 text-sm mt-1">
                  Forward your business calls to this number to catch missed calls
                </p>
              </div>
              {business?.twilio_phone ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                  Active
                </span>
              ) : (
                <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all">
                  Setup Number
                </button>
              )}
            </div>
          </SettingsSection>
        </div>
      )}

      {/* AI Settings */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <SettingsSection title="AI Behavior" description="Control how your AI assistant responds to customers">
            <div className="space-y-6">
              <Toggle
                enabled={aiSettings.auto_respond}
                onChange={(v) => setAiSettings({ ...aiSettings, auto_respond: v })}
                label="Auto-respond to missed calls"
                description="Automatically send an SMS when a call is missed"
              />
              
              <div className="pt-4 border-t border-stone-100">
                <InputField
                  label="Assistant Name"
                  value={aiSettings.assistant_name}
                  onChange={(e) => setAiSettings({ ...aiSettings, assistant_name: e.target.value })}
                  placeholder="BookFox"
                  helpText="The name your AI will use when greeting customers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Greeting Template</label>
                <textarea
                  value={aiSettings.greeting_template}
                  onChange={(e) => setAiSettings({ ...aiSettings, greeting_template: e.target.value })}
                  placeholder="Hi! This is {{assistant_name}} from {{business_name}}. I noticed we missed your call. How can I help you today?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-stone-500 text-xs mt-2">
                  Use {'{{assistant_name}}'} and {'{{business_name}}'} as placeholders
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Response Delay (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={aiSettings.response_delay_seconds}
                    onChange={(e) => setAiSettings({ ...aiSettings, response_delay_seconds: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-stone-500 text-xs mt-2">Wait before sending the first SMS</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Max AI Messages</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={aiSettings.max_messages_before_human}
                    onChange={(e) => setAiSettings({ ...aiSettings, max_messages_before_human: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-stone-500 text-xs mt-2">Auto-escalate to human after this many messages</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveAiSettings}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save AI Settings'}
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="AI Personality Preview" description="See how your AI will respond to customers">
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg">
                  🦊
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm">
                    <p className="text-stone-700">
                      Hi! This is {aiSettings.assistant_name || 'BookFox'} from {businessName || 'your business'}. 
                      I noticed we missed your call. How can I help you today? 🦊
                    </p>
                  </div>
                  <p className="text-stone-400 text-xs mt-1.5 ml-2">AI • Just now</p>
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <SettingsSection title="Connected Services" description="Manage your integrations">
            <div className="space-y-4">
              {[
                { name: 'Twilio', icon: '📱', status: 'connected', description: 'SMS and voice calls' },
                { name: 'Google Calendar', icon: '📅', status: 'not_connected', description: 'Sync appointments' },
                { name: 'QuickBooks', icon: '📊', status: 'not_connected', description: 'Invoicing and payments' },
                { name: 'Zapier', icon: '⚡', status: 'not_connected', description: 'Connect 5,000+ apps' },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium text-stone-800">{integration.name}</p>
                      <p className="text-stone-500 text-sm">{integration.description}</p>
                    </div>
                  </div>
                  {integration.status === 'connected' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      Connected
                    </span>
                  ) : (
                    <button className="px-4 py-2 border border-stone-300 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-all">
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Billing */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <SettingsSection title="Current Plan" description="Manage your subscription">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-200 text-sm">Current Plan</p>
                  <p className="text-2xl font-bold">14-Day Trial</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/30 text-white text-sm font-medium rounded-full">
                  Active
                </span>
              </div>
              <p className="text-blue-100 mb-4">
                Your trial ends on February 17, 2026. Upgrade now to keep your leads flowing!
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all">
                Upgrade to Professional - $99/mo
              </button>
            </div>
          </SettingsSection>

          <SettingsSection title="Usage This Month" description="Track your usage">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-stone-500 text-sm">Leads Captured</p>
                <p className="text-2xl font-bold text-stone-800">23 / 100</p>
                <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '23%' }} />
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-stone-500 text-sm">SMS Sent</p>
                <p className="text-2xl font-bold text-stone-800">156 / 500</p>
                <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '31%' }} />
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl">
                <p className="text-stone-500 text-sm">AI Conversations</p>
                <p className="text-2xl font-bold text-stone-800">18 / ∞</p>
                <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>
      )}

      {/* Team */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <SettingsSection title="Team Members" description="Manage who has access to your BookFox account">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-stone-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-stone-800">{user?.email}</p>
                    <p className="text-stone-500 text-sm">Owner</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  You
                </span>
              </div>
            </div>
            <button className="mt-4 w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 font-medium rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all">
              + Invite Team Member
            </button>
          </SettingsSection>
        </div>
      )}
    </div>
  );
}
