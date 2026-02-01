import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AppPreviewSection } from "@/components/app-preview-section"
import { RecipeAssistantSection } from "@/components/recipe-assistant-section"
import { FinalCtaSection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-16">
                <FeaturesSection />
                <HowItWorksSection />
                <AppPreviewSection />
                <RecipeAssistantSection />
                <FinalCtaSection />
                <Footer />
            </div>
        </main>
    )
}
