export type NavigationIntentAction = "push" | "back" | "replace" | "reload";

export type NavigationIntent = {
  href: string;
  action: NavigationIntentAction;
};

type NavigationInterceptor = (intent: NavigationIntent) => boolean;

const interceptors = new Set<NavigationInterceptor>();

export function registerNavigationInterceptor(
  interceptor: NavigationInterceptor,
): () => void {
  interceptors.add(interceptor);

  return () => {
    interceptors.delete(interceptor);
  };
}

export function runNavigationInterceptors(intent: NavigationIntent): boolean {
  for (const interceptor of interceptors) {
    if (!interceptor(intent)) {
      return false;
    }
  }

  return true;
}
