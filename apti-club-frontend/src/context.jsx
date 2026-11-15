import React,{createContext,useContext,useEffect,useMemo,useState} from 'react'
import {initialEvents} from './data'
const C=createContext(null)
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}}
export function AppProvider({children}){
 const [user,setUser]=useState(()=>read('apti_user',null))
 const [users,setUsers]=useState(()=>read('apti_users',[]))
 const [events,setEvents]=useState(()=>read('apti_events',initialEvents))
 const [registrations,setRegistrations]=useState(()=>read('apti_regs',[]))
 const [attendance,setAttendance]=useState(()=>read('apti_attendance',[]))
 const [theme,setTheme]=useState(()=>localStorage.getItem('apti_theme')||'dark')
 useEffect(()=>{localStorage.setItem('apti_user',JSON.stringify(user))},[user])
 useEffect(()=>{localStorage.setItem('apti_users',JSON.stringify(users))},[users])
 useEffect(()=>{localStorage.setItem('apti_events',JSON.stringify(events))},[events])
 useEffect(()=>{localStorage.setItem('apti_regs',JSON.stringify(registrations))},[registrations])
 useEffect(()=>{localStorage.setItem('apti_attendance',JSON.stringify(attendance))},[attendance])
 useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('apti_theme',theme)},[theme])
const login=(usn,password)=>{
  if(!usn.trim()||!password.trim())
    return 'Enter your USN and password.'

  const found=users.find(
    x=>x.usn.toLowerCase()===usn.toLowerCase()
    && x.password===password
  )

  if(found){
    const role=found.role||'Student'
    setUser({
      usn:found.usn,
      name:found.name,
      role
    })
    return null
  }

  return 'Account not found. Check your credentials.'
}
const signup=(name,usn,password,role='Student')=>{
  if(users.some(x=>x.usn.toLowerCase()===usn.toLowerCase()))
    return 'That USN is already registered.'

  if(!/^[A-Za-z0-9-]{5,20}$/.test(usn))
    return 'Use a valid USN (5–20 letters/numbers).'

  if(password.length<6)
    return 'Password must be at least 6 characters.'

  const u={name,usn,password,role}

  setUsers(p=>[...p,u])
  setUser({name,usn,role})

  return null
} 
 const logout=()=>setUser(null)
 const register=id=>{if(!user)return 'Please log in to register.';if(registrations.some(r=>r.eventId===id&&r.usn===user.usn))return 'You are already registered.';const ev=events.find(e=>e.id===id);if(registrations.filter(r=>r.eventId===id).length>=ev.capacity)return 'This event is full.';setRegistrations(p=>[...p,{eventId:id,usn:user.usn,name:user.name,at:new Date().toISOString()}]);return null}
 const markAttendance=(eventId,usn,status)=>setAttendance(p=>[...p.filter(a=>!(a.eventId===eventId&&a.usn===usn)),{eventId,usn,status,by:user?.usn,at:new Date().toISOString()}])
 const value=useMemo(()=>({user,users,events,setEvents,registrations,attendance,theme,setTheme,login,signup,logout,register,markAttendance}),[user,users,events,registrations,attendance,theme])
 return <C.Provider value={value}>{children}</C.Provider>
}
export const useApp=()=>useContext(C)