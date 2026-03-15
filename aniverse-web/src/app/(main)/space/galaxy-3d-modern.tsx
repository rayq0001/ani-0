"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LuSearch, 
  LuArrowRight,
  LuAtom,
  LuSparkles,
  LuZap,
  LuOrbit,
  LuRocket
} from "react-icons/lu"
import { toast } from "sonner"
import * as THREE from "three"
import { useCosmicSearch } from "@/api/hooks/space.hooks"

interface Galaxy3DModernProps {
  onSearch?: (query: string, results: any[]) => void
}

export function Galaxy3DModern({ onSearch }: Galaxy3DModernProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const galaxyRef = useRef<THREE.Points | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isTraveling, setIsTraveling] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const cosmicSearch = useCosmicSearch()

  const tags = [
    { name: "Jujutsu Kaisen", color: "#ff6b6b" },
    { name: "Demon Slayer", color: "#4ecdc4" },
    { name: "Attack on Titan", color: "#ffe66d" },
    { name: "Naruto", color: "#ff9f43" },
    { name: "One Piece", color: "#5f27cd" }
  ]

  // Create star texture with glow
  const createStarTexture = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    if (!context) return null
    
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.1, 'rgba(255,255,255,0.9)')
    gradient.addColorStop(0.3, 'rgba(162, 85, 255, 0.4)')
    gradient.addColorStop(0.6, 'rgba(100, 200, 255, 0.1)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Create particle texture
  const createParticleTexture = useCallback(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const context = canvas.getContext('2d')
    if (!context) return null
    
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(0.5, 'rgba(100, 200, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 32, 32)
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  const startJourney = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term")
      return
    }

    setIsSearching(true)
    setIsTraveling(true)

    // Start camera warp animation
    if (cameraRef.current && galaxyRef.current) {
      const camera = cameraRef.current
      const startPos = camera.position.clone()
      const duration = 3000
      const startTime = Date.now()

      const warpAnimation = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Exponential ease out for warp effect
        const easeProgress = 1 - Math.pow(1 - progress, 4)
        
        // Move camera forward through space
        camera.position.z = startPos.z - (easeProgress * 80)
        camera.position.y = startPos.y - (easeProgress * 10)
        
        // Increase rotation speed for warp effect
        if (galaxyRef.current) {
          galaxyRef.current.rotation.y += 0.05
          galaxyRef.current.rotation.x += 0.02
        }
        
        if (progress < 1) {
          requestAnimationFrame(warpAnimation)
        } else {
          // Animation complete - perform search
          performSearch()
        }
      }
      warpAnimation()
    }
  }, [searchQuery])

  const performSearch = async () => {
    try {
      const result = await cosmicSearch.mutateAsync({
        query: searchQuery,
        dnaFilters: {
          heroArchetype: 50,
          worldSetting: 50,
          powerSystem: 50,
          conflictType: 50,
          romanceLevel: 30,
          comedyLevel: 40,
          darknessLevel: 50,
          mysteryLevel: 50,
          selectedGenes: []
        },
        emotionalState: [],
        yearRange: { from: 1990, to: 2024 },
        includeDimensions: ["anime", "manga"],
        excludeGenres: [],
        minSimilarity: 0.5,
        maxResults: 20
      })

      if (result?.results) {
        setSearchResults(result.results)
        setShowResults(true)
        onSearch?.(searchQuery, result.results)
      }
    } catch (error) {
      toast.error("Search failed. Please try again.")
      console.error("Search error:", error)
    } finally {
      setIsTraveling(false)
      setIsSearching(false)
    }
  }

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    
    // Scene setup with dark space background
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050510, 0.008)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 15, 60)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup with high performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x050510, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create main galaxy
    const galaxyParams = {
      count: 80000,
      size: 0.25,
      radius: 50,
      branches: 5,
      spin: 1.2,
      randomness: 1.8,
      randomnessPower: 4,
      insideColor: '#ff4d8d',
      outsideColor: '#4d79ff'
    }

    const galaxyGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(galaxyParams.count * 3)
    const colors = new Float32Array(galaxyParams.count * 3)
    const sizes = new Float32Array(galaxyParams.count)

    const colorInside = new THREE.Color(galaxyParams.insideColor)
    const colorOutside = new THREE.Color(galaxyParams.outsideColor)

    for (let i = 0; i < galaxyParams.count; i++) {
      const i3 = i * 3

      // Spiral galaxy math with multiple arms
      const radius = Math.random() * galaxyParams.radius
      const spinAngle = radius * galaxyParams.spin
      const branchAngle = ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius
      const randomY = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius * 0.2
      const randomZ = Math.pow(Math.random(), galaxyParams.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * galaxyParams.randomness * radius

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      // Mix colors based on distance
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / galaxyParams.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b

      // Vary star sizes
      sizes[i] = Math.random() * 2
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Create material with custom shader-like effect
    const galaxyMaterial = new THREE.PointsMaterial({
      size: galaxyParams.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: createStarTexture(),
      transparent: true,
      opacity: 0.9
    })

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxy)
    galaxyRef.current = galaxy

    // Create background stars
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 5000
    const starsPositions = new Float32Array(starsCount * 3)
    const starsColors = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3
      starsPositions[i3] = (Math.random() - 0.5) * 400
      starsPositions[i3 + 1] = (Math.random() - 0.5) * 400
      starsPositions[i3 + 2] = (Math.random() - 0.5) * 400

      // White to blue tint
      const tint = Math.random()
      starsColors[i3] = 0.8 + tint * 0.2
      starsColors[i3 + 1] = 0.8 + tint * 0.2
      starsColors[i3 + 2] = 1
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starsColors, 3))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars

    // Animation loop
    const clock = new THREE.Clock()
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Rotate galaxy slowly
      if (galaxyRef.current && !isTraveling) {
        galaxyRef.current.rotation.y = elapsedTime * 0.03
        galaxyRef.current.rotation.z = Math.sin(elapsedTime * 0.1) * 0.02
      }

      // Rotate background stars
      if (starsRef.current) {
        starsRef.current.rotation.y = elapsedTime * 0.005
        starsRef.current.rotation.x = elapsedTime * 0.002
      }

      // Mouse parallax effect
      if (cameraRef.current && !isTraveling) {
        const targetX = mouseRef.current.x * 5
        const targetY = mouseRef.current.y * 5
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.02
        cameraRef.current.lookAt(0, 0, 0)
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

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationRef.current)
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      galaxyGeometry.dispose()
      galaxyMaterial.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
    }
  }, [createStarTexture, createParticleTexture, isTraveling])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050510]">
      {/* Three.js Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050510]/80" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* UI Container */}
      <AnimatePresence mode="wait">
        {!isTraveling && !showResults && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="text-center max-w-4xl px-6">
              {/* Floating icon */}
              <motion.div
                className="mb-6 flex justify-center"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                    <LuOrbit className="w-10 h-10 text-white" />
                  </div>
                  {/* Orbiting particles */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute -top-2 left-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-500/50" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-1/2 -right-2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-500/50" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Title with glow effect */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-4"
              >
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    Unlimited
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Space
                  </span>
                </h1>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500" />
                  <LuSparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 text-sm tracking-widest uppercase">Cosmic Discovery</span>
                  <LuSparkles className="w-5 h-5 text-purple-400" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500" />
                </div>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Explore infinite anime galaxies through AI-powered cosmic search. 
                Discover new worlds based on story DNA and emotional resonance.
              </motion.p>

              {/* Modern Search Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative max-w-2xl mx-auto mb-8"
              >
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                  
                  <div className="relative flex items-center bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-2">
                    <div className="pl-4">
                      <LuSearch className="w-6 h-6 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && startJourney()}
                      placeholder="Search for anime, manga, or cosmic themes..."
                      className="flex-1 bg-transparent border-none text-white text-lg px-4 py-3 outline-none placeholder:text-gray-500"
                      disabled={isSearching}
                    />
                    <motion.button
                      onClick={startJourney}
                      disabled={isSearching || !searchQuery.trim()}
                      className="px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Explore</span>
                      <LuRocket className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div 
                className="flex gap-3 justify-center flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {tags.map((tag, i) => (
                  <motion.button
                    key={tag.name}
                    onClick={() => setSearchQuery(tag.name)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20"
                    style={{ 
                      color: searchQuery === tag.name ? tag.color : '#9ca3af',
                      borderColor: searchQuery === tag.name ? tag.color : undefined,
                      backgroundColor: searchQuery === tag.name ? `${tag.color}20` : undefined
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {tag.name}
                  </motion.button>
                ))}
              </motion.div>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-12 flex justify-center gap-8 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <LuZap className="w-4 h-4 text-yellow-400" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuAtom className="w-4 h-4 text-purple-400" />
                  <span>Story DNA</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuOrbit className="w-4 h-4 text-blue-400" />
                  <span>Cosmic Search</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Warp/Travel Animation */}
        {isTraveling && (
          <motion.div
            key="traveling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <LuRocket className="w-16 h-16 text-white mx-auto" />
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Warp Speed
              </motion.h2>
              <p className="text-purple-300 text-xl">Traveling through the cosmic database...</p>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {showResults && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 z-30 bg-[#050510]/95 backdrop-blur-xl overflow-auto"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Cosmic Results</h2>
                  <p className="text-gray-400">Found {searchResults.length} matches for "{searchQuery}"</p>
                </div>
                <motion.button
                  onClick={() => {
                    setShowResults(false)
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  New Search
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="w-full h-48 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl mb-4 flex items-center justify-center">
                        <LuAtom className="w-12 h-12 text-white/30" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{result.title || "Unknown"}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{result.description || "No description available"}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                          {result.type || "Anime"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                          {(result.similarity * 100).toFixed(0)}% Match
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
