import { features, Webinar_info, Webinar_agenda } from '../assets/Constants/Detail'
import { useWebinar } from '../context/WebinarContext.jsx'
import {
  formatWebinarDate,
  formatWebinarPrice,
  formatWebinarTime,
} from '../utils/webinar.js'
import Reveal, { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'
import RegisterButton from './RegisterButton'

const SectionEyebrow = ({ children }) => (
  <span className="section-eyebrow">{children}</span>
)

const Features = () => {
  const { webinar, loading, error } = useWebinar()

  const formattedDate = webinar
    ? formatWebinarDate(webinar)
    : new Date(Webinar_info.Date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

  const formattedTime = webinar
    ? formatWebinarTime(webinar)
    : new Date(Webinar_info.Date).toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

  const mode = (webinar?.venue || Webinar_info.Mode) +" "+ Webinar_info.Privacy

  return (
    <>
      <section className="section" id="about">
        <div className="container">
          <Reveal>
            <SectionEyebrow>Does this feel familiar?
            </SectionEyebrow>
            <h2 className="section-title">{features.heading}</h2>
            <p className="section-subtitle">{features.sub}</p>
          </Reveal>

          <StaggerReveal className="card-grid features-grid">
            {features.feats.map(({ icon: Icon, title: featTitle, desc }) => (
              <StaggerItem key={featTitle} variant="cardReveal">
                <article className="card feature-card">
                  <div className="card-icon">
                    <Icon className="scale-160" />
                  </div>
                  <p className="feature-card__text">{desc}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="section section-soft" id="agenda">
        <div className="container">
          <Reveal>
            <SectionEyebrow>Save your seat</SectionEyebrow>
            <h2 className="section-title">Webinar Details</h2>
            <p className="section-subtitle">
              {loading
                ? 'Loading webinar details…'
                : error
                  ? 'Showing default details — connect to the server for live data'
                  : 'Everything you need to know before you join'}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="agenda-details agenda-details-card">
              <div className="agenda-details-header">
                <h3 className="agenda-webinar-title">
                  {webinar?.title || Webinar_info.title}
                </h3>
                <span className="price-badge">
                  {webinar ? formatWebinarPrice(webinar.price) : Webinar_info.price}
                </span>
              </div>

              <p className="agenda-description">
                {webinar?.description || Webinar_info.description}
              </p>

              <StaggerReveal className="fact-chips" aria-label="Event details">
                {[
                  { label: 'Date', value: formattedDate, primary: true },
                  { label: 'Time', value: formattedTime, primary: true },
                  { label: 'Duration', value: Webinar_info.Duration },
                  { label: 'Format', value: mode },
                ].map(({ label, value, primary }) => (
                  <StaggerItem
                    key={label}
                    variant="cardReveal"
                    className={`fact-chip${primary ? ' fact-chip--primary' : ''}`}
                  >
                    <span className="fact-chip__label">{label}</span>
                    <span className="fact-chip__value">{value}</span>
                  </StaggerItem>
                ))}
              </StaggerReveal>

              <div className="agenda-list">
                <h4 className="agenda-includes-title">Session flow</h4>
                <StaggerReveal className="agenda-timeline">
                  {Webinar_agenda.map(({ time, title: itemTitle, desc }) => (
                    <StaggerItem key={time} variant="textReveal" className="agenda-timeline-item">
                      <span className="agenda-timeline-time">{time}</span>
                      <div className="agenda-timeline-content">
                        <h5>{itemTitle}</h5>
                        <p>{desc}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerReveal>
              </div>

              <div className="agenda-register">
                <RegisterButton
                  label={`Reserve My Seat · ${webinar ? formatWebinarPrice(webinar.price) : Webinar_info.price} →`}
                  className="btn btn-primary btn-primary-lg"
                  pulse
                />
                <p className="text-lg md:text-lg font-bold text-green-900 tracking-tight">{Webinar_info?.security}</p>
                <p className="agenda-register-note">{Webinar_info.registerNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default Features
