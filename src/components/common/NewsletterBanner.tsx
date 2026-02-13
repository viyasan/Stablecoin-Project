import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Mail } from 'lucide-react';

const BEEHIIV_URL = import.meta.env.VITE_BEEHIIV_EMBED_URL || '';
const SCROLL_THRESHOLD = 300; // Show after scrolling 300px

export function NewsletterBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (scrolled && !isVisible && !subscribed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, subscribed]);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !BEEHIIV_URL) return;
    setSubmitting(true);
    try {
      await fetch(BEEHIIV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
        mode: 'no-cors',
      });
      setSubscribed(true);
      setEmail('');
      // Hide banner after 3 seconds of successful subscription
      setTimeout(() => setIsVisible(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Don't render if no Beehiiv URL or not visible
  if (!BEEHIIV_URL || !isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-chrome-800 border-t border-chrome-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-chrome-900" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Stay Informed</h4>
                <p className="text-chrome-400 text-xs">
                  Weekly stablecoin insights & regulation updates.
                </p>
              </div>
            </div>

            {/* Center/Right: Form or Success Message */}
            {subscribed ? (
              <p className="text-sm text-status-positive font-medium">
                ✓ You're subscribed!
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="px-3 py-2 rounded-lg bg-chrome-700 text-white placeholder-chrome-400 text-sm border border-chrome-600 focus:outline-none focus:border-gold-400 w-64"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-gold-400 text-chrome-900 text-sm font-medium hover:bg-gold-500 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
                >
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 text-chrome-400 hover:text-white hover:bg-chrome-700 rounded-lg transition-colors duration-150 flex-shrink-0"
              aria-label="Close newsletter banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
