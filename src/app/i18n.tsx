'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Lang = 'en' | 'ur';

type Dict = Record<string, { en: string; ur: string }>;

// Translation dictionary for the viewer-facing / functional pages.
const DICT: Dict = {
  // Navbar
  nav_about: { en: 'About', ur: 'تعارف' },
  nav_benefits: { en: 'Benefits', ur: 'فوائد' },
  nav_divisions: { en: 'Divisions', ur: 'کیٹیگریز' },
  nav_prizes: { en: 'Prizes', ur: 'انعامات' },
  nav_schedule: { en: 'Schedule', ur: 'شیڈول' },
  nav_gallery: { en: 'Gallery', ur: 'گیلری' },
  nav_faq: { en: 'FAQ', ur: 'سوالات' },
  nav_contact: { en: 'Contact', ur: 'رابطہ' },
  watch_live: { en: 'Watch Live', ur: 'لائیو دیکھیں' },
  register_now: { en: 'Register Now', ur: 'رجسٹر کریں' },
  check_status: { en: 'Check Status', ur: 'اسٹیٹس دیکھیں' },

  // Hero carousel
  now_open: { en: 'Now Open for Registration', ur: 'رجسٹریشن جاری ہے' },
  register_for_this: { en: 'Register for this Competition', ur: 'اس مقابلے کے لیے رجسٹر کریں' },
  prize_pool: { en: 'Prize Pool', ur: 'انعامی رقم' },
  no_comps: { en: 'No competitions are open for registration right now. Check back soon.', ur: 'فی الحال کوئی مقابلہ رجسٹریشن کے لیے کھلا نہیں ہے۔ بعد میں دوبارہ دیکھیں۔' },

  // Registration form
  reg_title: { en: 'Athlete Registration', ur: 'کھلاڑی رجسٹریشن' },
  reg_for: { en: 'Registering for', ur: 'رجسٹریشن برائے' },
  reg_select_hint: { en: 'Select the competition and fill in your details.', ur: 'مقابلہ منتخب کریں اور اپنی تفصیلات درج کریں۔' },
  competition: { en: 'Competition', ur: 'مقابلہ' },
  select_competition: { en: '— Select a competition —', ur: '— مقابلہ منتخب کریں —' },
  loading_comps: { en: 'Loading competitions…', ur: 'مقابلے لوڈ ہو رہے ہیں…' },
  full_name: { en: 'Full Name', ur: 'پورا نام' },
  father_name: { en: 'Father Name', ur: 'والد کا نام' },
  phone: { en: 'Phone Number', ur: 'فون نمبر' },
  email: { en: 'Email Address', ur: 'ای میل' },
  age: { en: 'Age', ur: 'عمر' },
  city: { en: 'City', ur: 'شہر' },
  club: { en: 'Club Name (Optional)', ur: 'کلب کا نام (اختیاری)' },
  weight: { en: 'Weight (kg)', ur: 'وزن (کلوگرام)' },
  hand: { en: 'Competing Hand', ur: 'کھیلنے والا ہاتھ' },
  right: { en: 'Right', ur: 'دایاں' },
  left: { en: 'Left', ur: 'بایاں' },
  both: { en: 'Both', ur: 'دونوں' },
  profile_payment: { en: 'Payment', ur: 'ادائیگی' },
  your_pic: { en: 'Your Pic', ur: 'آپ کی تصویر' },
  send_fee_to: { en: 'Send the entry fee to one of these accounts, then upload the screenshot below:', ur: 'داخلہ فیس ان میں سے کسی ایک اکاؤنٹ میں بھیجیں، پھر نیچے اسکرین شاٹ اپ لوڈ کریں:' },
  profile_picture: { en: 'Profile Picture', ur: 'پروفائل تصویر' },
  payment_screenshot: { en: 'Payment Screenshot', ur: 'ادائیگی کا اسکرین شاٹ' },
  required: { en: 'Required', ur: 'لازمی' },
  account_number: { en: 'Account Number Paid From', ur: 'جس اکاؤنٹ سے ادائیگی کی' },
  account_name: { en: 'Account Holder Name', ur: 'اکاؤنٹ ہولڈر کا نام' },
  submit_reg: { en: 'Submit Registration', ur: 'رجسٹریشن جمع کریں' },
  submitting: { en: 'Submitting Registration…', ur: 'رجسٹریشن جمع ہو رہی ہے…' },

  // Status page
  status_title: { en: 'Check Registration Status', ur: 'رجسٹریشن اسٹیٹس دیکھیں' },
  status_hint: { en: 'Enter your Registration ID (ARM-2026-XXXX) or phone number.', ur: 'اپنا رجسٹریشن آئی ڈی (ARM-2026-XXXX) یا فون نمبر درج کریں۔' },
  status_check: { en: 'Check Status', ur: 'اسٹیٹس دیکھیں' },
  status_checking: { en: 'Checking…', ur: 'چیک ہو رہا ہے…' },
  status_notfound: { en: 'No registration found for that ID or phone number.', ur: 'اس آئی ڈی یا فون نمبر کے لیے کوئی رجسٹریشن نہیں ملی۔' },
  status_pending: { en: 'Your application is pending admin approval.', ur: 'آپ کی درخواست منتظمین کی منظوری کے انتظار میں ہے۔' },
  status_approved: { en: 'Approved! You are confirmed for the competition.', ur: 'منظور! آپ مقابلے کے لیے تصدیق شدہ ہیں۔' },
  status_rejected: { en: 'Your application was not approved. Please contact the organizers.', ur: 'آپ کی درخواست منظور نہیں ہوئی۔ براہ کرم منتظمین سے رابطہ کریں۔' },

  // Live page
  live: { en: 'Live', ur: 'لائیو' },
  match_in_progress: { en: 'Match in progress', ur: 'مقابلہ جاری ہے' },
  result: { en: 'Result', ur: 'نتیجہ' },
  up_next: { en: 'Up next', ur: 'اگلا مقابلہ' },
  won: { en: 'Won', ur: 'جیت گیا' },
  lost: { en: 'Lost', ur: 'ہار گیا' },
  round: { en: 'Round', ur: 'راؤنڈ' },
  no_live_match: { en: 'No match in progress', ur: 'کوئی مقابلہ جاری نہیں' },
  home: { en: 'Home', ur: 'ہوم' },
};

interface I18nContextType {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof DICT | string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('lang')) as Lang | null;
    if (saved === 'en' || saved === 'ur') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('lang', l);
  }, []);

  const toggle = useCallback(() => setLang(lang === 'en' ? 'ur' : 'en'), [lang, setLang]);

  const t = useCallback(
    (key: string) => {
      const entry = DICT[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  const dir: 'ltr' | 'rtl' = lang === 'ur' ? 'rtl' : 'ltr';

  return <I18nContext.Provider value={{ lang, dir, setLang, toggle, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so components don't crash if used outside the provider.
    return {
      lang: 'en' as Lang,
      dir: 'ltr' as const,
      setLang: () => {},
      toggle: () => {},
      t: (key: string) => (DICT[key] ? DICT[key].en : key),
    };
  }
  return ctx;
}
