import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
  CalendarDays,
  BookOpen,
  Users,
} from 'lucide-react'
import Scene from '../components/Scene'
import ResourceCard from '../components/ResourceCard'
import { resources, initialEvents } from '../data'

export default function Home() {
  const cats = [
    ['Aptitude', 'Aptitude Arena', 'Train your brain for the moments that count.'],
    ['Interview', 'Interview Prep', 'Walk in with clarity. Walk out with confidence.'],
    ['DSA', 'DSA Zone', 'Build the patterns behind great problem solvers.'],
    ['CS Fundamentals', 'Core Subjects', 'Own the fundamentals. Make every answer count.'],
  ]

  return (
    <>
      <section className="hero section-shell">
        <div className="hero-copy">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="eyebrow-pill"
          >
            <span /> MISSION: GET HIRED
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Apti Club
            <span className="hero-star">✳</span>
            <em>Placement,</em>
            <br />
            <em className="outline-word">unlocked.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your unfair advantage starts here. Find your resources, build real skills and show up
            ready for the opportunities ahead.
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Link className="btn btn-acid" to="/resources">
              Explore resources <ArrowUpRight size={17} />
            </Link>
            <Link className="btn btn-ghost" to="/events">
              Join events <MoveUpRight size={16} />
            </Link>
          </motion.div>

          <div className="hero-footnote">
            <span className="mini-avatars">
              <i>✳</i>
              <i>↗</i>
              <i>+</i>
            </span>
            <span>
              Made for the ones who are
              <br />
              <b>getting ready for what's next.</b>
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-label label-one">
            THINK BIGGER <span>↗</span>
          </div>
          <Scene />
          <div className="visual-sticker">
            READY
            <br />
            WHEN
            <br />
            YOU ARE
            <span>✳</span>
          </div>
          <div className="visual-label label-two">SKILLS IN MOTION / 001</div>
        </div>

        <a href="#tracks" className="scroll-cue">
          <ArrowDown size={15} /> SCROLL TO EXPLORE
        </a>
        <div className="hero-index">01 — 04</div>
      </section>

      <section className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
            DREAM<b>✳</b> DISCOVER <b>✳</b> DEFINE <b>✳</b> GET PLACED <b>✳</b>
            </span>
          ))}
        </div>
      </section>

      <section className="section-shell tracks-section" id="tracks">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE TOOLKIT / 01</span>
            <h2>
              Four tracks.
              <br />
              <em>One big leap.</em>
            </h2>
          </div>
          <p>
            Everything you need to move from “I should start” to “I'm ready.” Pick a track and make
            it yours.
          </p>
        </div>

        <div className="resource-grid">
          {cats.map(([c, t, d], i) => (
            <Link key={c} to="/resources" state={{ category: c }}>
              <ResourceCard category={c} title={t} desc={d} index={i} />
            </Link>
          ))}
        </div>

        <div className="center-link">
          <Link to="/resources" className="text-link">
            Explore all resources <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="event-feature">
        <div className="event-feature-inner">
          <div className="event-feature-copy">
            <span className="eyebrow">GET IN THE ROOM / 02</span>
            <h2>
              Good things
              <br />
              happen <em>in person.</em>
            </h2>
            <p>
              Workshops, practice sessions and community moments. Don't just prepare alone — grow
              together.
            </p>
            <Link className="btn btn-acid" to="/events">
              Find your next event <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="event-feature-art">
            <div className="event-art-circle">
              <CalendarDays size={70} />
              <span>
                LET'S
                <br />
                MAKE
                <br />
                MOVES.
              </span>
            </div>
            <div className="event-art-tag">
              SHOW UP
              <br />
              CURIOUS ↗
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto section-shell">
        <span className="eyebrow">THE APTI CLUB ENERGY / 03</span>
        <h2>
          Not another tab
          <br />
          you'll <em>forget to open.</em>
        </h2>

        <div className="manifesto-bottom">
          <p>
            A focused space for resources, campus events and the little wins that add up to a big
            offer.
          </p>
          <Link to="/about" className="text-link">
            Get to know us <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="stat-row">
          <div>
            <BookOpen />
            <b>Curated</b>
            <span>Resources that get you moving</span>
          </div>
          <div>
            <Users />
            <b>Community-led</b>
            <span>Learn with your people</span>
          </div>
          <div>
            <Sparkles />
            <b>Future-focused</b>
            <span>Progress over perfection</span>
          </div>
        </div>
      </section>
    </>
  )
}