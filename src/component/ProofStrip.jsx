import { proofStats } from '../assets/Constants/sections'
import Reveal from '../assets/animations/reveal.jsx'

const ProofStrip = () => (
  <div className="proof-strip">
    <Reveal variant="fadeUp">
      <div className="container">
        <div className="proof-strip-inner">
          {proofStats.map(({ value, label }, index) => (
            <div key={label} className="proof-stat-wrap">
              {index > 0 ? <span className="proof-divider" aria-hidden="true" /> : null}
              <div className="proof-stat">
                <span className="proof-num">{value}</span>
                <span className="proof-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  </div>
)

export default ProofStrip
