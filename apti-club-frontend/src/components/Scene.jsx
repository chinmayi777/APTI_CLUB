import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// A floating stack of books represents the learning and preparation at Apti Club.
function Book({ position, rotation = [0, 0, 0], color, width = 1.8, height = 0.22, depth = 1.15 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -0.045, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#eee9dc" roughness={0.8} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + 0.04, 0.075, depth + 0.04]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh position={[-width / 2 + 0.09, height / 2 + 0.04, 0]}>
        <boxGeometry args={[0.07, 0.085, depth + 0.045]} />
        <meshStandardMaterial color="#f5f0e5" />
      </mesh>
    </group>
  )
}

function KnowledgeOrbit({ position, color, size = 0.13, speed = 1 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.elapsedTime * 0.45 * speed
    ref.current.rotation.y = clock.elapsedTime * 0.65 * speed
  })
  return (
    <Float speed={1.5} floatIntensity={0.8} rotationIntensity={0.5}>
      <mesh ref={ref} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.45} emissive={color} emissiveIntensity={0.18} />
      </mesh>
    </Float>
  )
}

function SceneContent() {
  const group = useRef()
  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.16, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.09, 0.035)
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.3}>
        <group position={[0, -0.15, 0]} rotation={[-0.12, -0.22, -0.08]}>
          <Book position={[0, -0.5, 0.08]} color="#ff684a" rotation={[0, 0, -0.035]} width={2.05} />
          <Book position={[0.08, -0.23, 0]} color="#b7a0ff" rotation={[0, 0, 0.035]} width={1.9} />
          <Book position={[-0.04, 0.04, -0.06]} color="#d7ff45" rotation={[0, 0, -0.02]} width={1.78} />
          {/* Open-book pages */}
          <mesh position={[-0.43, 0.19, 0.04]} rotation={[0.02, 0, -0.13]}>
            <boxGeometry args={[0.78, 0.035, 0.92]} />
            <meshStandardMaterial color="#fffdf4" roughness={0.7} />
          </mesh>
          <mesh position={[0.43, 0.19, 0.04]} rotation={[0.02, 0, 0.13]}>
            <boxGeometry args={[0.78, 0.035, 0.92]} />
            <meshStandardMaterial color="#fffdf4" roughness={0.7} />
          </mesh>
        </group>
      </Float>

      <Float speed={1.4} floatIntensity={0.5}>
        <mesh position={[0.05, 1.08, -0.1]} rotation={[0.2, 0.3, 0.15]}>
          <torusGeometry args={[0.63, 0.035, 12, 80]} />
          <meshStandardMaterial color="#d7ff45" metalness={0.65} roughness={0.22} />
        </mesh>
      </Float>
      <KnowledgeOrbit position={[-1.45, 0.85, 0.1]} color="#ff684a" size={0.16} speed={1.1} />
      <KnowledgeOrbit position={[1.42, 0.7, -0.25]} color="#b7a0ff" size={0.2} speed={0.8} />
      <KnowledgeOrbit position={[1.55, -0.8, 0.2]} color="#d7ff45" size={0.12} speed={1.4} />
      <KnowledgeOrbit position={[-1.45, -0.72, -0.2]} color="#f5f0e5" size={0.1} speed={0.9} />
      <mesh position={[0, -1.18, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.24, 80]} />
        <meshBasicMaterial color="#d7ff45" transparent opacity={0.45} />
      </mesh>
      <ContactShadows position={[0, -1.32, 0]} opacity={0.28} scale={4.5} blur={2.5} far={2} />
    </group>
  )
}

export default function Scene() {
  return (
    <div className="scene-wrap" aria-label="3D illustration of a floating stack of books and learning symbols">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 43 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={2.8} />
        <pointLight position={[-3, -2, 2]} color="#ff684a" intensity={1.8} />
        <Suspense fallback={null}>
          <SceneContent />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
