import {
  Hero,
  Social_Media,
  Header,
  Testimonial,
  Footer,
  Features,
  Faq,
  WhoBanner,
  ProofStrip,
  TruthLearn,
  CtaSection,
} from './component'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <div className="global-background" aria-hidden="true">
        <div className="global-background__orb global-background__orb--left" />
        <div className="global-background__orb global-background__orb--right" />
      </div>

      <div className="app-content">
        <Header />

        <main>
          <Hero />
          {/* <WhoBanner /> */}
          {/* <ProofStrip /> */}
          <Features />
          <TruthLearn />
          <Testimonial />
          <Social_Media />
          <Faq />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App