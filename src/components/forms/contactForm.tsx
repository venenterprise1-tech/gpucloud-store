'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/style';

interface ContactFormProps {
  translations: {
    name: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    role: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
    hint: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    networkError: string;
    submitError: string;
  };
}

interface ContactFormData {
  name: string;
  company?: string;
  email: string;
  role?: string;
  message: string;
}

export function ContactForm({ translations }: ContactFormProps) {
  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus({ type: 'loading', message: '' });

    try {
      const payload = {
        name: data.name.trim(),
        company: data.company?.trim() || '',
        email: data.email.trim(),
        role: data.role?.trim() || '',
        message: data.message.trim()
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormStatus({ type: 'success', message: translations.success });
        reset();
      } else {
        let errorMessage = translations.submitError;
        try {
          const responseData = await response.json();
          if (responseData.error) errorMessage = responseData.error;
        } catch (err) {
          // Use default error message
        }
        setFormStatus({ type: 'error', message: errorMessage });
      }
    } catch (err) {
      console.error(err);
      setFormStatus({ type: 'error', message: translations.networkError });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-cyan-400/40 bg-linear-to-br from-cyan-950/40 via-slate-950/60 to-purple-950/40 p-5 shadow-[0_0_22px_rgba(0,255,255,0.45),0_0_40px_rgba(0,0,0,1)]"
    >
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="name"
            className="mb-1.5 block text-xs tracking-widest text-cyan-300 uppercase"
          >
            {translations.name.label}
          </Label>
          <Input
            id="name"
            type="text"
            placeholder={translations.name.placeholder}
            className="border-cyan-400/50 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus-visible:border-pink-500/90 focus-visible:shadow-[0_0_12px_rgba(0,255,255,0.7),0_0_28px_rgba(0,0,0,1)] focus-visible:ring-pink-500/90"
            {...register('name', {
              required: translations.error
            })}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-pink-300">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label
            htmlFor="company"
            className="mb-1.5 block text-xs tracking-widest text-cyan-300 uppercase"
          >
            {translations.company.label}
          </Label>
          <Input
            id="company"
            type="text"
            placeholder={translations.company.placeholder}
            className="border-cyan-400/50 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus-visible:border-pink-500/90 focus-visible:shadow-[0_0_12px_rgba(0,255,255,0.7),0_0_28px_rgba(0,0,0,1)] focus-visible:ring-pink-500/90"
            {...register('company')}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="email"
            className="mb-1.5 block text-xs tracking-widest text-cyan-300 uppercase"
          >
            {translations.email.label}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={translations.email.placeholder}
            className="border-cyan-400/50 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus-visible:border-pink-500/90 focus-visible:shadow-[0_0_12px_rgba(0,255,255,0.7),0_0_28px_rgba(0,0,0,1)] focus-visible:ring-pink-500/90"
            {...register('email', {
              required: translations.error,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-pink-300">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label
            htmlFor="role"
            className="mb-1.5 block text-xs tracking-widest text-cyan-300 uppercase"
          >
            {translations.role.label}
          </Label>
          <Input
            id="role"
            type="text"
            placeholder={translations.role.placeholder}
            className="border-cyan-400/50 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus-visible:border-pink-500/90 focus-visible:shadow-[0_0_12px_rgba(0,255,255,0.7),0_0_28px_rgba(0,0,0,1)] focus-visible:ring-pink-500/90"
            {...register('role')}
          />
        </div>
      </div>

      <div className="mb-4">
        <Label
          htmlFor="message"
          className="mb-1.5 block text-xs tracking-widest text-cyan-300 uppercase"
        >
          {translations.message.label}
        </Label>
        <Textarea
          id="message"
          placeholder={translations.message.placeholder}
          className="min-h-[120px] border-cyan-400/50 bg-slate-950/90 text-slate-100 placeholder:text-slate-500 focus-visible:border-pink-500/90 focus-visible:shadow-[0_0_12px_rgba(0,255,255,0.7),0_0_28px_rgba(0,0,0,1)] focus-visible:ring-pink-500/90"
          {...register('message', {
            required: translations.error
          })}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-pink-300">{errors.message.message}</p>
        )}
      </div>

      <div className="mb-4 text-xs text-slate-400">{translations.hint}</div>

      {formStatus.message && (
        <div
          className={cn(
            'mb-3 min-h-[1.2em] text-sm',
            formStatus.type === 'error' && 'text-pink-300',
            formStatus.type === 'success' && 'text-cyan-300'
          )}
          role="alert"
          aria-live="polite"
        >
          {formStatus.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-linear-to-br from-cyan-400 to-blue-600 px-6 py-3 text-sm tracking-widest text-slate-950 uppercase shadow-[0_0_22px_rgba(0,255,255,0.9),0_0_46px_rgba(0,0,0,0.9)] transition-all duration-200 hover:from-cyan-400 hover:to-pink-500 hover:shadow-[0_0_30px_rgba(0,255,255,1),0_0_52px_rgba(0,0,0,1)]"
      >
        {isSubmitting ? translations.submitting : translations.submit}
      </Button>
    </form>
  );
}
