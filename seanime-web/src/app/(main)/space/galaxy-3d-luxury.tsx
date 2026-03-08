"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LuSearch, 
  LuArrowRight, 
  LuRotateCcw, 
  LuSparkles,
  LuTv,
  LuBookOpen,
  LuFileText,
  LuWand,
  LuStar,
  LuZap,
  LuOrbit
} from "react-icons/lu"
import { toast } from "sonner"
import * as THREE from "three"

interface PlanetData {
  name: string
  type: "anime" | "manga" | "novel" | "ai-story"
  image?: string
  description: string
  tags: string[]
  aiStory?: string
  episodes?: number
  chapters?: number
  rating?: number
}

interface Galaxy3DLuxuryProps {
  onSearch?: (query: string) => void
}

export function Galaxy3DLuxury({ onSearch }: Galaxy3DLuxuryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const galaxyRef = useRef<THREE.Group | null>(null)
  const planetRef = useRef<THREE.Group | null>(null)
  const nebulaRef = useRef<THREE.Points | null>(null)
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showPlanet, setShowPlanet] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [activeTab, setActiveTab] = useState<"anime" | "manga" | "novel" | "ai-story">("anime")
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab)
    if (selectedPlanet) {
      setSelectedPlanet({ ...selectedPlanet, type: tab })
    }
  }, [selectedPlanet])

  const generatePlanetData = useCallback(async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockData: PlanetData = {
      name: query,
      type: activeTab,
      description: "عالم " + query + " هو كوكب مليء بالمغامرات والأسرار، حيث تتقاطع الأبطال والأشرار في صراعات ملحمية.",
      tags: ["مغامرة", "خيال", "أكشن", "دراما", "فانتازيا"],
      aiStory: "في أعماق كوكب " + query + "، تدور أحداث ملحمية عن شجاعة لا تُضاهى وصداقة تتحدى الزمن. يقود البطل رحلة استكشافية عبر مجالات مجهولة، حيث يكتشف قوى خارقة وأسراراً عمرها قرون.",
      episodes: Math.floor(Math.random() * 500) + 50,
      chapters: Math.floor(Math.random() * 1000) + 100,
      rating: Number((Math.random() * 3 + 7).toFixed(1))
    }

    setSelectedPlanet(mockData)
    setIsLoading(false)
    toast.success("تم العثور على كوكب " + query + "! 🪐")
  }, [activeTab])

  const returnToGalaxy = useCallback(() => {
    if (!cameraRef.current) return

    const camera = cameraRef.current
    const startPos = camera.position.clone()
    const targetPos = new THREE.Vector3(0, 30, 100)
    const duration = 2000
    const startTime = Date.now()

    if (planetRef.current) {
      planetRef.current.visible = false
    }
    setShowPlanet(false)
    setSelectedPlanet(null)

    const zoomOutAnimation = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      camera.position.lerpVectors(startPos, targetPos, easeProgress)
      camera.lookAt(0, 0, 0)

      if (progress < 1) {
        requestAnimationFrame(zoomOutAnimation)
      } else {
        setIsSearching(false)
      }
    }

    zoomOutAnimation()
  }, [])

  const startJourney = useCallback(async () => {
    if (!searchQuery.trim() || !cameraRef.current) {
      toast.error("الرجاء إدخال اسم الكوكب للبحث")
      return
    }

    setIsSearching(true)
    setIsLoading(true)

    const camera = cameraRef.current
    const startPos = camera.position.clone()
    const targetPos = new THREE.Vector3(0, 0, 40)
    const duration = 3000
    const startTime = Date.now()

    const zoomAnimation = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 4)

      camera.position.lerpVectors(startPos, targetPos, easeProgress)
      camera.lookAt(0, 0, 0)

      if (progress < 1) {
        requestAnimationFrame(zoomAnimation)
      } else {
        if (planetRef.current) {
          planetRef.current.visible = true
        }
        setShowPlanet(true)
        generatePlanetData(searchQuery)
      }
    }

    zoomAnimation()
    onSearch?.(searchQuery)
  }, [searchQuery, onSearch, generatePlanetData])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x050510, 0.02)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.set(0, 30, 100)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const createLuxuryGalaxy = () => {
      if (!sceneRef.current) return

      const galaxyGroup = new THREE.Group()
      const particleCount = 20000
      const arms = 5
      const armSpread = 0.5
      const galaxyRadius = 80
      
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      const colorInside = new THREE.Color(0xffaa88)
      const colorOutside = new THREE.Color(0x8866ff)
      const colorCenter = new THREE.Color(0xffffff)

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const armIndex = i % arms
        const armAngle = (armIndex / arms) * Math.PI * 2
        const radius = Math.random() * galaxyRadius
        const spinAngle = radius * 0.02
        
        const randomX = (Math.random() - 0.5) * armSpread * radius * 0.1
        const randomY = (Math.random() - 0.5) * 2
        const randomZ = (Math.random() - 0.5) * armSpread * radius * 0.1

        positions[i3] = Math.cos(armAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(armAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        if (radius < galaxyRadius * 0.3) {
          mixedColor.lerp(colorCenter, 1 - radius / (galaxyRadius * 0.3))
        } else {
          mixedColor.lerp(colorOutside, (radius - galaxyRadius * 0.3) / (galaxyRadius * 0.7))
        }

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      const galaxy = new THREE.Points(geometry, material)
      galaxyGroup.add(galaxy)

      const centerGeometry = new THREE.SphereGeometry(5, 32, 32)
      const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffddaa,
        transparent: true,
        opacity: 0.8
      })
      const centerGlow = new THREE.Mesh(centerGeometry, centerMaterial)
      galaxyGroup.add(centerGlow)

      sceneRef.current.add(galaxyGroup)
      galaxyRef.current = galaxyGroup
    }

    const createNebula = () => {
      if (!sceneRef.current) return

      const particleCount = 5000
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos((Math.random() * 2) - 1)
        const radius = 50 + Math.random() * 100

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi)

        colors[i3] = 0.4 + Math.random() * 0.4
        colors[i3 + 1] = 0.1 + Math.random() * 0.3
        colors[i3 + 2] = 0.8 + Math.random() * 0.2
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 4,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })

      const nebula = new THREE.Points(geometry, material)
      sceneRef.current.add(nebula)
      nebulaRef.current = nebula
    }

    const createLuxuryPlanet = () => {
      if (!sceneRef.current) return

      const planetGroup = new THREE.Group()

      const geometry = new THREE.IcosahedronGeometry(15, 32)
      const material = new THREE.MeshPhongMaterial({
        color: 0x4a00e0,
        emissive: 0x8e2de2,
        emissiveIntensity: 0.3,
        shininess: 100,
        specular: 0xffffff
      })

      const planet = new THREE.Mesh(geometry, material)
      planetGroup.add(planet)

      const atmosphereGeo = new THREE.IcosahedronGeometry(16, 32)
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0x8e2de2,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      })
      const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
      planetGroup.add(atmosphere)

      const ringConfigs = [
        { inner: 20, outer: 22, color: 0xff6b6b, opacity: 0.6, tilt: 0.3 },
        { inner: 24, outer: 25, color: 0x4ecdc4, opacity: 0.5, tilt: 0.5 },
        { inner: 28, outer: 30, color: 0xffe66d, opacity: 0.4, tilt: 0.2 },
        { inner: 32, outer: 33, color: 0xa8e6cf, opacity: 0.5, tilt: 0.4 }
      ]

      ringConfigs.forEach((config) => {
        const ringGeo = new THREE.RingGeometry(config.inner, config.outer, 128)
        const ringMat = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: config.opacity,
          side: THREE.DoubleSide
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2 + config.tilt
        ring.userData = { isRing: true }
        planetGroup.add(ring)
      })

      const satelliteConfigs = [
        { color: 0xff6b6b, radius: 22, speed: 0.5, size: 1.5 },
        { color: 0x4ecdc4, radius: 26, speed: 0.3, size: 1.2 },
        { color: 0xffe66d, radius: 30, speed: 0.4, size: 1.8 },
        { color: 0xa8e6cf, radius: 35, speed: 0.6, size: 1.0 }
      ]

      satelliteConfigs.forEach((config) => {
        const satGroup = new THREE.Group()
        
        const satGeo = new THREE.IcosahedronGeometry(config.size, 8)
        const satMat = new THREE.MeshPhongMaterial({ 
          color: config.color,
          emissive: config.color,
          emissiveIntensity: 0.3,
          shininess: 100
        })
        const satellite = new THREE.Mesh(satGeo, satMat)
        
        const glowGeo = new THREE.SphereGeometry(config.size * 2, 16, 16)
        const glowMat = new THREE.MeshBasicMaterial({
          color: config.color,
          transparent: true,
          opacity: 0.2
        })
        const glow = new THREE.Mesh(glowGeo, glowMat)
        satellite.add(glow)
        
        satGroup.add(satellite)
        satGroup.userData = { 
          isSatellite: true, 
          radius: config.radius, 
          speed: config.speed
        }
        
        planetGroup.add(satGroup)
      })

      const particleGeo = new THREE.BufferGeometry()
      const particleCount = 1000
      const particlePos = new Float32Array(particleCount * 3)
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos((Math.random() * 2) - 1)
        const radius = 40 + Math.random() * 20
        
        particlePos[i3] = radius * Math.sin(phi) * Math.cos(theta)
        particlePos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        particlePos[i3 + 2] = radius * Math.cos(phi)
      }
      
      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3))
      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })
      const particles = new THREE.Points(particleGeo, particleMat)
      planetGroup.add(particles)

      planetGroup.visible = false
      sceneRef.current.add(planetGroup)
      planetRef.current = planetGroup
    }

    createLuxuryGalaxy()
    createNebula()
    createLuxuryPlanet()

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      const time = Date.now() * 0.0005

      if (galaxyRef.current) {
        galaxyRef.current.rotation.y += 0.0003
        galaxyRef.current.rotation.x = mouseRef.current.y * 0.05
        galaxyRef.current.rotation.z = mouseRef.current.x * 0.02
      }

      if (nebulaRef.current) {
        nebulaRef.current.rotation.y -= 0.0002
        nebulaRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
      }

      if (planetRef.current && showPlanet) {
        planetRef.current.rotation.y += 0.002
        planetRef.current.children.forEach((child) => {
          if (child.userData.isRing) {
            child.rotation.z += 0.001
          }
          if (child.userData.isSatellite) {
            const satTime = time * child.userData.speed
            child.position.x = Math.cos(satTime) * child.userData.radius
            child.position.z = Math.sin(satTime) * child.userData.radius
            child.position.y = Math.sin(satTime * 2) * 2
          }
        })
      }

      if (camera && !showPlanet) {
        camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.02
        camera.position.y += (30 + mouseRef.current.y * 5 - camera.position.y) * 0.02
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [showPlanet])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, #0a0a1f 0%, #000000 70%)" }}
      />

      <AnimatePresence>
        {!showPlanet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-10"
          >
            <div className="text-center">
              <motion.div
                className="mb-8"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <LuOrbit className="w-24 h-24 text-purple-400 mx-auto" style={{ filter: "drop-shadow(0 0 20px #8e2de2)" }} />
              </motion.div>

              <motion.h1 
                className="text-6xl md:text-8xl font-bold text-white mb-4"
                style={{ 
                  textShadow: "0 0 60px #8e2de2, 0 0 120px #4a00e0",
                  fontFamily: "'Segoe UI', system-ui, sans-serif"
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                الفضاء اللامحدود
              </motion.h1>

              <motion.p 
                className="text-white/60 text-xl mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                اكتشف عوالم جديدة في مجرة ثلاثية الأبعاد
              </motion.p>

              <motion.div 
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startJourney()}
                    placeholder="ابحث عن كوكب..."
                    className="w-96 px-8 py-5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white placeholder-white/40 text-lg outline-none focus:border-purple-500/50 transition-all text-center"
                    style={{ 
                      boxShadow: "0 0 40px rgba(142, 45, 226, 0.2), inset 0 0 20px rgba(142, 45, 226, 0.05)"
                    }}
                    disabled={isSearching}
                  />
                  <LuSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
                </div>

                <motion.button
                  onClick={startJourney}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-8 py-5 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white font-semibold flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{ 
                    boxShadow: "0 0 40px rgba(142, 45, 226, 0.5)",
                    backgroundSize: "200% 200%"
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <LuZap className="w-5 h-5" />
                      </motion.div>
                      <span>جاري البحث...</span>
                    </>
                  ) : (
                    <>
                      <span>استكشف</span>
                      <LuArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.div>

              <motion.div 
                className="flex gap-3 mt-8 justify-center flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {["ون بيس", "ناروتو", "هجوم العمالقة", "ديمون سلاير", "جوجو"].map((suggestion, i) => (
                  <motion.button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 hover:border-purple-500/30 hover:text-white transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlanet && selectedPlanet && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-black/90 backdrop-blur-3xl border-l border-purple-500/30 z-20 overflow-y-auto"
            style={{ boxShadow: "-20px 0 60px rgba(142, 45, 226, 0.3)" }}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold text-white mb-1" style={{ textShadow: "0 0 30px #8e2de2" }}>
                    {selectedPlanet.name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/50">
                    <LuStar className="w-4 h-4 text-yellow-400" />
                    <span>{selectedPlanet.rating}</span>
                  </div>
                </motion.div>
                
                <motion.button
                  onClick={returnToGalaxy}
                  className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LuRotateCcw className="w-6 h-6" />
                </motion.button>
              </div>

              <motion.div 
                className="flex gap-2 mb-6 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {[
                  { id: "anime" as const, icon: LuTv, label: "أنمي" },
                  { id: "manga" as const, icon: LuBookOpen, label: "مانجا" },
                  { id: "novel" as const, icon: LuFileText, label: "رواية" },
                  { id: "ai-story" as const, icon: LuWand, label: "قصة AI" }
                ].map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-purple-600 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4" />
                      {tab.label}
                    </motion.button>
                  )
                })}
              </motion.div>

              <motion.div 
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">
                    {selectedPlanet.episodes}
                  </div>
                  <div className="text-white/50 text-sm">حلقة</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedPlanet.chapters}
                  </div>
                  <div className="text-white/50 text-sm">فصل</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-1">
                    {selectedPlanet.rating}
                    <LuStar className="w-4 h-4" />
                  </div>
                  <div className="text-white/50 text-sm">تقييم</div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {selectedPlanet.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-white font-semibold mb-2">الوصف</h3>
                <p className="text-white/70 leading-relaxed">
                  {selectedPlanet.description}
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <LuSparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">قصة الذكاء الاصطناعي</h3>
                </div>
                <p className="text-white/70 leading-relaxed text-sm">
                  {selectedPlanet.aiStory}
                </p>
              </motion.div>

              <motion.div 
                className="flex gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  مشاهدة الآن
                </motion.button>
                <motion.button
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  إضافة للمفضلة
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
