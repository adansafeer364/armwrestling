'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I register to take part?',
    a: 'On the homepage, choose the competition that is open for registration and tap “Register for this Competition”. Fill the form — full name, father’s name, phone, email, age, city, club (optional), your weight, and your competing hand (Right, Left or Both). Upload your photo and a screenshot of your fee payment, and enter the account number and account-holder name you paid from. Submit, and you will get a Registration ID like ARM-2026-0001. You can also register over WhatsApp at 03397811755.'
  },
  {
    q: 'How do I pay the entry fee?',
    a: 'Send the entry fee to the organizer’s JazzCash (0327 8625085) or EasyPaisa (0343 9200329) — account holder ADAN SAFEER. Then upload the payment screenshot on the registration form and enter the account you paid from. Your entry is confirmed once the organizer verifies the payment.'
  },
  {
    q: 'What happens after I submit — how does the whole event work?',
    a: 'Step 1: You register and pay. Step 2: The organizer verifies your payment and approves your entry — you receive a confirmation email. Step 3: On event day, approved athletes are split into weight classes (−55 kg up to −100 kg in 5 kg steps, plus 100 kg+) for the left and right arm. Step 4: Inside each class everyone is shuffled and paired at random. Step 5: It is a straight knockout — win your pull and you advance, lose and you are out; the winners are re-paired each round until one champion remains in each class.'
  },
  {
    q: 'How do I check if my registration is approved?',
    a: 'Open the “Check Status” page (link in the top menu) and enter your Registration ID (ARM-2026-XXXX) or your phone number. It will instantly show whether your entry is Pending, Approved, or Rejected — no login needed.'
  },
  {
    q: 'Can I compete with both arms?',
    a: 'Yes. If you choose “Both” when registering, you are entered into both the left-hand and right-hand bracket of your weight class, and you compete in each separately.'
  },
  {
    q: 'How can people follow the matches?',
    a: 'During the event, tap “Watch Live” in the menu. The screen shows the current match — Player 1 vs Player 2 with their photos — and updates to show who won and who lost as the referee declares each result.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-brand-primary uppercase">
            Have Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-light-text-main dark:text-dark-text-main uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-light-text-muted dark:text-dark-text-muted text-base sm:text-lg">
            Everything you need to know about registering, paying the fee, and how the competition works.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-light-text-main dark:text-dark-text-main pr-4">
                    {faq.q}
                  </span>
                  <div className="p-1.5 rounded-lg bg-white dark:bg-dark-card text-brand-primary border border-gray-200 dark:border-gray-800 flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 text-sm sm:text-base text-light-text-muted dark:text-dark-text-muted leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
