import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'
import { Speaker } from '../assets/Constants/about'
import { audience } from '../assets/Constants/audience'
import { getShareLinks, shareContent } from '../assets/Constants/social'
import Reveal, { StaggerItem, StaggerReveal } from '../assets/animations/reveal.jsx'

const SocialMedia = () => {
  const pageUrl = window.location.href
  const fullMessage = `${shareContent.message} ${pageUrl}`
  const shareLinks = getShareLinks(fullMessage)

  const handleInstagramShare = async (event) => {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText(fullMessage)
    } catch {
      /* clipboard may be unavailable */
    }
    window.open(Speaker.instagram, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <section className="section section-soft" id="speakers">
        <div className="container">
          <Reveal>
            <span className="section-eyebrow">Your guide for this evening</span>
            <h2 className="section-title">Meet Khushboo</h2>
            <p className="section-subtitle">
              Relationship coach, healer, and psychologist guiding married couples back to
              themselves — and toward each other.
            </p>
          </Reveal>

          <Reveal variant="speakerReveal" delay={0.1}>
            <article className="card speaker-card speaker-card-single">
              <div className="speaker-layout">
                <img
                  src={Speaker.image}
                  alt={Speaker.name}
                  className="speaker-photo speaker-photo-large"
                />
                <div className="speaker-info">
                  <h3>{Speaker.name}</h3>
                  <p className="speaker-role">{Speaker.designation}</p>

                  <div className="speaker-tags">
                    {Speaker.tags.map((tag) => (
                      <span key={tag} className="speaker-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {Speaker.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}

                  <ul className="speaker-credentials">
                    {Speaker.credentials.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="speaker-social">
                    <a
                      href={Speaker.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link social-facebook"
                      aria-label="Facebook"
                    >
                      <FaFacebook />
                      <span>Facebook</span>
                    </a>
                    <a
                      href={Speaker.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link social-instagram"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                      <span>Instagram</span>
                    </a>
                    <a
                      href={Speaker.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link from-red-700 via-red-500 to bg-pink-700"
                      aria-label="YouTube"
                    >
                      <FaYoutube />
                      <span>YouTube</span>
                    </a>
                    <a
                      href={Speaker.LinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link from-blue-900 via-blue-700 to bg-cyan-700"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedin />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="share-section" id="share">
              <h3 className="share-title">Share with a friend</h3>
              <p className="share-subtitle">
                Invite someone who would benefit from this healing webinar.
              </p>
              <StaggerReveal className="share-buttons">
                {shareLinks.map(({ label, href, icon: Icon, className, copyOnClick }) => (
                  <StaggerItem key={label} variant="cardReveal">
                    {copyOnClick ? (
                      <button
                        type="button"
                        className={`share-btn ${className}`}
                        onClick={handleInstagramShare}
                      >
                        <Icon />
                        <span>{label}</span>
                      </button>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`share-btn ${className}`}
                      >
                        <Icon />
                        <span>{label}</span>
                      </a>
                    )}
                  </StaggerItem>
                ))}
              </StaggerReveal>
              <p className="share-hint">
                Instagram opens your profile — the invite link is copied so you can paste it in a
                DM.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" id="audience">
        <div className="container">
          <Reveal>
            <span className="section-eyebrow">{audience.eyebrow}</span>
            <h2 className="section-title">{audience.title}</h2>
          </Reveal>

          <StaggerReveal className="audience-list">
            {audience.items.map((item) => (
              <StaggerItem key={item} variant="fadeLeft" className="audience-list-item">
                {item}
              </StaggerItem>
            ))}
          </StaggerReveal>

          <Reveal delay={0.1}>
            <div className="solo-note">
              <p>
                💡 <strong>{audience.soloNote.emphasis}</strong> {audience.soloNote.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default SocialMedia
