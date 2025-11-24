'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleSearch } from '@/components/ui/simple-search';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/style';
import type { CartItem } from '@/stores/cart';
import { useCartStore } from '@/stores/cart';

const createContactFormSchema = (items: CartItem[]) =>
  z
    .object({
      name: z.string().min(1, 'Name is required'),
      company: z.string().optional(),
      email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
      role: z.string().optional(),
      message: z.string().optional()
    })
    .refine(
      data => {
        const hasConfigs = items.length > 0;
        const hasMessage = data.message && data.message.trim().length > 0;
        return hasConfigs || hasMessage;
      },
      {
        message:
          'Please either select GPU configurations above or provide details here.',
        path: ['message']
      }
    );

type ContactFormData = z.infer<ReturnType<typeof createContactFormSchema>>;

export function ContactWithCartForm() {
  const [formStatus, setFormStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const items = useCartStore(state => state.items);
  const removeItem = useCartStore(state => state.removeItem);
  const addItem = useCartStore(state => state.addItem);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactFormSchema(items))
  });

  const onSubmit = async (data: ContactFormData) => {
    setFormStatus({ type: 'loading', message: '' });

    try {
      const payload = {
        name: data.name.trim(),
        company: data.company?.trim() ?? '',
        email: data.email.trim(),
        role: data.role?.trim() ?? '',
        message: data.message?.trim() ?? '',
        cartItems: items // Include cart items in submission
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: "Message sent successfully! We'll be in touch soon."
        });
        reset();
      } else {
        let errorMessage =
          'Failed to send message. Please try again or email us directly.';
        try {
          const responseData = (await response.json()) as { error?: string };
          if (responseData.error) errorMessage = responseData.error;
        } catch {
          // Use default error message
        }
        setFormStatus({ type: 'error', message: errorMessage });
      }
    } catch (err) {
      console.error(err);
      setFormStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  return (
    <div className="grid gap-7 lg:grid-cols-2">
      {/* Left side - Search + Cart items */}
      <div className="text-fg-soft">
        <div className="mb-6">
          <h3 className="text-fg-main mb-3 text-sm font-medium">
            Search GPU Configurations
          </h3>
          <SimpleSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onAddToCart={addItem}
          />
        </div>

        {/* Cart items - always visible */}
        <div className="border-border/40 bg-bg-surface/50 rounded-lg border p-4">
          <h4 className="text-fg-main mb-3 text-sm font-medium">
            Selected Configurations ({items.length})
          </h4>

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="border-border/30 bg-bg-page/50 flex items-start justify-between gap-2 rounded border p-2"
                >
                  <div className="flex-1">
                    <div className="text-fg-main text-xs font-medium">
                      {item.title}
                    </div>
                    <div className="text-fg-muted mt-0.5 text-[10px]">
                      Qty: {item.quantity} × {item.price}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-fg-muted hover:text-fg-main rounded p-0.5 transition"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-fg-muted py-4 text-center text-xs">
              No configurations selected yet. Search and add configurations
              above to include them in your quote request.
            </p>
          )}

          <p className="text-fg-muted mt-3 text-xs">
            These configurations will be included in your inquiry
          </p>
        </div>

        <div className="mt-6">
          <p className="text-fg-main mb-2 text-sm font-medium">
            What we can help with:
          </p>
          <ul className="mb-4 ml-4 space-y-1 text-sm">
            <li>AI training and inference infrastructure</li>
            <li>Custom GPU cluster configurations</li>
            <li>Hybrid cloud and on-premise solutions</li>
          </ul>

          <p className="text-fg-muted text-sm">
            You can also email us directly at{' '}
            <a
              href="mailto:shrey@gpucloud.store"
              className="text-ui-active-soft font-medium hover:underline"
            >
              shrey@gpucloud.store
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-border/40 bg-bg-surface/50 rounded-2xl border p-5 shadow-lg"
      >
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="name"
              className="text-fg-soft mb-1.5 block text-xs font-medium"
            >
              Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="border-border/50 bg-bg-page text-fg-main placeholder:text-fg-muted/50 focus-visible:border-ui-active-soft focus-visible:ring-ui-active-soft/20"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-ui-danger mt-1 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="company"
              className="text-fg-soft mb-1.5 block text-xs font-medium"
            >
              Company
            </Label>
            <Input
              id="company"
              type="text"
              placeholder="Acme Inc."
              className="border-border/50 bg-bg-page text-fg-main placeholder:text-fg-muted/50 focus-visible:border-ui-active-soft focus-visible:ring-ui-active-soft/20"
              {...register('company')}
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label
              htmlFor="email"
              className="text-fg-soft mb-1.5 block text-xs font-medium"
            >
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@acme.com"
              className="border-border/50 bg-bg-page text-fg-main placeholder:text-fg-muted/50 focus-visible:border-ui-active-soft focus-visible:ring-ui-active-soft/20"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-ui-danger mt-1 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="role"
              className="text-fg-soft mb-1.5 block text-xs font-medium"
            >
              Role
            </Label>
            <Input
              id="role"
              type="text"
              placeholder="CTO"
              className="border-border/50 bg-bg-page text-fg-main placeholder:text-fg-muted/50 focus-visible:border-ui-active-soft focus-visible:ring-ui-active-soft/20"
              {...register('role')}
            />
          </div>
        </div>

        <div className="mb-4">
          <Label
            htmlFor="message"
            className="text-fg-soft mb-1.5 block text-xs font-medium"
          >
            Additional Requirements / Comments
          </Label>
          <Textarea
            id="message"
            placeholder="e.g., Specific network requirements, custom storage configurations, timeline constraints, budget considerations, or any other details not captured above..."
            className="border-border/50 bg-bg-page text-fg-main placeholder:text-fg-muted/50 focus-visible:border-ui-active-soft focus-visible:ring-ui-active-soft/20 min-h-[120px]"
            {...register('message')}
          />
          {errors.message && (
            <p className="text-ui-danger mt-1 text-xs">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="text-fg-muted mb-4 text-xs">
          * Required fields. Please add GPU configurations above OR provide
          details in the comments field (at least one is required). We typically
          respond within 24 hours.
        </div>

        {formStatus.message && (
          <div
            className={cn(
              'mb-3 min-h-[1.2em] text-sm',
              formStatus.type === 'error' && 'text-ui-danger',
              formStatus.type === 'success' && 'text-ui-success'
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
          className="bg-ui-active-soft hover:bg-ui-active w-full rounded-lg px-6 py-3 text-sm font-medium text-white transition"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </div>
  );
}
