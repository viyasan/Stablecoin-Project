import { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

interface EmailSignupPayload {
  full_name: string;
  email: string;
  industry: string;
}

interface UseEmailSignupReturn {
  submit: (payload: EmailSignupPayload) => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  reset: () => void;
}

export function useEmailSignup(): UseEmailSignupReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  }, []);

  const submit = useCallback(async (payload: EmailSignupPayload) => {
    if (!supabase) {
      setError('Signup is temporarily unavailable.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const email = payload.email.trim().toLowerCase();

      const { error: dbError } = await supabase
        .from('email_signups')
        .insert({
          full_name: payload.full_name.trim(),
          email,
          industry: payload.industry,
        });

      if (dbError) {
        // 23505 = unique_violation — email already exists, treat as success
        if (dbError.code === '23505') {
          setIsSuccess(true);
        } else {
          setError(dbError.message);
        }
      } else {
        setIsSuccess(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, isSuccess, error, reset };
}
