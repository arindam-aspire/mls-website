import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

let navigateRef: AppRouterInstance | null = null;

export const initializeNavigation = (router: AppRouterInstance) => {
  navigateRef = router;
};

export const navigateTo = (path: string) => {
  if (!navigateRef) {
    console.warn('Navigation not initialized. Falling back to window.location');
    window.location.href = path;
    return;
  }
  navigateRef.push(path);
};

export const navigateReplace = (path: string) => {
  if (!navigateRef) {
    window.location.href = path;
    return;
  }
  navigateRef.replace(path);
};

export const navigateBack = () => {
  if (!navigateRef) return;
  navigateRef.back();
};