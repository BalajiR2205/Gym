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
    <div className="min-h-screen bg-[#F0EEE9] pt-28 pb-20 flex items-center justify-center relative px-6 overflow-hidden">
      <div className="w-full max-w-2xl relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5F5F5A] hover:text-[#171717] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-[#171717]/8 rounded-3xl p-8 sm:p-12 shadow-editorial-lg"
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-[#171717] text-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CAD3C1] text-[#171717] text-[11px] font-bold uppercase tracking-wider mb-2">
                  Membership Sign-Up
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-[#171717] mb-2">
                  Begin Your Routine.
                </h1>
                <p className="text-sm text-[#5F5F5A] max-w-md leading-relaxed">
                  Fill in your details below to select your access plan. Our reception desk will contact you within 24 hours to confirm your induction.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`bg-[#F0EEE9] border rounded-xl px-4 py-3 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:bg-white transition-all ${
                        errors.fullName
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#171717]/10 focus:border-[#171717]"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 90000 00000"
                      className={`bg-[#F0EEE9] border rounded-xl px-4 py-3 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:bg-white transition-all ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#171717]/10 focus:border-[#171717]"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className={`bg-[#F0EEE9] border rounded-xl px-4 py-3 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:bg-white transition-all ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#171717]/10 focus:border-[#171717]"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1 font-medium">{errors.email}</span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
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
                      className={`bg-[#F0EEE9] border rounded-xl px-4 py-3 text-sm text-[#171717] placeholder:text-[#5F5F5A]/50 focus:outline-none focus:bg-white transition-all ${
                        errors.age
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#171717]/10 focus:border-[#171717]"
                      }`}
                    />
                    {errors.age && (
                      <span className="text-red-500 text-xs mt-1 font-medium">{errors.age}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col">
                    <label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="bg-[#F0EEE9] border border-[#171717]/10 text-[#171717] rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#171717] transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="plan" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Membership Plan
                    </label>
                    <select
                      id="plan"
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                      className="bg-[#F0EEE9] border border-[#171717]/10 text-[#171717] rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#171717] transition-all"
                    >
                      <option value="Monthly">Monthly (General Access)</option>
                      <option value="Quarterly">Quarterly (General Access)</option>
                      <option value="Half-Yearly">Half-Yearly (Popular)</option>
                      <option value="Annual">Annual (General Access)</option>
                      <option value="Personal Training">1-on-1 Personal Training</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="referral" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                      Referral Source
                    </label>
                    <select
                      id="referral"
                      name="referral"
                      value={formData.referral}
                      onChange={handleChange}
                      className="bg-[#F0EEE9] border border-[#171717]/10 text-[#171717] rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#171717] transition-all"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Friend">Friend / Member</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Google">Google Search</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="healthConditions" className="text-xs font-bold uppercase tracking-wider text-[#171717] mb-2">
                    Health Conditions / Injuries (Optional)
                  </label>
                  <textarea
                    id="healthConditions"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    rows={3}
                    placeholder="List any medical concerns, surgeries, or injuries our coaches should be aware of..."
                    className="bg-[#F0EEE9] border border-[#171717]/10 text-[#171717] rounded-xl px-4 py-3 text-sm placeholder:text-[#5F5F5A]/50 focus:outline-none focus:bg-white focus:border-[#171717] transition-all resize-none"
                  />
                </div>

                <div className="pt-2">
                  <CTAButton onClick={() => handleSubmit()} className="w-full py-4 text-xs font-bold tracking-wider">
                    Submit Registration
                  </CTAButton>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="bg-white border border-[#171717]/10 rounded-3xl p-8 md:p-12 text-center shadow-editorial-lg flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#CAD3C1] text-[#171717] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h1 className="text-3xl font-display font-extrabold tracking-tight text-[#171717] mb-3">
                Welcome Aboard, {formData.fullName.split(" ")[0]}!
              </h1>
              <p className="text-[#5F5F5A] text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                Your application for the <span className="font-bold text-[#171717]">{formData.plan}</span> has been logged. Our front desk team will contact you shortly.
              </p>

              <div className="w-full max-w-md bg-[#F8F6F2] border border-[#171717]/8 rounded-2xl p-6 mb-8 text-left space-y-3">
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#171717] border-b border-black/5 pb-2 mb-2">
                  Registration Summary
                </h4>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-[#5F5F5A]">Contact:</span>
                  <span className="text-[#171717] font-semibold">{formData.phone}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-[#5F5F5A]">Email:</span>
                  <span className="text-[#171717] font-semibold truncate ml-2">{formData.email}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-[#5F5F5A]">Selected Term:</span>
                  <span className="text-[#171717] font-semibold">{formData.plan}</span>
                </div>
              </div>

              <CTAButton href="/" variant="outline" className="w-full sm:w-auto">
                Return to Homepage
              </CTAButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
