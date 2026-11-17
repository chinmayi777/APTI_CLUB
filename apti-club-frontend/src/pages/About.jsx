import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Compass,
  Code,
  GraduationCap,
  MessageCircle,
  Mic,
  Sparkles,
  Target,
  Users
} from 'lucide-react'

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
}

const pillars = [
  {
    number: '01',
    title: 'DREAM',
    accent: 'dream',
    icon: Sparkles,
    description: 'Start with ambition. Build the confidence to imagine the opportunities ahead and take your placement goals seriously.'
  },
  {
    number: '02',
    title: 'DISCOVER',
    accent: 'discover',
    icon: Compass,
    description: 'Explore your strengths, learn new concepts and discover the skills employers look for through guided preparation.'
  },
  {
    number: '03',
    title: 'DEFINE',
    accent: 'define',
    icon: Target,
    description: 'Turn what you have learned into a clear personal story. Practise, communicate and define the professional you want to become.'
  }
]

const aptiTracks = [
  {
    letter: 'A',
    title: 'Aptitude',
    icon: Brain,
    description: 'Strengthen quantitative ability, logical reasoning, verbal skills and problem-solving speed.'
  },
  {
    letter: 'P',
    title: 'Personality',
    icon: Users,
    description: 'Develop communication, confidence, teamwork and the professional habits that help you stand out.'
  },
  {
    letter: 'T',
    title: 'Technical',
    icon: Code,
    description:
      'Build strong programming skills, understand core computer science concepts, and develop the technical knowledge needed for placements.'
  },
  {
    letter: 'I',
    title: 'Interview',
    icon: Mic,
    description: 'Prepare for technical and HR conversations, explain your work and present your strengths with clarity.'
  }
]

const journey = [
  {
    number: '01',
    title: 'The need',
    description: 'Placement preparation can feel scattered. Students often need a clearer path to useful resources, practice opportunities and guidance.'
  },
  {
    number: '02',
    title: 'The purpose',
    description: 'Apti Club brings aptitude, personality development and interview preparation together as connected parts of one journey.'
  },
  {
    number: '03',
    title: 'The next chapter',
    description: 'Through learning resources, campus events and a student-focused space, the club aims to make preparation more organised and accessible.'
  }
]

const readiness = [
  { icon: BookOpen, title: 'Learn with direction', text: 'Find curated learning resources for aptitude, DSA and core technical subjects.' },
  { icon: GraduationCap, title: 'Practise together', text: 'Use club activities and events to turn concepts into consistent preparation.' },
  { icon: MessageCircle, title: 'Build your voice', text: 'Work on communication, confidence and the way you explain your ideas.' },
  { icon: BriefcaseBusiness, title: 'Prepare for opportunity', text: 'Bring your skills, projects and experiences together for placement conversations.' }
]

export default function About() {
  return (
    <main className="page-shell about-page">
      <motion.section
        className="about-intro"
        initial="hidden"
        animate="visible"
        variants={reveal}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="eyebrow"><span className="about-live-dot" /> THE APTI CLUB STORY</span>
        <h1>DREAM.<br /><em>DISCOVER.</em><br /><span>DEFINE.</span></h1>
        <p className="about-intro-copy">
          More than placement preparation — a space to discover what you can do,
          build who you are and move towards the future you want.
        </p>
        <a className="about-scroll-link" href="#our-purpose">
          EXPLORE OUR STORY <ArrowDown size={15} />
        </a>
        <div className="about-orbit about-orbit-one" />
        <div className="about-orbit about-orbit-two" />
        <span className="about-hero-note">A STUDENT-FOCUSED<br />PLACEMENT JOURNEY <b>✳</b></span>
      </motion.section>

      <motion.section
        id="our-purpose"
        className="about-purpose"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.65 }}
      >
        <div className="about-section-label">
          <span className="eyebrow">01 / OUR PURPOSE</span>
          <span className="about-label-line" />
        </div>
        <div className="about-purpose-grid">
          <h2>Making the path<br />to placement <em>clearer.</em></h2>
          <div>
            <p>
              Apti Club exists to help students prepare for placements with more
              clarity, confidence and consistency. It brings learning resources,
              campus activities and practical preparation into one student-focused
              space — connecting what students learn with how they present themselves.
            </p>
            <p>
              The goal is not simply to prepare for one interview. It is to help
              students build skills they can carry into their careers.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="about-pillars" aria-label="Dream Discover Define pillars">
        <div className="about-pillars-heading">
          <span className="eyebrow">THE MINDSET</span>
          <p>Three steps. One journey forward.</p>
        </div>
        <div className="about-pillar-grid">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <motion.article
                className={`about-pillar-card ${pillar.accent}`}
                key={pillar.number}
                initial={{ opacity: 0, y: 38 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
              >
                <div className="about-pillar-top"><span>{pillar.number}</span><Icon size={23} /></div>
                <h3>{pillar.title}<i>.</i></h3>
                <p>{pillar.description}</p>
                <span className="about-pillar-mark">✳</span>
              </motion.article>
            )
          })}
        </div>
      </section>

      <motion.section
        className="about-apti"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        variants={reveal}
        transition={{ duration: 0.65 }}
      >
        <div className="about-section-label">
          <span className="eyebrow">02 / WHAT APTI MEANS</span>
          <span className="about-label-line" />
        </div>
        <div className="about-apti-heading">
          <h2>Four essentials.<br /><em>One goal.</em></h2>
          <p>APTI is the foundation of the club’s placement-readiness approach.</p>
        </div>
        <div className="about-apti-grid">
          {aptiTracks.map((track, index) => {
            const Icon = track.icon
            return (
              <motion.article
                className="about-apti-card"
                key={track.letter}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <span className="about-apti-letter">{track.letter}</span>
                <div className="about-apti-card-title"><Icon size={19} /><h3>{track.title}</h3></div>
                <p>{track.description}</p>
              </motion.article>
            )
          })}
        </div>
      </motion.section>

      <section className="about-story">
        <div className="about-story-heading">
          <span className="eyebrow">03 / OUR STORY</span>
          <h2>Built around a<br /><em>shared ambition.</em></h2>
          <p>
            Apti Club’s story is rooted in a simple idea: students should have a
            place where placement preparation feels connected, approachable and
            easier to navigate.
          </p>
        </div>
        <div className="about-timeline">
          {journey.map((item, index) => (
            <motion.article
              className="about-timeline-item"
              key={item.number}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <span className="about-timeline-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-impact">
        <div className="about-impact-heading">
          <span className="eyebrow">04 / FROM LEARNING TO PLACEMENT</span>
          <h2>Preparation that<br /><em>moves you forward.</em></h2>
          <p>
            Apti Club supports the steps behind a placement journey. It helps
            students work on the knowledge, practice and communication they need
            to approach opportunities with greater confidence.
          </p>
        </div>
        <div className="about-readiness-grid">
          {readiness.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.article
                className="about-readiness-card"
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            )
          })}
        </div>
        <div className="about-impact-footnote">
          <span>THE OUTCOME WE WORK TOWARDS</span>
          <strong>Prepared minds. Confident voices. Better-ready graduates.</strong>
        </div>
      </section>

      <section className="about-voices">
        <div className="about-voices-copy">
          <span className="eyebrow">05 / STUDENT VOICES</span>
          <h2>Every journey<br />has a <em>story.</em></h2>
          <p>
            We want this space to reflect real student experiences — what they
            learned, how they grew and how Apti Club supported their placement
            preparation. Verified student reviews and placement stories will be
            featured here as they are collected.
          </p>
        </div>
        <div className="about-voices-card">
          <MessageCircle size={25} />
          <span className="eyebrow">YOUR EXPERIENCE MATTERS</span>
          <h3>Help the next student take their next step.</h3>
          <p>Share an honest experience of a session, resource or activity that helped you prepare.</p>
          <span className="about-voices-note">REAL STORIES · REAL STUDENT VOICES</span>
        </div>
      </section>

      <motion.section
        className="about-team"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={reveal}
        transition={{ duration: 0.65 }}
      >
        <span className="eyebrow">06 / THE PEOPLE BEHIND THIS SPACE</span>
        <h2>Made by students.<br /><em>For every next step.</em></h2>
        <p>
          The coordinators and curators of this website are final-year students
          from the 2027 batch of Computer Science &amp; Engineering (CSE) and
          Information Science &amp; Engineering (ISE).
        </p>
        <div className="about-team-stamp"><span>APTI CLUB</span><b>2027</b><span>CSE + ISE</span></div>
      </motion.section>

      <section className="about-bottom-cta">
        <div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to <em>begin?</em></h2></div>
        <div className="about-bottom-actions">
          <Link to="/resources" className="btn btn-acid">Explore resources <ArrowUpRight size={16} /></Link>
          <Link to="/events" className="btn btn-ghost">Discover events <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </main>
  )
}
