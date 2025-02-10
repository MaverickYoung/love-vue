import { defineStore } from 'pinia';
import cache from '@/utlis/cache';
import { applyTheme, ThemeConfig } from '@/utlis/theme';

export const useAppStore = defineStore('appStore', {
  state: () => ({
    theme: cache.getTheme(),
  }),
  getters: {
    getIsLight(): boolean {
      return this.theme.isLight;
    },
  },
  actions: {
    setTheme(theme: ThemeConfig): void {
      this.theme = theme;
      cache.setTheme(theme);
      applyTheme(theme);
    },
  },
});
