'use client';
import { motion } from 'motion/react';
import { useState } from 'react';

import { ContactWithCartForm } from '@/components/forms/contact-with-cart-form';
import { CartHeader } from '@/components/layout-navigation/cart-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import { Fog } from '@/components/ui/fog';
import { HaloSearch } from '@/components/ui/halo-search';
import { SpotlightArea } from '@/components/ui/spotlight-area';
import {
  lampFlickerAnimation,
  LampFlickerProvider,
  lampFlickerTransition,
  Streetlamp,
  useLampFlickerControls
} from '@/components/ui/streetlamp';
import { cn } from '@/lib/style';
import { useCartStore } from '@/stores/cart';

type CarouselCard = {
  id: string;
  title: string;
  description: string;
};

const heroAccentGradient =
  'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-neon-electric) 65%, transparent), transparent)';
const heroCyanGradient =
  'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-neon-cyan) 75%, transparent), transparent)';
const heroCyanGlowGradient =
  'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-neon-cyan) 45%, transparent), transparent)';

const initialCards: CarouselCard[] = [
  {
    id: 'card-1',
    title: 'Instant GPU Power',
    description:
      'Spin up high-performance GPUs in seconds for your most demanding workloads.'
  },
  {
    id: 'card-2',
    title: 'Predictable Pricing',
    description:
      'Transparent hourly billing with no surprise fees or long-term lock-in.'
  },
  {
    id: 'card-3',
    title: 'Global Availability',
    description:
      'Deploy close to your users with low-latency regions around the world.'
  }
];

type FlickeringCardProps = {
  title: string;
  description: string;
};

const FlickeringCard = ({ title, description }: FlickeringCardProps) => {
  const sharedOpacity = useLampFlickerControls();

  return (
    <div className="relative -top-28 z-10 w-[260px]">
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow:
            '0 5px 50px color-mix(in srgb, var(--color-lamp-glow) 45%, transparent)',
          ...(sharedOpacity ? { opacity: sharedOpacity } : undefined)
        }}
        animate={sharedOpacity ? undefined : lampFlickerAnimation}
        transition={sharedOpacity ? undefined : lampFlickerTransition}
      />
      <Card className="bg-card text-card-foreground border-border/60 relative flex h-[180px] w-full flex-col overflow-clip border p-px">
        <div className="bg-card flex h-full flex-col rounded-[calc(var(--radius-sm)-1px)] p-4">
          <CardContent className="flex h-full flex-col justify-between gap-3 p-0">
            <div className="space-y-1.5">
              <p className="text-ui-active-faint text-xs font-medium tracking-[0.22em] uppercase">
                Feature
              </p>
              <div className="text-fg-main text-base font-semibold">
                {title}
              </div>
            </div>
            <p className="text-fg-soft text-sm leading-relaxed">
              {description}
            </p>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default function TestPage() {
  const [cards, setCards] = useState<CarouselCard[]>(initialCards);
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore(state => state.addItem);

  const handleNext = () => {
    setCards(prev => {
      if (prev.length <= 1) return prev;
      const first = prev[0]!;
      const rest: CarouselCard[] = prev.slice(1);
      return [...rest, first];
    });
  };

  const handlePrev = () => {
    setCards(prev => {
      if (prev.length <= 1) return prev;
      const lastIndex = prev.length - 1;
      const last = prev[lastIndex]!;
      const rest: CarouselCard[] = prev.slice(0, lastIndex);
      return [last, ...rest];
    });
  };

  return (
    <>
      <CartHeader />
      <div className="bg-bg-page text-fg-main relative flex min-h-[85vh] flex-col items-center justify-start gap-8 overflow-hidden pt-16 pb-12">
        {/* Fog limited to the upper hero area, with radial mask to focus around the hero */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[520px]">
          <div
            className="relative h-full w-full"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle at 50% 32%, rgba(1,1,1,1) 0%, rgba(1,1,1,0.7) 45%, rgba(1,1,1,0.05) 70%, transparent 90%)',
              maskImage:
                'radial-gradient(circle at 50% 32%, rgba(1,1,1,1) 0%, rgba(1,1,1,0.7) 45%, rgba(1,1,1,0.05) 70%, transparent 90%)'
            }}
          >
            {/* Circuit grid behind fog, in a fixed-size, centered container to keep it stable */}
            <div className="pointer-events-none absolute top-[36%] left-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2"></div>
            <Fog />
          </div>
        </div>
        <LampFlickerProvider>
          <div className="relative z-20 flex w-full flex-col items-center pt-32">
            <h1
              className={cn('text-fg-main mb-8 text-center text-6xl font-bold')}
            >
              GPUCloud
            </h1>
            <div className="flex w-full justify-center">
              <HaloSearch
                value={searchQuery}
                onChange={setSearchQuery}
                onAddToCart={addItem}
              />
            </div>
            <div className="relative z-0 mt-10 h-52 w-full">
              {/* Gradients */}
              <div
                className="absolute top-0 left-1/2 h-[2px] w-3/4 -translate-x-1/2 blur-sm"
                style={{ background: heroAccentGradient }}
              />
              <div
                className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2"
                style={{ background: heroAccentGradient }}
              />
              <div
                className="absolute top-0 left-1/2 h-[5px] w-1/4 -translate-x-1/2 blur-sm"
                style={{ background: heroCyanGradient }}
              />
              <div
                className="absolute top-0 left-1/2 h-px w-1/4 -translate-x-1/2"
                style={{ background: heroCyanGlowGradient }}
              />
              <Streetlamp
                height="100%"
                className="h-full w-full"
                tipInsetPercent={0}
                featherEdges={true}
                motesProps={{
                  background: 'transparent',
                  minSize: 0.4,
                  maxSize: 1,
                  particleDensity: 50,
                  particleColor: '#F9FAFB'
                }}
              />
              {/* Radial Gradient to prevent sharp edges (transparent mask only, no black fill) */}
              <div className="pointer-events-none absolute inset-0 h-full w-full mask-[radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
            </div>
          </div>
          <div className="relative z-20 -mt-6 flex flex-col items-center gap-3 pt-4">
            <div className="flex gap-4">
              {cards.map((card, index) => (
                <FlickeringCard
                  key={index}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="group hover:text-fg-main flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-fg-main)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-bg-surface)_65%,transparent)] text-[color-mix(in_srgb,var(--color-fg-main)_70%,transparent)] transition hover:border-[color-mix(in_srgb,var(--color-fg-main)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-bg-surface)_85%,transparent)]"
                aria-label="Previous"
              >
                <span className="text-fg-main text-lg leading-none transition-transform group-hover:-translate-x-px">
                  ‹
                </span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="group hover:text-fg-main flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-fg-main)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-bg-surface)_65%,transparent)] text-[color-mix(in_srgb,var(--color-fg-main)_70%,transparent)] transition hover:border-[color-mix(in_srgb,var(--color-fg-main)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-bg-surface)_85%,transparent)]"
                aria-label="Next"
              >
                <span className="text-fg-main text-lg leading-none transition-transform group-hover:translate-x-px">
                  ›
                </span>
              </button>
            </div>
          </div>
        </LampFlickerProvider>
        <Card
          className="bg-card text-card-foreground w-[320px] overflow-clip border-[color-mix(in_srgb,var(--color-card-border)_100%,transparent)]"
          style={{
            boxShadow:
              '0 25px 80px color-mix(in srgb, var(--color-lamp-glow) 60%, transparent)'
          }}
        >
          <SpotlightArea
            spotlightMode="fixed"
            spotlightPosition={{ x: '80%', y: '40%' }}
            radius={250}
            revealOnHover={false}
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <CardTitle
                className={cn(
                  'text-fg-main pb-1 text-xl font-semibold tracking-tight'
                )}
              >
                Spotlight card
              </CardTitle>
              <div className="h-px w-full bg-[color-mix(in_srgb,var(--color-card-border)_65%,transparent)]" />
              <CardDescription
                className={cn('text-fg-soft text-sm leading-relaxed')}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam quos, natus illum eveniet corporis quam asperiores
                velit tempore odit.
              </CardDescription>
            </CardContent>
          </SpotlightArea>
        </Card>
      </div>

      {/* Contact Form Section */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mb-8">
          <div className="text-fg-soft mb-2 text-xs tracking-[0.2em] uppercase">
            Get in Touch
          </div>
          <h2 className="text-fg-main mb-2 text-2xl font-semibold">
            Request a Quote
          </h2>
          <p className="text-fg-soft max-w-2xl text-base">
            Share your GPU configuration requirements and we'll get back to you
            with a custom quote.
          </p>
        </div>

        <ContactWithCartForm />
      </section>
    </>
  );
}
