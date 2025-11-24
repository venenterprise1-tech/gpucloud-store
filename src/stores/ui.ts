/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { create } from 'zustand';

import { linksConfig } from '@/components/layout-navigation/links';
import type { NavLinks } from '@/components/layout-navigation/useLinks';
import {
  isSupportedTheme,
  type SupportedTheme
} from '@/components/useThemeMode';

type IndependentVisibilities = 'hero';
type BlockingVisibilities = 'anchors';

export interface UIStoreState {
  theme: SupportedTheme;
  setTheme: (theme: string) => boolean;
  visibilities: {
    [K in IndependentVisibilities]: boolean;
  } & { [K in BlockingVisibilities]: Array<string> };
  setVisibilities: (
    updater: (
      visibilities: UIStoreState['visibilities']
    ) => Partial<UIStoreState['visibilities']>
  ) => void;
}

export const useUIStore = create<UIStoreState>((set, _get) => ({
  theme: 'dark',
  setTheme: theme => {
    if (isSupportedTheme(theme)) {
      set({ theme });
      return true;
    }

    return false;
  },
  visibilities: {
    hero: true,
    anchors: []
  },
  setVisibilities: updater => {
    set(state => ({
      visibilities: {
        ...state.visibilities,
        ...updater(state.visibilities)
      }
    }));
  }
}));
