import {
  Inter,
  JetBrains_Mono,
  Oxanium,
  Space_Grotesk
} from 'next/font/google';

export const fontDisplay = Oxanium({
  subsets: ['latin'],
  variable: '--font-display'
});

export const fontUi = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-ui'
});

export const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body'
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});
