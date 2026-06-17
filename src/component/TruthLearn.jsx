import { learnSection, truthSection } from '../assets/Constants/sections'
import Reveal, { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'

const TruthLearn = () => (
  <>
    <section className="section truth-section">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">{truthSection.eyebrow}</span>
          <h2 className="section-title">{truthSection.title}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="truth-box">
            <p>
              Toxic patterns in marriage don&apos;t always look like shouting or abuse. Sometimes
              they look like <strong>silence that suffocates</strong> — a partner who loves you but
              controls, dismisses, or drains you without realising it.
            </p>
            <p>
              Sometimes it looks like a cycle you keep repeating:{' '}
              <strong>fight, forgive, repeat</strong> — without ever actually healing the wound
              underneath. Years pass. Nothing changes.
            </p>
            <p>
              These are <strong>learned patterns</strong>, often rooted in childhood, fear of
              abandonment, or low self-worth. The good news? Patterns, once understood, can be
              broken — even in a long marriage. That&apos;s exactly what this webinar is about.
            </p>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="section section-soft learn-section">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">{learnSection.eyebrow}</span>
          <h2 className="section-title">{learnSection.title}</h2>
          <p className="section-subtitle">{learnSection.description}</p>
        </Reveal>

        <StaggerReveal className="card-grid learn-grid">
          {learnSection.items.map(({ num, title, desc }) => (
            <StaggerItem key={num} variant="cardReveal">
              <article className="card learn-card">
                <span className="learn-num">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  </>
)

export default TruthLearn
