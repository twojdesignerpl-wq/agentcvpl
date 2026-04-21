import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/navbar";

/**
 * Wrapper dla podstron marketingowych (/poradniki, /o-nas, /kontakt,
 * /regulamin, /polityka-prywatnosci). Zapewnia spójny design z landingiem:
 * Navbar (fixed) + children + Footer. Strony same ustawiają top padding
 * (zwykle pt-28) aby content nie był pod fixed navbar.
 */
export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
