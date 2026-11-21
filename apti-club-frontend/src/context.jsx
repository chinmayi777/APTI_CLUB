
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { initialEvents } from './data'
import { apiRequest } from './api'

const C = createContext(null)

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

const normalizeUser = user => {
  const name = [user.name, user.full_name, user.fullName]
    .find(value => typeof value === 'string' && value.trim())
    ?.trim() || ''

  return {
    ...user,
    name,
    full_name: name
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = read('apti_user', null)
    return storedUser ? normalizeUser(storedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('apti_token'))
  const [users, setUsers] = useState(() => read('apti_users', []))
  const [events, setEvents] = useState(() => read('apti_events', initialEvents))
  const [registrations, setRegistrations] = useState(() => read('apti_regs', []))
  const [attendance, setAttendance] = useState(() => read('apti_attendance', []))
  const [theme, setTheme] = useState(() => localStorage.getItem('apti_theme') || 'dark')
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    if (user) {
      localStorage.setItem('apti_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('apti_user')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('apti_token', token)
    } else {
      localStorage.removeItem('apti_token')
    }
  }, [token])

  useEffect(() => {
    localStorage.setItem('apti_users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('apti_events', JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem('apti_regs', JSON.stringify(registrations))
  }, [registrations])

  useEffect(() => {
    localStorage.setItem('apti_attendance', JSON.stringify(attendance))
  }, [attendance])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('apti_theme', theme)
  }, [theme])

  
  // Restore the logged-in user when the app opens.
  useEffect(() => {
    const restoreSession = async () => {
      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const data = await apiRequest('/auth/me', { token })
        setUser(normalizeUser(data.user))
      } catch (error) {
        console.error('Session restoration failed:', error)
        setToken(null)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [])

  // Load registrations for the logged-in student.
  useEffect(() => {
    let cancelled = false

    const fetchRegistrations = async () => {
      if (!token || user?.role !== 'student') {
        setRegistrations([])
        return
      }

      try {
        const data = await apiRequest('/registrations/my', { token })

        if (!cancelled) {
          const mappedRegistrations = (data.registrations || []).map(r => ({
            id: r.registration_id,
            eventId: r.event_id,
            usn: user.usn,
            name: user.full_name,
            at: r.registered_at,
            status: r.registration_status
          }))

          setRegistrations(mappedRegistrations)
        }
      } catch (error) {
        console.error('Could not load registrations:', error)
      }
    }

    fetchRegistrations()

    return () => {
      cancelled = true
    }
  }, [token, user])

  const login = async (email, password) => {
    if (!email.trim() || !password.trim()) {
      return 'Enter your email and password.'
    }

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password }
      })

      setToken(data.token)
      setUser(normalizeUser(data.user))
      return null
    } catch (error) {
      return error.message
    }
  }

  const signup = async (name, usn, email, password) => {
    if (!name.trim() || !usn.trim() || !email.trim() || !password.trim()) {
      return 'Please fill in all fields.'
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }

    try {
      await apiRequest('/auth/signup', {
        method: 'POST',
        body: {
          full_name: name.trim(),
          usn: usn.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          password
        }
      })

      // Sign in automatically after successful signup.
      return await login(email, password)
    } catch (error) {
      return error.message
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const register = async id => {
  if (!user || !token) {
    return 'Please log in to register.'
  }

  try {
    await apiRequest(`/registrations/${id}`, {
      method: 'POST',
      token
    })

    const data = await apiRequest('/registrations/my', { token })

    const mappedRegistrations = (data.registrations || []).map(r => ({
      id: r.registration_id,
      eventId: r.event_id,
      usn: user.usn,
      name: user.full_name,
      at: r.registered_at,
      status: r.registration_status
    }))

    setRegistrations(mappedRegistrations)

    return null
  } catch (error) {
    return error.message
  }
}

  const markAttendance = (eventId, usn, status) => {
    setAttendance(p => [
      ...p.filter(a => !(a.eventId === eventId && a.usn === usn)),
      {
        eventId,
        usn,
        status,
        by: user?.usn,
        at: new Date().toISOString()
      }
    ])
  }

  const value = useMemo(() => ({
    user,
    token,
    authLoading,
    users,
    events,
    setEvents,
    registrations,
    attendance,
    theme,
    setTheme,
    login,
    signup,
    logout,
    register,
    markAttendance
  }), [
    user,
    token,
    authLoading,
    users,
    events,
    registrations,
    attendance,
    theme
  ])

  return <C.Provider value={value}>{children}</C.Provider>
}

export const useApp = () => useContext(C)
