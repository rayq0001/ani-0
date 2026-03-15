"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LuSearch, 
  LuArrowRight,
  LuAtom
} from "react-icons/lu"
import { toast } from "sonner"
import * as THREE from "three"

interface Galaxy3DLuxuryProps {
  onSearch?: (query: string) => void
}

export function Galaxy3DLuxury({ onSearch }: Galaxy3DLuxuryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const galaxyRef = useRef<THREE.Points | null>(null)
  const animationRef = useRef<number>(0)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isTraveling, setIsTraveling] = useState(false)

  const tags = ["JoJo", "Demon Slayer", "Attack on Titan", "Naruto", "One Piece"]

  // Create star texture
  const createStarTexture = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const context = canvas.getContext('2d')
    if (!context) return null
    
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.5, 'rgba(162, 85, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 32, 32)
    
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  const startJourney = useCallback(() => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a planet name to search")
      return
    }

    setIsSearching(true)
    setIsTraveling(true)

    // Start camera animation
    if (cameraRef.current && galaxyRef.current) {
      const camera = cameraRef.current
      const startPos = camera.position.clone()
      const duration = 4000
      const startTime = Date.now()

      const zoomAnimation = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        // Move camera forward and slightly down
        camera.position.z = startPos.z - (easeProgress * 65) // From 45 to -20
        camera.position.y = startPos.y - (easeProgress * 20) // From 20 to 0
        
        // Increase rotation speed for warp effect
        if (galaxyRef.current) {
          galaxyRef.current.rotation.y += 0.02
        }
        
        if (progress < 1) {
          requestAnimationFrame(zoomAnimation)
        } else {
          // Journey complete - redirect or show results
          setTimeout(() => {
            onSearch?.(searchQuery)
            setIsTraveling(false)
            setIsSearching(false)
          }, 500)
        }
      }
      zoomAnimation()
    }
  }, [searchQuery, onSearch])

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x030308, 0.015)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 20, 45)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x030308, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Galaxy parameters
    const parameters = {
      count: 60000,
      size: 0.3,
      radius: 40,
      branches: 4,
      spin: 1.5,
      randomness: 2.0,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#2030ff'
    }

    // Create galaxy geometry
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3

      // Spiral galaxy math
      const radius = Math.random() * parameters.radius
      const spinAngle = radius * parameters.spin
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.3
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Mix colors based on distance
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Create material with glow
    const material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: createStarTexture(),
      transparent: true
    })

    const galaxy = new THREE.Points(geometry, material)
    scene.add(galaxy)
    galaxyRef.current = galaxy

    // Animation loop
    const clock = new THREE.Clock()
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Slow rotation
      if (galaxyRef.current && !isTraveling) {
        galaxyRef.current.rotation.y = elapsedTime * 0.05
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [createStarTexture, isTraveling])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#030308]">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* UI Container */}
      <AnimatePresence>
        {!isTraveling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="text-center max-w-3xl px-4">
              {/* Icon */}
              <motion.div
                className="mb-4 flex justify-center"
                animate={{ rotate: [0, 360], scale: [1, 1.05, 1] }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ 
                    filter: "drop-shadow(0 0 15px rgba(162, 85, 255, 0.6))"
                  }}
                >
                  <LuAtom className="w-10 h-10 text-[#a255ff]" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold mb-4 text-white"
                style={{ 
                  textShadow: "0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(162, 85, 255, 0.6)",
                  letterSpacing: "-2px"
                }}
              >
                Infinite Space
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#b3b3cc] text-xl mb-10"
              >
                Discover new worlds in a 3D galaxy
              </motion.p>

              {/* Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative flex items-center justify-center mb-8"
              >
                <div 
                  className="relative flex items-center w-full max-w-xl mx-auto"
                  style={{
                    background: "rgba(30, 30, 45, 0.5)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "50px",
                    padding: "5px 5px 5px 20px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <LuSearch 
                    className="w-6 h-6 ml-3"
                    style={{ color: "#888" }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startJourney()}
                    placeholder="Search for a planet (e.g., Attack on Titan)..."
                    className="flex-1 bg-transparent border-none text-white text-lg outline-none text-right"
                    style={{ fontFamily: "inherit" }}
                    disabled={isSearching}
                  />
                  <motion.button
                    onClick={startJourney}
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-6 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
                    style={{ 
                      background: "linear-gradient(90deg, #7b2cbf, #9d4edd)",
                      color: "white",
                      boxShadow: "0 0 20px rgba(123, 44, 191, 0.6)"
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Explore</span>
                    <LuArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div 
                className="flex gap-3 justify-center flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {tags.map((tag, i) => (
                  <motion.button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-5 py-2 rounded-full text-sm transition-all hover:scale-105"
                    style={{ 
                      background: searchQuery === tag ? "rgba(162, 85, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: searchQuery === tag ? "1px solid #a255ff" : "1px solid rgba(255, 255, 255, 0.1)",
                      color: searchQuery === tag ? "white" : "#ccc",
                      boxShadow: searchQuery === tag ? "0 0 15px rgba(162, 85, 255, 0.4)" : "none",
                      backdropFilter: "blur(10px)"
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ 
                      background: "rgba(162, 85, 255, 0.2)",
                      borderColor: "#a255ff",
                      color: "white"
                    }}
                  >
                    {tag}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Travel Message */}
      <AnimatePresence>
        {isTraveling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold text-white"
              style={{ textShadow: "0 0 20px #fff" }}
            >
              Traveling through the galaxy...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
