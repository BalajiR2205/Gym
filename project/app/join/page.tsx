"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CTAButton from "@/components/ui/CTAButton";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  plan: string;
  referral: string;
  healthConditions: string;
}

const INITIAL_FORM_STATE: FormData = {
  fullName: "",
  phone: "",
  email: "",
  age: "",
  gender: "Male",
  plan: "Quarterly",
  referral: "Walk-in",
  healthConditions: "",
};

export default function JoinNowPage() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const parsedAge = parseInt(formData.age, 10);
      if (isNaN(parsedAge) || parsedAge < 12 || parsedAge > 100) {
        newErrors.age = "Age must be between 12 and 100";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-28 pb-20 flex items-center justify-center relative px-6 overflow-hidden">
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[rgba(212,175,55,0.02)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[rgba(212,175,55,0.02)] rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#BDBDBD] hover:text-[#D4AF37] transition-colors duration-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          Back to Homepage
        </Link>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#141414] border border-[rgba(212,175,55,0.08)] rounded-2xl p-8 md:p-10 shadow-gold-elevated"
            >
              <div className="flex flex-col items-center text-center mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-[#F5E6A3] via-[#D4AF37] to-[#8B6914] rounded-full flex items-center justify-center text-[#0A0A0A] mb-5 shadow-luxury-lg">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-3">
                  Begin Your Journey
                </h1>
                <p className="text-sm text-[#BDBDBD] max-w-md leading-[1.7]">
                  Fill out the form below to lock in your membership. Our team will contact you within 24 hours to complete your registration.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="fullName" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`bg-[#1A1A1A] border rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-[#525252] focus:outline-none transition-all duration-400 ${
                        errors.fullName
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-[rgba(212,175,55,0.08)] focus:border-[#D4AF37]"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-red-400 text-xs mt-2">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90000 00000"
                      className={`bg-[#1A1A1A] border rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-[#525252] focus:outline-none transition-all duration-400 ${
                        errors.phone
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-[rgba(212,175,55,0.08)] focus:border-[#D4AF37]"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-red-400 text-xs mt-2">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className={`bg-[#1A1A1A] border rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-[#525252] focus:outline-none transition-all duration-400 ${
                        errors.email
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-[rgba(212,175,55,0.08)] focus:border-[#D4AF37]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-400 text-xs mt-2">{errors.email}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="age" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Age
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      min="12"
                      max="100"
                      className={`bg-[#1A1A1A] border rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-[#525252] focus:outline-none transition-all duration-400 ${
                        errors.age
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-[rgba(212,175,55,0.08)] focus:border-[#D4AF37]"
                      }`}
                    />
                    {errors.age && (
                      <span className="text-red-400 text-xs mt-2">{errors.age}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="gender" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] text-white rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-all duration-400 appearance-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="plan" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      Membership Plan
                    </label>
                    <select
                      id="plan"
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] text-white rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-all duration-400 appearance-none"
                    >
                      <option value="Monthly">Monthly Plan</option>
                      <option value="Quarterly">Quarterly Plan</option>
                      <option value="Annual">Annual Plan</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="referral" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                      How did you hear about us?
                    </label>
                    <select
                      id="referral"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] text-white rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37] transition-all duration-400 appearance-none"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Friend">Friend</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Google">Google</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="healthConditions" className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#BDBDBD] mb-2.5">
                    Health Conditions / Injuries (Optional)
                  </label>
                  <textarea
                    id="healthConditions"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    rows={4}
                    placeholder="List any medical concerns, surgeries, or injuries our coaches should know about..."
                    className="bg-[#1A1A1A] border border-[rgba(212,175,55,0.08)] text-white rounded-lg px-4 py-3.5 text-sm placeholder:text-[#525252] focus:outline-none focus:border-[#D4AF37] transition-all duration-400 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <CTAButton onClick={() => handleSubmit()} className="w-full">
                    Submit Registration
                  </CTAButton>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="bg-[#141414] border border-[rgba(212,175,55,0.1)] rounded-2xl p-8 md:p-12 text-center shadow-gold-elevated flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.15 }}
                className="w-20 h-20 bg-[rgba(212,175,55,0.08)] text-[#D4AF37] rounded-full flex items-center justify-center mb-7 border border-[rgba(212,175,55,0.15)]"
              >
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-white mb-4">
                Congratulations, {formData.fullName.split(" ")[0]}!
              </h1>
              <p className="text-[#BDBDBD] text-base max-w-md mb-10 leading-[1.7]">
                Your application for the <span className="text-white font-semibold">{formData.plan} Plan</span> has been successfully logged.
              </p>

              <div className="w-full max-w-md bg-[#0A0A0A] border border-[rgba(212,175,55,0.06)] rounded-xl p-6 mb-10 text-left space-y-3.5">
                <h4 className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D4AF37] border-b border-[rgba(212,175,55,0.08)] pb-3 mb-3">
                  Registration Summary
                </h4>
                <div className="grid grid-cols-2 text-xs md:text-sm py-1.5">
                  <span className="text-[#525252]">Contact:</span>
                  <span className="text-white text-right font-medium">{formData.phone}</span>
                </div>
                <div className="grid grid-cols-2 text-xs md:text-sm py-1.5">
                  <span className="text-[#525252]">Email:</span>
                  <span className="text-white text-right font-medium truncate ml-2">{formData.email}</span>
                </div>
                <div className="grid grid-cols-2 text-xs md:text-sm py-1.5">
                  <span className="text-[#525252]">Membership Term:</span>
                  <span className="text-white text-right font-medium">{formData.plan}</span>
                </div>
              </div>

              <CTAButton href="/" variant="outline" className="w-full sm:w-auto">
                Return to Home
              </CTAButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
