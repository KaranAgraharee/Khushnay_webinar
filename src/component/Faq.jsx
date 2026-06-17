import { faq } from '../assets/Constants/faq'
import Reveal, { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'

const Faq = () => {
  return (
    <section className="section" id="faq">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">Questions you might have</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </Reveal>

        <StaggerReveal className="faq-list">
          {faq.map((item) => (
            <StaggerItem key={item.id} variant="cardReveal">
              <details className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  )
}

export default Faq
