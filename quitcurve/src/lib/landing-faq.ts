export type FaqItem = {
  question: string;
  answer: string;
};

/** Shared FAQ copy for the landing page UI and FAQPage JSON-LD. */
export const LANDING_FAQS: FaqItem[] = [
  {
    question: "Is QuitCurve free?",
    answer:
      "Yes. QuitCurve is free during beta—no credit card. Build a plan, log cravings, and track money saved without paying.",
  },
  {
    question: "What happens if I slip?",
    answer:
      "Your plan adapts. One hard day does not reset you to day one. QuitCurve adjusts targets so you keep the progress you already made.",
  },
  {
    question: "Do I need to download an app?",
    answer:
      "No. QuitCurve works in your phone browser. On iPhone or Android, use Add to Home Screen for an app icon and full-screen feel.",
  },
  {
    question: "Is this medical advice or nicotine replacement?",
    answer:
      "No. QuitCurve is a behaviour-change tool—personalized step-down pacing, craving logs, and check-ins. It does not replace medical care, counselling, or nicotine replacement therapy.",
  },
  {
    question: "Who is QuitCurve for?",
    answer:
      "Adults who vape and want a calmer taper—not another all-or-nothing streak that collapses after one slip. You must be 18+ to use QuitCurve.",
  },
  {
    question: "How private is my data?",
    answer:
      "Your plan and logs stay in your account. We do not sell your data. You can delete your account anytime from Account settings. Details are in our Privacy Policy.",
  },
];
