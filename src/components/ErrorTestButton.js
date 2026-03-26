import Sentry from '../services/sentry';

function ErrorTestButton() {
  // Тест 1: JavaScript помилка
  const throwJSError = () => {
    throw new Error('Sentry Test Error: Something went wrong!');
  };

  // Тест 2: Async помилка
  const throwAsyncError = async () => {
    try {
      // Симулюємо API помилку
      const response = await fetch('https://api.example.com/nonexistent');
      if (!response.ok) {
        throw new Error('API Error: Failed to fetch data');
      }
    } catch (error) {
      Sentry.captureException(error);
      alert('Error captured by Sentry! Check your dashboard.');
    }
  };

  // Тест 3: Критична помилка з контекстом
  const throwCriticalError = () => {
    Sentry.captureException(new Error('Critical failure: Unable to save pet data'), {
      level: 'fatal',
      tags: {
        feature: 'pet-feeding',
        user_action: 'feed_button_click',
      },
      contexts: {
        pet: {
          name: 'Fluffy',
          hunger_level: 10,
          money: 50,
        },
      },
    });
    alert('Critical error sent to Sentry!');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '60px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999,
      }}
    >
      <button
        onClick={throwJSError}
        style={{
          backgroundColor: '#FF4444',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Break the World
      </button>

      <button
        onClick={throwAsyncError}
        style={{
          backgroundColor: '#FF8800',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        API Error
      </button>

      <button
        onClick={throwCriticalError}
        style={{
          backgroundColor: '#CC0000',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        Critical Error
      </button>
    </div>
  );
}

export default ErrorTestButton;
