import { AvailablePaths } from "@/components/available-trails";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/how-it-works";
import { SectionDivider } from "@/components/section-divider";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <AvailablePaths />
    </main>
  );
}
