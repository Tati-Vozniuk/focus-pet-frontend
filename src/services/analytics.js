import posthog from 'posthog-js';

// Ініціалізація PostHog
const initPostHog = () => {
  // Перевірка чи вже ініціалізовано
  if (typeof window !== 'undefined' && !posthog.__loaded) {
    posthog.init(process.env.REACT_APP_POSTHOG_KEY, {
      api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://eu.posthog.com',
      person_profiles: 'identified_only', // Відстежувати тільки ідентифікованих
      capture_pageview: true, // Автоматичний pageview
      capture_pageleave: true, // Коли користувач йде зі сторінки
      autocapture: true, // Автоматичне відстеження кліків

      // Налаштування для обходу блокувальників (опціонально)
      // ui_host: 'https://eu.posthog.com',

      // Debug режим (тільки в dev)
      loaded: (posthog) => {
        if (process.env.REACT_APP_ENV === 'development') {
          posthog.debug();
        }
      },
    });
  }

  return posthog;
};

// Експорт функцій для використання
export const analytics = {
  // Ініціалізація
  init: initPostHog,

  // Відстеження події
  capture: (eventName, properties = {}) => {
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  },

  // Ідентифікація користувача
  identify: (userId, traits = {}) => {
    if (posthog.__loaded) {
      posthog.identify(userId, traits);
    }
  },

  // Скидання (logout)
  reset: () => {
    if (posthog.__loaded) {
      posthog.reset();
    }
  },

  // Перевірка feature flag
  isFeatureEnabled: (flagKey) => {
    if (posthog.__loaded) {
      return posthog.isFeatureEnabled(flagKey);
    }
    return false;
  },

  // Callback коли feature flags завантажені
  onFeatureFlags: (callback) => {
    if (posthog.__loaded) {
      posthog.onFeatureFlags(callback);
    }
  },
};

export default analytics;
