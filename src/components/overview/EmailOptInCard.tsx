import { useState, type FormEvent } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { TiltCard } from '../common';
import { useEmailSignup } from '../../api';
import { supabase } from '../../api/supabaseClient';

const INDUSTRY_OPTIONS = [
  { value: 'financial_services', label: 'Financial Services' },
  { value: 'banking', label: 'Banking' },
  { value: 'payment_service_provider', label: 'Payment Service Provider' },
  { value: 'legal', label: 'Legal / Law' },
  { value: 'regulatory_government', label: 'Regulatory / Government' },
  { value: 'fintech_defi', label: 'Fintech / DeFi' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'venture_capital', label: 'Venture Capital / Investment' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'media_research', label: 'Media / Research' },
  { value: 'academia', label: 'Academia' },
  { value: 'other', label: 'Other' },
] as const;

export function EmailOptInCard() {
  const { submit, isSubmitting, isSuccess, error, reset } = useEmailSignup();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');

  if (!supabase) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !industry) return;
    submit({ full_name: fullName, email, industry });
  }

  if (isSuccess) {
    return (
      <TiltCard maxTilt={2}>
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 px-6 py-10 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-12 h-12 text-status-positive mb-4" />
          <h3 className="text-xl font-semibold text-chrome-900 mb-2">
            You're on the list!
          </h3>
          <p className="text-chrome-500 text-sm">
            We'll send you curated stablecoin insights tailored to your
            industry.
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              setFullName('');
              setEmail('');
              setIndustry('');
            }}
            className="mt-4 text-sm text-gold-500 hover:text-gold-600 underline transition-colors"
          >
            Submit another response
          </button>
        </div>
      </TiltCard>
    );
  }

  return (
    <TiltCard maxTilt={2}>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 px-6 py-6 transition-all duration-200 hover:shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
          {/* Left — Copy */}
          <div className="flex items-start gap-3 mb-5 lg:mb-0 lg:flex-shrink-0 lg:max-w-xs">
            <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-chrome-900">
                Stay Informed
              </h3>
              <p className="text-sm text-chrome-500 mt-0.5">
                Canadian Stablecoin Report and more.
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row sm:items-end gap-3 flex-1"
          >
            <div className="flex-1 min-w-0">
              <label
                htmlFor="signup-name"
                className="block text-xs font-medium text-chrome-600 mb-1"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Wayne Gretzky"
                className="w-full px-3 py-2 text-sm bg-chrome-50 border border-chrome-200 rounded-md text-chrome-900 placeholder:text-chrome-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label
                htmlFor="signup-email"
                className="block text-xs font-medium text-chrome-600 mb-1"
              >
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wayne@greatone.ca"
                className="w-full px-3 py-2 text-sm bg-chrome-50 border border-chrome-200 rounded-md text-chrome-900 placeholder:text-chrome-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
              />
            </div>

            <div className="flex-1 min-w-0">
              <label
                htmlFor="signup-industry"
                className="block text-xs font-medium text-chrome-600 mb-1"
              >
                Industry
              </label>
              <select
                id="signup-industry"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-chrome-50 border border-chrome-200 rounded-md text-chrome-900 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition-colors"
              >
                <option value="" disabled>
                  Select industry
                </option>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gold-500 text-white text-sm font-medium rounded-md hover:bg-gold-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
            >
              {isSubmitting ? 'Submitting...' : 'Get Insights'}
            </button>
          </form>
        </div>

        {error && (
          <p className="mt-3 text-sm text-status-negative">{error}</p>
        )}
      </div>
    </TiltCard>
  );
}
