import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/react'
import { SPEAKER_IMAGE } from '../assets/Constants/about'
import { useSyncAuthUser } from '../hooks/useSyncAuthUser.js'
import Reveal from '../assets/animations/reveal.jsx'
import WebinarTimer from './WebinarTimer'

const Header = () => {
  useSyncAuthUser()

  return (
    <header className="site-header">
      <Reveal variant="fadeDown" animateOnMount>
        <div className="promo-banner sm:hidden" role="status">
          <span className="promo-banner__dot" aria-hidden="true" />
          <strong>Live Webinar</strong>
          <span className="promo-banner__sep">·</span>
          Limited seats available. Register now before it fills up.
        </div>
      </Reveal>

      <Reveal variant="navbarReveal" animateOnMount delay={0.1}>
        <div className="navbar">
          <div className="container navbar-container">
            <a href="#" className="logo-link" aria-label="Khushnay — home">
              <img src={SPEAKER_IMAGE} alt="Khushnay" className="logo logo-speaker" />
              <span className="logo-text">Khushnay</span>
            </a>

            <WebinarTimer />

            <nav className="nav-links" aria-label="Page sections">
              <a href="#about">About</a>
              <a href="#speakers">Speakers</a>
              <a href="#agenda">Agenda</a>
              <a href="#testimonials">Reviews</a>
              <a href="#faq">FAQ</a>
              <a href="#share">Share</a>
              <a href="#register">Register</a>
            </nav>

            <nav className="mobile-nav" aria-label="Mobile page sections">
              <a href="#about">About</a>
              <a href="#speakers">Speakers</a>
              <a href="#agenda">Agenda</a>
              <a href="#testimonials">Reviews</a>
              <a href="#faq">FAQ</a>
              <a href="#register">Register</a>
            </nav>

            <div className="signed-out">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button type="button" className="auth-btn">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button type="button" className="auth-btn-signUp">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </div>
        </div>
      </Reveal>
    </header>
  )
}

export default Header
