import posthog from 'posthog-js';

const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
      // На production використовуємо проксі (наш домен)
      api_host:
        process.env.REACT_APP_ENV === 'production'
          ? window.location.origin // https://your-app.vercel.app
          : 'https://eu.i.posthog.com', // ← ВИПРАВЛЕНО тут

      // UI завжди на EU PostHog
      ui_host: 'https://eu.posthog.com', // ← Залишається eu.posthog.com (без i)

      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,

      loaded: (posthog) => {
        if (process.env.REACT_APP_ENV === 'development') {
          posthog.debug();
          // eslint-disable-next-line no-console
          console.log('PostHog host:', posthog.get_config('api_host'));
        }
      },
    });
  }

  return posthog;
};

export const analytics = {
  init: initPostHog,

  capture: (eventName, properties = {}) => {
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  },

  identify: (userId, traits = {}) => {
    if (posthog.__loaded) {
      posthog.identify(userId, traits);
    }
  },

  reset: () => {
    if (posthog.__loaded) {
      posthog.reset();
    }
  },

  isFeatureEnabled: (flagKey) => {
    if (posthog.__loaded) {
      return posthog.isFeatureEnabled(flagKey);
    }
    return false;
  },

  onFeatureFlags: (callback) => {
    if (posthog.__loaded) {
      posthog.onFeatureFlags(callback);
    }
  },
};

export default analytics;
