import React, { useState } from 'react';
import {
  Battery,
  Zap,
  Home,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Phone,
} from 'lucide-react';

const highValueStates = ['CA', 'TX', 'FL', 'AZ', 'NY', 'HI', 'NV', 'NC'];

const electricBillOptions = [
  { value: '150', label: '$100 - $150' },
  { value: '200', label: '$150 - $200' },
  { value: '250', label: '$200 - $300' },
  { value: '350', label: '$300+' },
];

const qualityStyles = {
  red: {
    border: 'border-red-500',
    text: 'text-red-600',
    background: 'bg-red-50',
    backgroundBorder: 'border-red-200',
  },
  orange: {
    border: 'border-orange-500',
    text: 'text-orange-600',
    background: 'bg-orange-50',
    backgroundBorder: 'border-orange-200',
  },
  yellow: {
    border: 'border-yellow-500',
    text: 'text-yellow-600',
    background: 'bg-yellow-50',
    backgroundBorder: 'border-yellow-200',
  },
  blue: {
    border: 'border-blue-500',
    text: 'text-blue-600',
    background: 'bg-blue-50',
    backgroundBorder: 'border-blue-200',
  },
};

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  homeOwner: '',
  electricBill: '',
  hasSolar: '',
  creditScore: '',
  powerOutages: '',
  urgency: '',
  referralSource: '',
};

const calculateLeadScore = (data) => {
  let score = 0;

  const bill = parseInt(data.electricBill, 10) || 0;
  if (bill > 300) score += 30;
  else if (bill > 200) score += 20;
  else if (bill > 150) score += 10;

  if (data.homeOwner === 'yes') score += 25;

  if (data.hasSolar === 'yes') score += 20;
  else if (data.hasSolar === 'interested') score += 15;

  if (data.creditScore === 'excellent') score += 20;
  else if (data.creditScore === 'good') score += 15;
  else if (data.creditScore === 'fair') score += 5;

  if (data.powerOutages === 'frequent') score += 15;
  else if (data.powerOutages === 'occasional') score += 10;

  if (data.urgency === 'immediate') score += 15;
  else if (data.urgency === '1-3months') score += 10;
  else if (data.urgency === '3-6months') score += 5;

  if (highValueStates.includes(data.state)) score += 10;

  return score;
};

const getLeadQuality = (score) => {
  if (score >= 80) {
    return { label: 'HOT 🔥', color: 'red', priority: 'IMMEDIATE FOLLOW-UP' };
  }
  if (score >= 60) {
    return { label: 'WARM ⭐', color: 'orange', priority: 'Follow up within 24hrs' };
  }
  if (score >= 40) {
    return { label: 'QUALIFIED ✓', color: 'yellow', priority: 'Follow up within 48hrs' };
  }
  return { label: 'COLD ❄️', color: 'blue', priority: 'Nurture campaign' };
};

const PowerwallLeadGen = () => {
  const [step, setStep] = useState(1);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [showThankYou, setShowThankYou] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setStep(1);
    setShowThankYou(false);
    setCurrentLead(null);
  };

  const handleSubmit = () => {
    const score = calculateLeadScore(formData);
    const quality = getLeadQuality(score);

    const newLead = {
      ...formData,
      score,
      quality: quality.label,
      priority: quality.priority,
      timestamp: new Date().toLocaleString(),
      id: Date.now(),
    };

    setLeads((prev) => [newLead, ...prev]);
    setCurrentLead(newLead);
    setShowThankYou(true);
  };

  if (showThankYou && currentLead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Thank You, {currentLead.name}! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your free Tesla Powerwall consultation is confirmed!
            </p>

            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-8">
              <p className="text-green-800 font-bold text-lg mb-2">
                Lead Quality: {currentLead.quality}
              </p>
              <p className="text-green-700">Score: {currentLead.score}/100</p>
              <p className="text-green-600 text-sm mt-2">{currentLead.priority}</p>
            </div>

            <div className="space-y-3 text-left bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-gray-800 mb-4">What Happens Next:</h3>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-gray-700">Our energy specialist will call you within 24 hours</p>
              </div>
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-gray-700">Free home energy assessment ($500 value)</p>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-gray-700">Custom savings calculation based on your usage</p>
              </div>
              <div className="flex items-start gap-3">
                <Battery className="w-5 h-5 text-blue-600 mt-1" />
                <p className="text-gray-700">Zero-obligation quote for your free Powerwall</p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all"
            >
              Submit Another Lead
            </button>
          </div>

          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-xl mb-4">📊 Admin Dashboard Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-green-400 font-mono text-sm">
                <p>✓ Lead captured: {currentLead.email}</p>
                <p>✓ Score calculated: {currentLead.score}/100</p>
                <p>✓ Priority assigned: {currentLead.priority}</p>
                <p>✓ Email notification sent to sales team</p>
                <p>✓ CRM integration ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Battery className="w-16 h-16 text-green-400" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Get a <span className="text-green-400">FREE</span> Tesla Powerwall
            </h1>
            <Zap className="w-16 h-16 text-yellow-400" />
          </div>
          <p className="text-xl md:text-2xl text-blue-200 mb-4">
            Save thousands on electricity + Never lose power again
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="bg-green-500/20 border border-green-400 rounded-full px-6 py-2">⚡ $0 Upfront Cost</div>
            <div className="bg-blue-500/20 border border-blue-400 rounded-full px-6 py-2">🏠 Homeowners Only</div>
            <div className="bg-purple-500/20 border border-purple-400 rounded-full px-6 py-2">⏱️ Limited Availability</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Step {step} of 3</span>
                <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Let's Get Started</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="John Smith"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@email.com"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="123 Main St"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-gray-700 font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Los Angeles"
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-gray-700 font-semibold mb-2">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select State</option>
                      {highValueStates.map((stateOption) => (
                        <option key={stateOption} value={stateOption}>
                          {stateOption}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-gray-700 font-semibold mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => updateField('zip', e.target.value)}
                      placeholder="90001"
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.email || !formData.phone || !formData.state || !formData.city}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Step 2 →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">About Your Home</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Do you own your home? *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateField('homeOwner', 'yes')}
                      className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                        formData.homeOwner === 'yes'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      Yes, I Own It
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('homeOwner', 'no')}
                      className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                        formData.homeOwner === 'no'
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                      }`}
                    >
                      No, I Rent
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Monthly Electric Bill *</label>
                  <select
                    value={formData.electricBill}
                    onChange={(e) => updateField('electricBill', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Range</option>
                    {electricBillOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Do you have solar panels? *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['yes', 'no', 'interested'].map((option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => updateField('hasSolar', option)}
                        className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                          formData.hasSolar === option
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                        }`}
                      >
                        {option === 'interested' ? 'Interested' : option === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">How often do you experience power outages? *</label>
                  <select
                    value={formData.powerOutages}
                    onChange={(e) => updateField('powerOutages', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Frequency</option>
                    <option value="frequent">Frequently (Monthly)</option>
                    <option value="occasional">Occasionally (Few times/year)</option>
                    <option value="rare">Rarely</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={
                      !formData.homeOwner ||
                      !formData.electricBill ||
                      !formData.hasSolar ||
                      !formData.powerOutages
                    }
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Step 3 →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Final Details</h2>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Credit Score Range *</label>
                  <select
                    value={formData.creditScore}
                    onChange={(e) => updateField('creditScore', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Range</option>
                    <option value="excellent">Excellent (750+)</option>
                    <option value="good">Good (700-749)</option>
                    <option value="fair">Fair (650-699)</option>
                    <option value="poor">Below 650</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">When are you looking to install? *</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => updateField('urgency', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Timeframe</option>
                    <option value="immediate">Immediately (This month)</option>
                    <option value="1-3months">1-3 Months</option>
                    <option value="3-6months">3-6 Months</option>
                    <option value="exploring">Just Exploring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">How did you hear about us?</label>
                  <select
                    value={formData.referralSource}
                    onChange={(e) => updateField('referralSource', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Source</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google Search</option>
                    <option value="instagram">Instagram</option>
                    <option value="referral">Friend/Family Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6">
                  <h3 className="font-bold text-green-800 mb-3">✓ You're Qualified!</h3>
                  <p className="text-green-700">
                    Based on your answers, you qualify for a FREE Tesla Powerwall installation.
                    Submit now to lock in your spot!
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-lg font-bold hover:bg-gray-400 transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!formData.creditScore || !formData.urgency}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    🎉 Claim My Free Powerwall!
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-800 mb-4">Why Homeowners Love It:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Save $2,000+/Year</p>
                    <p className="text-sm text-gray-600">On electricity bills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Never Lose Power</p>
                    <p className="text-sm text-gray-600">Backup during outages</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Increase Home Value</p>
                    <p className="text-sm text-gray-600">Up to 4% boost</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="font-bold text-xl mb-3">⏰ Limited Time Offer</h3>
              <p className="mb-4">Only 47 spots remaining in your area this month!</p>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm">Join 12,847 happy homeowners who've already made the switch</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg text-gray-800 mb-3">⭐⭐⭐⭐⭐</h3>
              <p className="text-gray-700 italic mb-3">
                "Best decision we ever made! Our electric bill went from $350 to $40 per month."
              </p>
              <p className="text-sm text-gray-600">- Sarah M., California</p>
            </div>
          </div>
        </div>

        {leads.length > 0 && (
          <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">📊 Lead Dashboard (Admin View)</h2>
            <div className="grid gap-4">
              {leads.map((lead) => {
                const quality = getLeadQuality(lead.score);
                const styles = qualityStyles[quality.color];
                const electricBillLabel =
                  electricBillOptions.find((option) => option.value === lead.electricBill)?.label ||
                  `$${lead.electricBill}`;

                return (
                  <div
                    key={lead.id}
                    className={`bg-white rounded-xl p-6 border-l-4 ${styles.border}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{lead.name}</h3>
                        <p className="text-gray-600">
                          {lead.email} • {lead.phone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {lead.city}, {lead.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`${styles.text} font-bold text-lg mb-1`}>{lead.quality}</div>
                        <div className="text-2xl font-bold text-gray-800">{lead.score}/100</div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Electric Bill:</span>
                        <span className="font-semibold text-gray-800 ml-2">{electricBillLabel}/mo</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Has Solar:</span>
                        <span className="font-semibold text-gray-800 ml-2">{lead.hasSolar}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Urgency:</span>
                        <span className="font-semibold text-gray-800 ml-2">{lead.urgency}</span>
                      </div>
                    </div>
                    <div className={`mt-4 rounded-lg p-3 border ${styles.background} ${styles.backgroundBorder}`}>
                      <p className="text-sm font-semibold text-gray-700">🎯 {lead.priority}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerwallLeadGen;
