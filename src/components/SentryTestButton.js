import { useEffect, useState } from 'react';
import Sentry from '../services/sentry';
import analytics from '../services/analytics';

function SentryTestButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkFlag = () => {
      const isEnabled = analytics.isFeatureEnabled('show-error-button');
      setShowButton(!!isEnabled);
      // eslint-disable-next-line no-console
      console.log('Sentry test buttons feature flag:', isEnabled);
    };

    const immediate = analytics.isFeatureEnabled('show-error-test-buttons');
    if (immediate !== undefined) {
      setShowButton(!!immediate);
    } else {
      // Флаги ще не готові — чекаємо
      analytics.onFeatureFlags(checkFlag);
    }
  }, []);

  if (!showButton) return null;

  const throwSimpleError = () => {
    Sentry.captureException(new Error('Test Error: Something went wrong!'));
    alert('Error sent to Sentry! Check your dashboard.');
  };

  const throwContextError = () => {
    Sentry.captureException(new Error('Critical: Failed to save pet data'), {
      level: 'fatal',
      tags: {
        feature: 'pet-feeding',
        user_action: 'feed_button_click',
        test_type: 'manual',
      },
      contexts: {
        pet: {
          hunger_level: 5,
          money: 100,
          last_feed: '2 hours ago',
        },
      },
      extra: {
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
      },
    });
    alert('Critical error with context sent to Sentry!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Sentry Tests
      </div>

      <button
        onClick={throwSimpleError}
        style={{
          backgroundColor: '#FF6B6B',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 107, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
        }}
      >
        Simple Error
      </button>

      <button
        onClick={throwContextError}
        style={{
          backgroundColor: '#FF8C42',
          color: 'white',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(255, 140, 66, 0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(255, 140, 66, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)';
        }}
      >
        Critical Error
      </button>
    </div>
  );
}

export default SentryTestButton;
