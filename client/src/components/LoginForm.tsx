import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Captcha from "./Captcha";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  captchaText: z.string().min(1, "Captcha text is required"),
  captchaType: z.enum(["image", "audio"]).default("image")
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [captchaType, setCaptchaType] = useState<"image" | "audio">("image");
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      mobile: "",
      captchaText: "",
      captchaType: "image"
    },
  });

  function onSubmit(values: LoginFormValues) {
    console.log(values);
  }

  function resetForm() {
    form.reset();
  }

  function handleCaptchaTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCaptchaType(e.target.value as "image" | "audio");
  }

  return (
    <div className="bg-[#e6f2f7] p-4">
      <div className="text-red-600 text-sm mb-4">
        (CARE: Username and password sensitive)
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Username field */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-sm font-bold">
            Username<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="username"
            {...form.register("username")}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        
        {/* Password field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-bold">
            Password<span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            id="password"
            {...form.register("password")}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        
        {/* Mobile field */}
        <div className="space-y-1">
          <label htmlFor="mobile" className="block text-sm font-bold">
            Mobile<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="mobile"
            {...form.register("mobile")}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        
        {/* Captcha Text Field */}
        <div className="space-y-1">
          <label htmlFor="captchaText" className="block text-sm font-bold">
            Enter the text shown in the image<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="captchaText"
            {...form.register("captchaText")}
            className="w-full p-2 border border-gray-300"
          />
        </div>
        
        {/* Captcha Selection */}
        <div className="space-y-2">
          <div className="text-sm font-bold">
            Select any of the Captcha
          </div>
          
          <div className="flex items-start space-x-8">
            <div className="flex items-center">
              <input
                type="radio"
                id="imageCaptcha"
                {...form.register("captchaType")}
                value="image"
                checked={captchaType === "image"}
                onChange={handleCaptchaTypeChange}
                className="mr-1"
              />
              <label htmlFor="imageCaptcha" className="text-sm text-blue-700">Image Captcha</label>
            </div>
            
            <div className="flex items-center">
              <input
                type="radio"
                id="audioCaptcha"
                {...form.register("captchaType")}
                value="audio"
                checked={captchaType === "audio"}
                onChange={handleCaptchaTypeChange}
                className="mr-1"
              />
              <label htmlFor="audioCaptcha" className="text-sm text-red-700">Audio Captcha</label>
            </div>
          </div>
          
          {/* Captcha Display */}
          <Captcha type={captchaType} />
        </div>
        
        {/* Form Buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-[#336699] text-white px-5 py-1 text-sm font-bold uppercase"
          >
            LOGIN
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="bg-[#6c757d] text-white px-5 py-1 text-sm font-bold uppercase"
          >
            RESET
          </button>
        </div>
      </form>
      
      {/* Links */}
      <div className="mt-4 space-y-1">
        <div>
          <a href="#" className="text-blue-700 text-sm">Register Customer</a>
        </div>
        <div>
          <a href="#" className="text-blue-700 text-sm">Forgot Password</a>
        </div>
      </div>
      
      {/* Security Information */}
      <div className="mt-6 text-xs text-gray-600 space-y-1">
        <ul className="list-disc pl-4">
          <li>Mandatory fields are indicated with an asterisk (*).</li>
          <li>Please refrain from sharing your personal information, including your user ID and password, on any other page or platform.</li>
          <li>Never click on suspicious links sent through SMS or other apps. Contact customer support for assistance.</li>
        </ul>
      </div>
    </div>
  );
}
