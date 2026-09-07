import { useRef } from 'react'
import { Header } from './landing/Header'
import { Hero } from './landing/Hero'
import { HowItWorks } from './landing/HowItWorks'
import { SavingExamples } from './landing/SavingExamples'
import { CategoryHub } from './landing/CategoryHub'
import { FAQ } from './landing/FAQ'
import { Footer } from './landing/Footer'

export function LandingPage({ onStart, onRestore, onBack }) {
  const hubRef = useRef(null)

  function scrollToHub() {
    hubRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // The page scrolls now: the hero fills the first screen and points down to
  // the category hub, which is the primary interaction. `onStart` still means
  // "open the general goal plan flow" exactly as it did for the old single
  // CTA — only the General tile (and the coming-soon previews' fallback link)
  // calls it.
  return (
    <div className="min-h-dvh bg-cream">
      <Header onScrollToHub={scrollToHub} onBack={onBack} />
      <Hero onScrollToHub={scrollToHub} onRestore={onRestore} />
      <HowItWorks />
      <SavingExamples />
      <CategoryHub ref={hubRef} onStartGeneral={onStart} />
      <FAQ />
      <Footer onExplore={scrollToHub} />
    </div>
  )
}
