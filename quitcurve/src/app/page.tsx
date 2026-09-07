import { LandingPage } from "@/components/LandingPage";
import { LANDING_FAQS } from "@/lib/landing-faq";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.quitcurve.app";

function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LANDING_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "QuitCurve",
    url: siteUrl,
    email: "quitcurve@gmail.com",
    founder: {
      "@type": "Person",
      name: "Marshall Buchner",
    },
    description:
      "A personalized vape quit coach with step-down plans that adapt after a slip.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <FaqJsonLd />
      <OrganizationJsonLd />
      <LandingPage />
    </>
  );
}
