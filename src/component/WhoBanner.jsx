import { audience } from '../assets/Constants/audience'
import Reveal from '../assets/animations/reveal.jsx'

const WhoBanner = () => (
  <div className="who-banner-strip">
    <Reveal variant="fadeUp">
      <div className="container">
        <p>
          🌸 <strong>{audience.banner}</strong>
        </p>
      </div>
    </Reveal>
  </div>
)

export default WhoBanner
