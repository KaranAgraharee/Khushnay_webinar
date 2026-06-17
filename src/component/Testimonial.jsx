import {
  Testimonial as testimonials,
  getYouTubeEmbedUrl,
  testimonialNote,
} from '../assets/Constants/testimonial'
import Reveal, { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'

const TestimonialCard = ({ id, url }) => {
  const embedUrl = getYouTubeEmbedUrl(url)

  if (embedUrl) {
    return (
      <article className="testimonial testimonial--video">
        <div className="testimonial-video">
          <iframe
            src={embedUrl}
            title={`Testimonial video ${id}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </article>
    )
  }

  return (
    <article className="testimonial testimonial--link">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="testimonial-link"
      >
        <span className="testimonial-link__icon" aria-hidden="true">
          ▶
        </span>
        <span className="testimonial-link__label">Watch testimonial</span>
        <span className="testimonial-link__hint">Opens in a new tab</span>
      </a>
    </article>
  )
}

const Testimonial = () => {
  return (
    <section className="section section-soft" id="testimonials">
      <div className="container">
        <Reveal>
          <span className="section-eyebrow">What past attendees say</span>
          <h2 className="section-title">Real Stories from Real People</h2>
          <p className="section-subtitle">
            Hear directly from people who once felt exactly like you do now.
          </p>
        </Reveal>

        <p className="testimonial-scroll-hint" aria-hidden="true">
          Swipe to watch more stories →
        </p>

        <StaggerReveal className="card-grid testimonial-grid">
          {testimonials.map((item) => (
            <StaggerItem key={item.id} variant="cardReveal">
              <TestimonialCard id={item.id} url={item.url} />
            </StaggerItem>
          ))}
        </StaggerReveal>

        <Reveal delay={0.1}>
          <p className="testimonial-note">{testimonialNote}</p>
        </Reveal>
      </div>
    </section>
  )
}

export default Testimonial
