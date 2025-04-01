import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  type: "image" | "audio";
}

export default function Captcha({ type }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState("b26kz");

  const generateCaptchaText = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptchaText());
  };

  useEffect(() => {
    refreshCaptcha();
  }, [type]);

  return (
    <div className="flex items-center space-x-2">
      <div className="captcha-img">{captchaText}</div>
      <button 
        type="button" 
        onClick={refreshCaptcha}
        className="text-gray-500"
      >
        <RefreshCw className="h-5 w-5" />
      </button>
    </div>
  );
}
