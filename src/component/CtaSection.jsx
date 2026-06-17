import { CTA } from '../assets/Constants/Cta_footer'
import { Webinar_info } from '../assets/Constants/Detail'
import Reveal from '../assets/animations/reveal.jsx'
import RegisterButton from './RegisterButton'

const CtaSection = () => (
  <section className="section final-cta-section" id="register">
    <div className="container">
      <Reveal>
        <span className="section-eyebrow final-cta-eyebrow">{CTA.eyebrow}</span>
        <h2 className="final-cta-title">
          Your Marriage Deserves Better. <em>So Do You.</em>
        </h2>
        <p className="final-cta-desc">{CTA.description}</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="final-cta-action">
          <RegisterButton
            label={`${CTA.buttonText} · ${Webinar_info.price} →`}
            className="btn btn-primary btn-primary-lg final-cta-btn"
            pulse
          />
          <p className="final-cta-urgency">{CTA.urgencyNote}</p>
        </div>
      </Reveal>
    </div>
  </section>
)

export default CtaSection
