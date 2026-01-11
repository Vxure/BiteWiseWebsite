import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { AppPreviewSection } from "@/components/app-preview-section"
import { RecipeAssistantSection } from "@/components/recipe-assistant-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <AppPreviewSection />
      <RecipeAssistantSection />
      <HowItWorksSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
