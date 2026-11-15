import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { useApp } from '../context'
import { formatDate } from '../utils'
import { resources } from '../data'

const formatEvent = (event, attendance) => {
  const status = attendance?.status || 'Not marked yet'
  return `• ${event.title}\n  Date: ${formatDate(event.date)} at ${event.time}\n  Venue: ${event.venue}\n  Attendance: ${status}`
}

function getReply(question, app) {
  const q = question.toLowerCase()
  const { user, events, registrations, attendance } = app
  const now = new Date()
  const dateText = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(now)
  const timeText = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  }).format(now)

  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(q)) {
    return `Hey${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋 I'm Apti Bot. I can check event details, your registrations, attendance, resources, and information about using Apti Club.`
  }

  if (/\b(time|date|today|day is it|current time)\b/.test(q)) {
    return `Today is ${dateText}. The current time on your device is ${timeText}.`
  }

  if (/\b(who am i|my profile|my account|my usn|my name)\b/.test(q)) {
    return user
      ? `You are signed in as ${user.name} (USN: ${user.usn}). Your account role is ${user.role}.`
      : 'You are not signed in right now. Sign in with your USN to see your personal registrations and attendance.'
  }

  if (/\b(my queries|my questions|chat history|what did i ask|previous questions)\b/.test(q)) {
    const history = app.previousQueries || []
    return history.length
      ? `Here are your recent questions in Apti Bot:\n${history.slice(-10).map((item, index) => `${index + 1}. ${item}`).join('\n')}`
      : 'You have not asked any earlier questions in this chat history yet.'
  }

  if (/\b(my registrations|my registered events|events i registered|what have i registered|which events am i registered|my events|my bookings)\b/.test(q)) {
    if (!user) return 'Please sign in first. Then I can show the events registered under your USN.'
    const mine = registrations.filter(reg => reg.usn === user.usn)
    if (!mine.length) return 'I cannot find any event registrations for your account yet. Open Events, choose a session, and select Register now. Your registration will then appear here and on your Dashboard.'
    const details = mine.map(reg => {
      const event = events.find(item => item.id === reg.eventId)
      const record = attendance.find(item => item.eventId === reg.eventId && item.usn === user.usn)
      return event ? formatEvent(event, record) : `• Event ${reg.eventId} (event details are no longer available)`
    })
    return `You have registered for ${mine.length} event${mine.length === 1 ? '' : 's'}:\n${details.join('\n\n')}`
  }

  if (/\b(attendance|attended|present|absent)\b/.test(q)) {
    if (!user) return 'Sign in with your USN so I can look up your attendance.'
    const mine = registrations.filter(reg => reg.usn === user.usn)
    if (!mine.length) return 'You do not have any event registrations yet, so there is no attendance record to show.'
    return `Your attendance status:\n${mine.map(reg => {
      const event = events.find(item => item.id === reg.eventId)
      const record = attendance.find(item => item.eventId === reg.eventId && item.usn === user.usn)
      return `• ${event?.title || reg.eventId}: ${record?.status || 'Pending — coordinator has not marked it yet'}`
    }).join('\n')}`
  }

  if (/\b(all events|list events|upcoming events|what events|events available|show events)\b/.test(q)) {
    const upcoming = events.filter(event => event.status !== 'past' && new Date(`${event.date}T23:59:00`) >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
    return upcoming.length
      ? `Here are the upcoming Apti Club events:\n${upcoming.map(event => `• ${event.title} — ${formatDate(event.date)}, ${event.time}, ${event.venue}`).join('\n')}`
      : 'There are no upcoming events listed right now. Please check the Events page again later.'
  }

  if (/\b(dbms|database|operating systems|os concepts|computer networks|networking|sql|data structures|algorithms|dsa|aptitude|quantitative|verbal|reasoning|interview|resume|study material|resources)\b/.test(q)) {
    const topicMap = [
      { terms: ['dbms', 'database', 'sql', 'operating systems', 'os concepts', 'computer networks', 'networking'], category: 'CS Fundamentals' },
      { terms: ['data structures', 'algorithms', 'dsa'], category: 'DSA' },
      { terms: ['interview', 'resume'], category: 'Interview' },
      { terms: ['aptitude', 'quantitative', 'verbal', 'reasoning'], category: 'Aptitude' }
    ]
    const match = topicMap.find(group => group.terms.some(term => q.includes(term)))
    const chosen = match ? resources.filter(item => item.category === match.category) : resources
    const detail = chosen.map(item => `• ${item.title}: ${item.desc}\n  Useful links: ${item.items.slice(0, 3).map(link => `${link[0]} — ${link[1]}`).join(' | ')}`).join('\n\n')
    return `${match ? `Here are the ${match.category} resources available on Apti Club:` : 'Apti Club has these curated resource tracks:'}\n${detail}\n\nYou can open the Resources page to browse all materials.`
  }

  if (/\b(register|registration|sign up|join an event)\b/.test(q)) {
    return user
      ? 'To register, open Events, select the event you want, and press Register now. I can also show your current registrations if you ask “Which events am I registered for?”'
      : 'First create an account or sign in with your USN. Then open Events, choose a session, and press Register now.'
  }

  if (/\b(login|log in|sign in|usn|password|account)\b/.test(q)) {
    return 'Open Login from the top navigation. Students sign in using the USN and password they created. If you are new, choose Create account and enter your name, USN and password.'
  }

  if (/\b(archive|past events|previous events|old events)\b/.test(q)) {
    const past = events.filter(event => event.status === 'past' || new Date(`${event.date}T23:59:00`) < now)
    return past.length
      ? `The Event Archive contains ${past.length} past event${past.length === 1 ? '' : 's'}:\n${past.map(event => `• ${event.title} — ${formatDate(event.date)} (${event.venue})`).join('\n')}\nOpen Event Archive to view the event posters and details.`
      : 'There are no past events in the archive yet. Open Event Archive to check the latest archive entries.'
  }

  if (/\b(admin|coordinator|manage events|create event)\b/.test(q)) {
    return 'Admins can create and manage events from the Admin area. Event Coordinators can mark attendance for students who registered for their events. These controls are available only to the relevant demo roles in this frontend prototype.'
  }

  // If the question contains an event title, look up that event directly.
  const matchingEvent = events.find(event => q.includes(event.title.toLowerCase()))
  if (matchingEvent) {
    const registered = user && registrations.some(reg => reg.eventId === matchingEvent.id && reg.usn === user.usn)
    const record = user && attendance.find(item => item.eventId === matchingEvent.id && item.usn === user.usn)
    return `${matchingEvent.title}\nDate: ${formatDate(matchingEvent.date)}\nTime: ${matchingEvent.time}\nVenue: ${matchingEvent.venue}\nDetails: ${matchingEvent.description}\n${user ? `Your registration: ${registered ? 'Registered' : 'Not registered'}\nYour attendance: ${record?.status || 'Not marked / not registered'}` : 'Sign in to check your registration status.'}`
  }

  return 'I can answer questions using the information available in this Apti Club website. Try asking me:\n• What is today’s date and time?\n• Which events am I registered for?\n• Show my attendance status.\n• What upcoming events are available?\n• What did I ask you earlier?\n• Where can I find DSA or aptitude resources?'
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
        <div><b>Apti Bot</b><small>{user ? `Signed in as ${user.name}` : 'Ask about Apti Club'}</small></div>
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
