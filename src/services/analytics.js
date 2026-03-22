import posthog from 'posthog-js';

const initPostHog = () => {
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    const POSTHOG_KEY = 'phc_hvotIm0QOtYXtm9U2ZsV3FTYQNtiy9b7nXAYx9DkfIk';

    posthog.init(POSTHOG_KEY, {
      // Використовуємо PostHog напряму (без проксі)
      api_host: 'https://eu.i.posthog.com',
      ui_host: 'https://eu.posthog.com',

      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    });

    // eslint-disable-next-line no-console
    console.log('PostHog initialized');
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
