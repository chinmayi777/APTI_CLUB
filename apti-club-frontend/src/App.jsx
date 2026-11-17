import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context'
import Layout from './components/Layout'
import Home from './pages/Home'
import Resources from './pages/Resources'
import Events from './pages/Events'
import Archive from './pages/Archive'
import About from './pages/About'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Coordinator from './pages/Coordinator'
import CoordinatorManagement from './pages/CoordinatorManagement'


function RoleRoute({ allowedRoles, children }) {
  const { user, authLoading } = useApp()

  if (authLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />
    }

    if (user.role === 'coordinator') {
      return <Navigate to="/coordinator" replace />
    }

    return <Navigate to="/" replace />
  }

  return children
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/resources/:category?" element={<Resources/>}/>            
            <Route path="/events" element={<Events />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/admin/coordinators" element={<RoleRoute allowedRoles={['admin']}><CoordinatorManagement /></RoleRoute>}/>
            <Route path="/admin" element={<RoleRoute allowedRoles={['admin', 'coordinator']}><Admin /></RoleRoute>}/>
            <Route path="/coordinator" element={<RoleRoute allowedRoles={['coordinator']}><Coordinator /></RoleRoute>}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AnimatedRoutes />
    </AppProvider>
  )
}