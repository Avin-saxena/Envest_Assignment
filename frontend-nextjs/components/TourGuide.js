import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Joyride, { STATUS, EVENTS } from 'react-joyride';

const TourGuide = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  // Check if user has seen the tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('insightfolio_tour_completed');
    if (!hasSeenTour && router.pathname === '/') {
      // Delay to ensure components are rendered
      setTimeout(() => setRun(true), 1000);
    }
  }, [router.pathname]);

  // Set global tour state for other components to use
  useEffect(() => {
    window.tourIsRunning = run;
    return () => {
      window.tourIsRunning = false;
    };
  }, [run]);

  const steps = [
    {
      target: 'body',
      content: (
        <div>
          <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            Welcome to Insightfolio! 🎉
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Your AI-powered financial news companion for Indian stock markets. 
            Let's take a quick tour to help you get started with smart investing insights.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '#financial-news-dashboard',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            📈 Financial News Dashboard
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            This is your main dashboard where all the latest financial news from trusted sources like Economic Times and LiveMint is displayed. 
            Stay updated with real-time market information.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.news-grid .analyze-ai-button',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            🤖 AI Analysis Feature
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Click "Analyze with AI" on any news card to get intelligent insights about how this news might impact your investments. 
            Our AI analyzes sentiment and provides actionable insights.
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            💼 Let's Set Up Your Portfolio
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Now let's go to the Portfolio page where you can add your stocks. 
            This enables personalized news filtering and targeted AI analysis for your investments.
          </p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '#add-stock-section',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            ✨ Add Your Stocks
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Search and add stocks to your portfolio here. You can add multiple stocks from our comprehensive database of 500+ Indian companies. 
            Try searching by company name, stock symbol, or even sector!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            🎯 Time for Filtered News
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Finally, let's explore the Filtered News page where you'll see news specifically related to your portfolio stocks 
            with comprehensive AI analysis and sentiment insights.
          </p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '#analyze-all-button',
      content: (
        <div>
          <h3 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
            🚀 Analyze All Feature
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            Click "Analyze All" to get a comprehensive AI analysis of all news articles related to your portfolio. 
            Get sentiment breakdown, stock-specific insights, and overall portfolio impact assessment!
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div>
          <h2 style={{ marginBottom: '12px', fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            🎊 Tour Complete!
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
            You're all set! Start by adding some stocks to your portfolio, then explore personalized news and AI insights. 
            Happy investing with Insightfolio!
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, type, index, action } = data;

    // Handle close button click
    if (action === 'close' || status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      window.tourIsRunning = false;
      localStorage.setItem('insightfolio_tour_completed', 'true');
      router.push('/'); // Return to main page
      return;
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Handle navigation based on step and action (next/prev)
      if (action === 'next') {
        // Forward navigation
        if (index === 2) {
          // After AI analysis step, go to portfolio
          router.push('/portfolio');
          setTimeout(() => setStepIndex(index + 1), 500);
        } else if (index === 4) {
          // After add stocks step, go to filtered news
          router.push('/filtered');
          setTimeout(() => setStepIndex(index + 1), 500);
        } else if (index === 5) {
          // Stay on filtered page for analyze all step
          setTimeout(() => setStepIndex(index + 1), 100);
        } else {
          setStepIndex(index + 1);
        }
      } else if (action === 'prev') {
        // Backward navigation
        if (index === 6) {
          // From analyze all step, stay on filtered page (going to filtered intro)
          setTimeout(() => setStepIndex(index - 1), 100);
        } else if (index === 5) {
          // From filtered news intro, go back to portfolio (going to add stocks step)
          router.push('/portfolio');
          setTimeout(() => setStepIndex(index - 1), 500);
        } else if (index === 4) {
          // From add stocks step, stay on portfolio (going to portfolio intro)
          setTimeout(() => setStepIndex(index - 1), 100);
        } else if (index === 3) {
          // From portfolio intro, go back to dashboard (going to AI analysis step)
          router.push('/');
          setTimeout(() => setStepIndex(index - 1), 500);
        } else {
          setStepIndex(index - 1);
        }
      }
    }
  };

  const resetTour = () => {
    localStorage.removeItem('insightfolio_tour_completed');
    setStepIndex(0);
    setRun(true);
    router.push('/');
  };

  // Expose reset function globally for manual trigger
  useEffect(() => {
    window.startInsightfolioTour = resetTour;
    return () => delete window.startInsightfolioTour;
  }, []);

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          backgroundColor: '#ffffff',
          borderRadius: 12,
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
          beaconSize: 40,
        },
        tooltip: {
          borderRadius: 12,
          fontSize: 16,
          padding: 20,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 600,
          marginBottom: 8,
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          padding: '10px 20px',
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
          fontSize: 14,
          fontWeight: 500,
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: 14,
          fontWeight: 500,
        },
        buttonClose: {
          color: '#6b7280',
          fontSize: 14,
          fontWeight: 500,
        },
                spotlight: {
          borderRadius: 8,
          border: '3px solid #3b82f6',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
       
        },
      }}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      callback={handleJoyrideCallback}
      disableOverlayClose={false}
      disableCloseOnEsc={false}
      hideCloseButton={false}
      scrollToFirstStep={true}
      scrollOffset={100}
    />
  );
};

export default TourGuide; 