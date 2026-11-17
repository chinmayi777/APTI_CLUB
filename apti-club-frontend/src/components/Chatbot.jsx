import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useApp } from '../context'
import { formatDate } from '../utils'
import { resources } from '../data'


const getEventDate = (event) => event.event_date || event.date
const getEventTime = (event) => event.start_time || event.time || 'Time not specified'

const formatEvent = (event, attendanceRecord) => {
  const date = getEventDate(event)
  const time = getEventTime(event)

  return `• ${event.title}
  Date: ${date ? formatDate(date) : 'Not specified'}
  Time: ${time}
  Venue: ${event.venue || 'Not specified'}
  Attendance: ${attendanceRecord?.status || 'Not marked yet'}`
}

const topicGroups = [
  {
    name: 'Aptitude',
    terms: ['aptitude', 'quantitative', 'percentage', 'profit', 'loss', 'time and work', 'probability', 'number system', 'reasoning', 'verbal', 'puzzle'],
    description: 'Build speed and accuracy in quantitative aptitude, verbal ability and logical reasoning.'
  },
  {
    name: 'DSA',
    terms: ['dsa', 'data structure', 'algorithm', 'array', 'string', 'linked list', 'stack', 'queue', 'tree', 'graph', 'recursion', 'sorting', 'searching', 'dynamic programming', 'sliding window'],
    description: 'Learn problem-solving patterns, data structures and algorithms for coding interviews.'
  },
  {
    name: 'CS Fundamentals',
    terms: ['cs fundamentals', 'dbms', 'database', 'sql', 'operating system', 'os', 'computer network', 'networking', 'oops', 'object oriented', 'normalization', 'deadlock', 'process', 'thread'],
    description: 'Prepare OOP, DBMS, SQL, operating systems and computer networks for technical interviews.'
  },
  {
    name: 'Interview',
    terms: ['interview', 'hr round', 'technical round', 'mock interview', 'communication', 'behavioral', 'star method'],
    description: 'Practice technical interviews, HR questions, communication and confident storytelling.'
  },
  {
    name: 'Resume',
    terms: ['resume', 'cv', 'ats', 'shortlist', 'curriculum vitae'],
    description: 'Create a clear, ATS-friendly resume that highlights your skills, projects and achievements.'
  }
]

const findTopic = (q) =>
  topicGroups.find(group => group.terms.some(term => q.includes(term)))

const getResources = (category) =>
  resources.filter(item => item.category === category)

function getReply(question, app) {
  const q = question.toLowerCase().trim()
  const { user, events = [], registrations = [], attendance = [], previousQueries = [] } = app
  const now = new Date()

  const topic = findTopic(q)

  const resourceReply = (category) => {
    const chosen = getResources(category)

    if (!chosen.length) {
      return `I couldn't find ${category} resources in the current website data. Check the Resources page for updates.`
    }

    return `Here are your ${category} resources from Apti Club:\n\n${chosen.map(item =>
      `📘 ${item.title}\n${item.desc}\n${item.items.map(link => `• ${link[0]}: ${link[1]}`).join('\n')}`
    ).join('\n\n')}\n\nOpen the Resources page to explore them.`
  }

  // Greetings
  if (/^(hi|hello|hey|hii|good morning|good afternoon|good evening)\b/.test(q)) {
    return `Hey${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋\n\nWelcome to Apti Club!\n\nI'm your placement preparation assistant. I can help with:\n\n📊 Aptitude and reasoning\n💻 DSA and coding\n🧠 CS fundamentals\n🎤 Interview preparation\n📄 Resume building\n📅 Events and registrations\n\nWhat would you like to work on today?`
  }

  // Chat history
  if (/what did i ask|previous questions|my chat history|earlier questions/.test(q)) {
    return previousQueries.length
      ? `Here are your recent questions:\n${previousQueries.slice(-10).map((item, i) => `${i + 1}. ${item}`).join('\n')}`
      : 'This is the beginning of our conversation. Ask me anything about placement preparation!'
  }

  // Personal account
  if (/who am i|my profile|my account|my usn|my name/.test(q)) {
    return user
      ? `You're signed in as ${user.name || user.full_name}.\nRole: ${user.role}.\n\nI can also help you check your event registrations and attendance.`
      : `You're currently browsing as a guest. Sign in to access your personal event registrations and attendance.`
  }

  // Time and date
  if (/\b(time|date|today|current time)\b/.test(q)) {
    return `Today is ${now.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })}.\nYour device time is ${now.toLocaleTimeString('en-IN')}.`
  }

  // Registrations
  if (/my registrations|registered events|events i registered|my bookings|my events/.test(q)) {
    if (!user) return 'Please sign in first. Then I can show the registrations linked to your account.'

    const mine = registrations.filter(reg =>
      (!reg.usn || !user?.usn || reg.usn === user.usn) &&
      String(reg.status || reg.registration_status || 'registered').toLowerCase() === 'registered'
    )

    if (!mine.length) {
      return 'You currently have no active event registrations in your account.\n\nOpen the Events page, choose an available event and select Register now.'
    }

    return `You have ${mine.length} active registration(s):\n\n${mine.map(reg => {
      const event = events.find(item => String(item.id) === String(reg.eventId || reg.event_id))
      return event
        ? formatEvent(event, attendance.find(item => String(item.eventId || item.event_id) === String(event.id) && (!item.usn || !user?.usn || item.usn === user.usn)))
        : `• Event ID: ${reg.eventId || reg.event_id}`
    }).join('\n\n')}`
  }

  // Attendance
  if (/\b(attendance|present|absent)\b/.test(q)) {
    if (!user) return 'Please sign in to check your personal attendance.'

    const mine = registrations.filter(reg =>
      (!reg.usn || !user?.usn || reg.usn === user.usn) &&
      String(reg.status || reg.registration_status || 'registered').toLowerCase() === 'registered'
    )

    if (!mine.length) return 'You have no active event registrations to check attendance for.'

    return `Here is your attendance information:\n\n${mine.map(reg => {
      const eventId = reg.eventId || reg.event_id
      const event = events.find(item => String(item.id) === String(eventId))
      const record = attendance.find(item => String(item.eventId || item.event_id) === String(eventId) && (!item.usn || !user?.usn || item.usn === user.usn))
      return `• ${event?.title || `Event ${eventId}`}: ${record?.status || 'Pending — attendance has not been marked yet'}`
    }).join('\n')}`
  }

  // Events
  if (/upcoming events|available events|show events|list events|all events|what events/.test(q)) {
    const upcoming = events.filter(event => {
      const date = getEventDate(event)
      const status = String(event.status || '').toLowerCase()
      return date && new Date(`${date}T23:59:59`) >= now &&
        !['cancelled', 'completed', 'draft'].includes(status)
    }).sort((a, b) => getEventDate(a).localeCompare(getEventDate(b)))

    return upcoming.length
      ? `Here are the upcoming events listed on Apti Club:\n\n${upcoming.map(event =>
          `📅 ${formatEvent(event)}\n${event.description || ''}`
        ).join('\n\n')}`
      : 'There are currently no upcoming published events available. Check the Events page again for updates.'
  }

  // Past events
  if (/archive|past events|previous events/.test(q)) {
    const past = events.filter(event => {
      const date = getEventDate(event)
      return date && (new Date(`${date}T23:59:59`) < now || event.status === 'completed')
    })

    return past.length
      ? `Here are the past events:\n\n${past.map(event => `• ${event.title} — ${formatDate(getEventDate(event))} (${event.venue})`).join('\n')}`
      : 'There are no past events available in the current event data.'
  }

  // Website navigation
  if (/how (do i|can i) register|register for an event|join an event/.test(q)) {
    return user
      ? 'To register for an event:\n\n1. Open the Events page.\n2. Choose an available event.\n3. Check its date, venue and details.\n4. Select Register now.\n\nYou can ask me "Which events am I registered for?" to check your registrations.'
      : 'First create an account or sign in. Then open Events, choose an available event and select Register now.'
  }

  if (/login|log in|sign in|create account|signup|sign up/.test(q)) {
    return 'Use the Login option in the website navigation. New students can choose Create account and enter their name, USN, email and password. Existing students can sign in using their registered credentials.'
  }

  if (/admin|coordinator|create event|manage event/.test(q)) {
    return 'Apti Club has three account roles:\n\n👨‍🎓 Student — access resources and register for events.\n\n🧑‍💼 Event Coordinator — manage attendance for events.\n\n🛡️ Admin — manage events and coordinator accounts.\n\nAccess depends on the role assigned to your account.'
  }

  // Resume and study resources
  if (/resource|study material|learning material|links for/.test(q) && topic) {
    return resourceReply(topic.name)
  }

  if (/\b(resources|study materials|learning materials)\b/.test(q)) {
    return `Apti Club has these preparation tracks:\n\n${topicGroups.map(item => `• ${item.name}: ${item.description}`).join('\n\n')}\n\nAsk me for a specific track to see its learning resources.`
  }

  // Study plans
  if (/study plan|timetable|schedule|roadmap|prepare for placement|preparation plan/.test(q)) {
    const selected = topic || topicGroups[0]
    return `Here's a practical 7-day ${selected.name} preparation plan:\n\nDay 1 — Learn the basic concepts and terminology.\nDay 2 — Study important patterns and solved examples.\nDay 3 — Practice beginner-level questions.\nDay 4 — Move to intermediate problems.\nDay 5 — Solve timed practice questions.\nDay 6 — Revise mistakes and weak areas.\nDay 7 — Take a mock test and review your performance.\n\nDaily routine:\n• 30 minutes learning\n• 45 minutes practice\n• 15 minutes revision\n\nUse the ${selected.name} resources on the Resources page to get started.`
  }

  // Mock interview
  if (/mock interview|interview me|ask me interview questions|practice interview/.test(q)) {
    return `Let's practise! 🎤\n\nInterview Question 1:\n\n"Tell me about yourself."\n\nTry answering in 60–90 seconds. Include:\n1. Your education and area of interest.\n2. Your strongest technical skills.\n3. One project or achievement.\n4. The role you are preparing for.\n\nSend your answer and I can give you a structured checklist of improvements.`
  }

  // Resume guidance
  if (/resume|ats|cv|curriculum vitae/.test(q)) {
    return `${topicGroups.find(item => item.name === 'Resume').description}\n\nA strong student resume should include:\n\n1. Name and contact information.\n2. Education and relevant coursework.\n3. Technical and soft skills.\n4. Projects with your actual contribution and results.\n5. Internships, certifications and achievements.\n\nKeep it concise, truthful and easy to scan.\n\n${resourceReply('Resume')}`
  }

  // Topic-specific resource lookup
  if (topic && (/resource|link|where|learn|study|start/.test(q))) {
    return resourceReply(topic.name)
  }

  // Event-specific lookup
  const matchingEvent = events.find(event =>
    q.includes(String(event.title || '').toLowerCase())
  )

  if (matchingEvent) {
    const registered = user && registrations.some(reg =>
      String(reg.eventId || reg.event_id) === String(matchingEvent.id) &&
      (!reg.usn || !user.usn || reg.usn === user.usn) &&
      String(reg.status || reg.registration_status || 'registered').toLowerCase() === 'registered'
    )
    return `${formatEvent(matchingEvent)}\n\nDetails: ${matchingEvent.description || 'No extra description available.'}\n\nYour registration: ${user ? (registered ? 'Registration found' : 'Not registered') : 'Sign in to check.'}`
  }

  // General placement guidance by topic
  if (topic) {
    return `${topic.description}\n\nA good way to begin:\n\n1. Understand the fundamentals.\n2. Learn one concept at a time.\n3. Solve practice questions daily.\n4. Review mistakes instead of memorising answers.\n5. Take timed tests to improve speed and accuracy.\n\nI can also show you the ${topic.name} resources available on Apti Club. Ask "Show me ${topic.name} resources".`
  }

  // Follow-up handling
  if (/more|explain|continue|examples|example|practice|questions/.test(q) && previousQueries.length) {
    const previousTopic = findTopic(previousQueries[previousQueries.length - 1].toLowerCase())
    if (previousTopic) {
      return `Let's continue with ${previousTopic.name}.\n\nTell me the exact concept you want to explore, or ask me for practice questions, examples, a study plan or learning resources.`
    }
  }

  return `I'm your Apti Club placement assistant! ✳\n\nI can help you with:\n\n📊 Aptitude and reasoning practice\n💻 DSA and coding preparation\n🧠 DBMS, OS, OOP and networking\n🎤 HR and technical interview preparation\n📄 Resume improvement\n📅 Upcoming events and registrations\n\nTry asking:\n• Give me a 7-day DSA study plan.\n• Show me aptitude resources.\n• Explain DBMS normalization.\n• Start a mock interview.\n• Which events am I registered for?\n\nI'll use the information available on this website and won't make up event or registration details.`
}


export default function Chatbot() {
  const { user, events, registrations, attendance } = useApp()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const storageKey = `apti_chat_${user?.usn || 'guest'}`
  const [msgs, setMsgs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return saved.length ? saved : [{ from: 'bot', text: "Hey! I'm Apti Bot ✳ Ask me about events, your registrations, attendance, resources, or today's date and time." }]
    } catch {
      return [{ from: 'bot', text: "Hey! I'm Apti Bot ✳ Ask me about events, your registrations, attendance, resources, or today's date and time." }]
    }
  })
  const messagesEndRef = useRef(null)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
      setMsgs(saved.length ? saved : [{ from: 'bot', text: "Hey! I'm Apti Bot ✳ Ask me about events, your registrations, attendance, resources, or today's date and time." }])
    } catch {
      setMsgs([{ from: 'bot', text: "Hey! I'm Apti Bot ✳ Ask me about events, your registrations, attendance, resources, or today's date and time." }])
    }
  }, [storageKey])

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(msgs.slice(-60))) } catch { /* Ignore storage limits */ }
  }, [msgs, storageKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, open])

  const send = () => {
    const question = input.trim()
    if (!question) return
    const previousQueries = msgs.filter(message => message.from === 'you').map(message => message.text)
    const reply = getReply(question, { user, events, registrations, attendance, previousQueries })
    setMsgs(current => [...current, { from: 'you', text: question }, { from: 'bot', text: reply }])
    setInput('')
  }

  return <>
    <button className="chat-launch" onClick={() => setOpen(!open)} aria-label="Open Apti Bot">{open ? <X /> : <MessageCircle />}<span className="chat-dot" /></button>
    {open && <section className="chat-panel">
      <div className="chat-head">
        <div className="chat-avatar"><Sparkles size={17} /></div>
        <div><b>Apti Bot</b><small>{user ? `Signed in as ${user.name || user.full_name || 'student'}` : 'Ask about Apti Club'}</small></div>
        <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close chatbot"><X size={18} /></button>
      </div>
      <div className="chat-messages">
        {msgs.map((message, index) => <div key={index} className={'chat-bubble ' + message.from}>{message.text}</div>)}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === 'Enter' && send()} placeholder="Ask Apti Bot anything about the site..." aria-label="Your question" />
        <button onClick={send} aria-label="Send message"><Send size={17} /></button>
      </div>
    </section>}
  </>
}
