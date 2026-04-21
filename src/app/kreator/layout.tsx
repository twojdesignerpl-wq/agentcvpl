import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kreator CV",
  description:
    "Wypełnij formularz i stwórz profesjonalne CV z asystentem AI Pracuś.",
};

export default function KreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
