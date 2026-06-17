import { Footer as footerContent } from '../assets/Constants/Cta_footer'
import Reveal from '../assets/animations/reveal.jsx'

const Footer = () => {
  return (
    <footer className="footer">
      <Reveal variant="fadeUp">
        <div className="container">
          <p>{footerContent.copyright}</p>
          <p className="footer-note">{footerContent.tagline}</p>
          {footerContent.links?.length ? (
            <p className="footer-links">
              {footerContent.links.map(({ label, href }, index) => (
                <span key={label}>
                  {index > 0 ? ' · ' : null}
                  <a href={href}>{label}</a>
                </span>
              ))}
            </p>
          ) : null}
          {footerContent.disclaimer ? (
            <p className="footer-disclaimer">{footerContent.disclaimer}</p>
          ) : null}
        </div>
      </Reveal>
    </footer>
  )
}

export default Footer
