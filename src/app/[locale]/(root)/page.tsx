import type { Metadata } from 'next';
import Link from 'next/link';

import { ContactForm } from '@/components/forms/contactForm';
import Footer from '@/components/layout-navigation/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from '@/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HOME');
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function Home() {
  const t = await getTranslations('HOME');

  return (
    <>
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="grid-overlay" />
        <div className="neon-orb orb-1" />
        <div className="neon-orb orb-2" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-6xl px-5 pt-6 pb-16 sm:px-6">
        {/* Hero Section */}
        <section
          id="hero"
          className="flex min-h-[calc(100vh-64px)] flex-col justify-center py-16"
        >
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xs tracking-[0.2em] text-cyan-300 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-linear-to-br from-cyan-400 to-pink-500 shadow-[0_0_12px_rgba(0,255,255,0.8)]" />
                {t('hero.eyebrow')}
              </div>

              <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
                {t('hero.headline')}{' '}
                <span className="bg-linear-to-r from-cyan-400 via-cyan-300 to-pink-500 bg-clip-text text-transparent">
                  {t('hero.headlineHighlight')}
                </span>
              </h1>

              <p className="mb-6 max-w-2xl text-base text-slate-300">
                {t('hero.subtitle')}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/16 to-transparent px-3 py-1.5 text-xs tracking-widest text-cyan-200 uppercase"
                >
                  {t('hero.tags.consulting')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/16 to-transparent px-3 py-1.5 text-xs tracking-widest text-cyan-200 uppercase"
                >
                  {t('hero.tags.orchestration')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/16 to-transparent px-3 py-1.5 text-xs tracking-widest text-cyan-200 uppercase"
                >
                  {t('hero.tags.hybrid')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/16 to-transparent px-3 py-1.5 text-xs tracking-widest text-cyan-200 uppercase"
                >
                  {t('hero.tags.sourcing')}
                </Badge>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="rounded-full bg-linear-to-br from-cyan-400 to-blue-600 px-6 py-3 text-sm tracking-widest text-slate-950 uppercase shadow-[0_0_22px_rgba(0,255,255,0.9),0_0_46px_rgba(0,0,0,0.9)] transition-all duration-200 hover:from-cyan-400 hover:to-pink-500 hover:shadow-[0_0_30px_rgba(0,255,255,1),0_0_52px_rgba(0,0,0,1)]"
                >
                  <Link href="#contact">{t('hero.cta.primary')}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-gradient-radial hover:bg-gradient-radial rounded-full border-cyan-400/50 from-cyan-400/5 to-transparent px-6 py-3 text-sm tracking-widest text-slate-300 uppercase transition-all duration-200 hover:border-pink-500/80 hover:from-pink-500/16 hover:to-transparent hover:shadow-[0_0_18px_rgba(255,46,168,0.8),0_0_32px_rgba(0,0,0,0.9)]"
                >
                  <Link href="#about">{t('hero.cta.secondary')}</Link>
                </Button>
              </div>

              <div className="text-xs text-slate-400">{t('hero.meta')}</div>
            </div>

            {/* Hero Card */}
            <Card className="hero-card relative overflow-hidden rounded-3xl border-cyan-400/35 bg-linear-to-br from-cyan-400/20 via-slate-950/90 to-slate-950/90 p-5 shadow-[0_0_24px_rgba(0,255,255,0.4),0_0_48px_rgba(0,0,0,0.95)]">
              <CardContent className="relative z-10 p-0">
                <div className="mb-3 flex items-center gap-2 text-sm tracking-[0.18em] text-cyan-300 uppercase">
                  {t('hero.card.title')}
                  <Badge className="rounded-full border border-white/16 bg-black/40 px-2 py-0.5 text-[0.6rem] tracking-widest text-cyan-200 uppercase">
                    {t('hero.card.badge')}
                  </Badge>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-cyan-400/35 bg-slate-950/85 p-3 shadow-[0_0_14px_rgba(0,255,255,0.45)]">
                    <div className="mb-1 text-[0.65rem] tracking-widest text-slate-400 uppercase">
                      {t('hero.card.metrics.utilization.label')}
                    </div>
                    <div className="text-lg font-semibold">
                      {t('hero.card.metrics.utilization.value')}
                    </div>
                    <div className="mt-0.5 text-[0.68rem] text-slate-500">
                      {t('hero.card.metrics.utilization.sub')}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/35 bg-slate-950/85 p-3 shadow-[0_0_14px_rgba(0,255,255,0.45)]">
                    <div className="mb-1 text-[0.65rem] tracking-widest text-slate-400 uppercase">
                      {t('hero.card.metrics.spend.label')}
                    </div>
                    <div className="text-lg font-semibold">
                      {t('hero.card.metrics.spend.value')}
                    </div>
                    <div className="mt-0.5 text-[0.68rem] text-slate-500">
                      {t('hero.card.metrics.spend.sub')}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300">
                  {t('hero.card.footnote')}{' '}
                  <span className="text-pink-300">
                    {t('hero.card.footnoteHighlight')}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="mb-8">
            <div className="mb-2 text-xs tracking-[0.2em] text-cyan-300 uppercase">
              {t('about.eyebrow')}
            </div>
            <h2 className="mb-2 text-2xl font-semibold">{t('about.title')}</h2>
            <p className="max-w-2xl text-base text-slate-400">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="mb-4 text-slate-300">{t('about.text.intro')}</p>
              <p className="mb-4 text-slate-300">{t('about.text.mission')}</p>
              <p className="mb-4 text-slate-300">{t('about.text.approach')}</p>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/10 to-transparent px-3 py-1.5 text-xs text-cyan-200"
                >
                  {t('about.pills.strategy')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/10 to-transparent px-3 py-1.5 text-xs text-cyan-200"
                >
                  {t('about.pills.design')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/10 to-transparent px-3 py-1.5 text-xs text-cyan-200"
                >
                  {t('about.pills.network')}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gradient-radial rounded-full border-cyan-400/30 from-cyan-400/10 to-transparent px-3 py-1.5 text-xs text-cyan-200"
                >
                  {t('about.pills.optimization')}
                </Badge>
              </div>
            </div>

            <Card className="rounded-2xl border-cyan-400/40 bg-linear-to-br from-slate-900/95 via-slate-900/90 to-slate-950/90 p-4 shadow-[0_0_22px_rgba(0,255,255,0.4),0_0_32px_rgba(0,0,0,0.9)]">
              <CardContent className="p-0">
                <h3 className="mb-3 text-sm tracking-[0.16em] text-cyan-300 uppercase">
                  {t('about.card.title')}
                </h3>

                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-cyan-400 to-pink-500 shadow-[0_0_10px_rgba(0,255,255,0.7)]" />
                    <span>
                      <strong>
                        {t('about.card.items.orchestration.title')}
                      </strong>{' '}
                      {t('about.card.items.orchestration.text')}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-cyan-400 to-pink-500 shadow-[0_0_10px_rgba(0,255,255,0.7)]" />
                    <span>
                      <strong>{t('about.card.items.hybrid.title')}</strong>{' '}
                      {t('about.card.items.hybrid.text')}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-cyan-400 to-pink-500 shadow-[0_0_10px_rgba(0,255,255,0.7)]" />
                    <span>
                      <strong>{t('about.card.items.sourcing.title')}</strong>{' '}
                      {t('about.card.items.sourcing.text')}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-cyan-400 to-pink-500 shadow-[0_0_10px_rgba(0,255,255,0.7)]" />
                    <span>
                      <strong>{t('about.card.items.alignment.title')}</strong>{' '}
                      {t('about.card.items.alignment.text')}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="mb-8">
            <div className="mb-2 text-xs tracking-[0.2em] text-cyan-300 uppercase">
              {t('contact.eyebrow')}
            </div>
            <h2 className="mb-2 text-2xl font-semibold">
              {t('contact.title')}
            </h2>
            <p className="max-w-2xl text-base text-slate-400">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-2">
            <div className="text-slate-300">
              <p className="mb-4">{t('contact.text.intro')}</p>

              <p className="mb-2">{t('contact.text.helpTitle')}</p>
              <ul className="mb-4 ml-4 space-y-1 text-sm">
                <li>{t('contact.text.helpItems.ai')}</li>
                <li>{t('contact.text.helpItems.startups')}</li>
                <li>{t('contact.text.helpItems.companies')}</li>
              </ul>

              <p className="mb-4">{t('contact.text.response')}</p>

              <div className="mt-2 text-sm text-slate-400">
                {t('contact.text.email')}{' '}
                <a
                  href="mailto:shrey@gpucloud.store"
                  className="font-medium text-cyan-300 hover:underline"
                >
                  {t('contact.text.emailAddress')}
                </a>
                .
              </div>
            </div>

            <ContactForm
              translations={{
                name: {
                  label: t('contact.form.name.label'),
                  placeholder: t('contact.form.name.placeholder')
                },
                company: {
                  label: t('contact.form.company.label'),
                  placeholder: t('contact.form.company.placeholder')
                },
                email: {
                  label: t('contact.form.email.label'),
                  placeholder: t('contact.form.email.placeholder')
                },
                role: {
                  label: t('contact.form.role.label'),
                  placeholder: t('contact.form.role.placeholder')
                },
                message: {
                  label: t('contact.form.message.label'),
                  placeholder: t('contact.form.message.placeholder')
                },
                hint: t('contact.form.hint'),
                submit: t('contact.form.submit'),
                submitting: t('contact.form.submitting'),
                success: t('contact.form.success'),
                error: t('contact.form.error'),
                networkError: t('contact.form.networkError'),
                submitError: t('contact.form.submitError')
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
