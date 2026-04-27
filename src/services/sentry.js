import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    tracesSampleRate: 0.1,

    replaysSessionSampleRate: 0.1, // 10% звичайних сесій
    replaysOnErrorSampleRate: 1.0, // 100% сесій з помилками

    environment: process.env.REACT_APP_ENV || 'development',

    release: `focus-pet@${process.env.REACT_APP_VERSION || '1.0.0'}`,

    beforeSend(event, _hint) {
      // eslint-disable-next-line no-console
      console.log('Sentry capturing error:', event);
      return event;
    },
  });

  // eslint-disable-next-line no-console
  console.log('Sentry initialized');
};

export default Sentry;
