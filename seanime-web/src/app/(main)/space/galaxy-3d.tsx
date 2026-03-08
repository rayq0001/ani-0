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
  LuStar
} from "react-icons/lu"
import { toast } from "sonner"
import * as THREE from "three"

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Types
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

interface Galaxy3DProps {
  onSearch?: (query: string) => void
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main Component
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function Galaxy3D({ onSearch }: Galaxy3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const planetRef = useRef<THREE.Group | null>(null)
  const animationRef = useRef<number>(0)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showPlanet, setShowPlanet] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [activeTab, setActiveTab] = useState<"anime" | "manga" | "novel" | "ai-story">("anime")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.03)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create galaxy stars
    createGalaxy()

    // Create planet (hidden initially)
    createPlanet()

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      // Rotate galaxy
      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0005
        starsRef.current.rotation.x += 0.0002
      }

      // Rotate planet if visible
      if (planetRef.current && showPlanet) {
        planetRef.current.rotation.y += 0.005
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
    }
  }, [showPlanet])

  // Create galaxy stars
  const createGalaxy = () => {
    if (!sceneRef.current) return

    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 15000
    const posArray = new Float32Array(starsCount * 3)
    const colorsArray = new Float32Array(starsCount * 3)

    for (let i = 0; i < starsCount * 3; i += 3) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 100
      posArray[i + 1] = (Math.random() - 0.5) * 100
      posArray[i + 2] = (Math.random() - 0.5) * 100

      // Colors (purple, blue, white)
      const colorType = Math.random()
      if (colorType < 0.3) {
        // Purple
        colorsArray[i] = 0.5
        colorsArray[i + 1] = 0.2
        colorsArray[i + 2] = 1
      } else if (colorType < 0.6) {
        // Blue
        colorsArray[i] = 0.2
        colorsArray[i + 1] = 0.5
        colorsArray[i + 2] = 1
      } else {
        // White
        colorsArray[i] = 1
        colorsArray[i + 1] = 1
        colorsArray[i + 2] = 1
      }
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    starsGeometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })

    const starsMesh = new THREE.Points(starsGeometry, starsMaterial)
    sceneRef.current.add(starsMesh)
    starsRef.current = starsMesh
  }

  // Create planet
  const createPlanet = () => {
    if (!sceneRef.current) return

    const planetGroup = new THREE.Group()

    // Main planet sphere
    const geometry = new THREE.SphereGeometry(2, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x7f00ff,
      emissive: 0x3f007f,
      emissiveIntensity: 0.2,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const planet = new THREE.Mesh(geometry, material)
    planetGroup.add(planet)

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.2, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x9f4fff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    planetGroup.add(atmosphere)

    // Rings
    const ringGeometry = new THREE.RingGeometry(2.8, 3.2, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xbf8fff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    })
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.rotation.x = Math.PI / 2
    planetGroup.add(ring)

    // Satellites (orbiting objects)
    const satelliteColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xa8e6cf]
    satelliteColors.forEach((color, index) => {
      const satGeometry = new THREE.SphereGeometry(0.15, 16, 16)
      const satMaterial = new THREE.MeshPhongMaterial({ color })
      const satellite = new THREE.Mesh(satGeometry, satMaterial)
      
      const angle = (index / 4) * Math.PI * 2
      const radius = 4 + index * 0.5
      satellite.position.x = Math.cos(angle) * radius
      satellite.position.z = Math.sin(angle) * radius
      
      planetGroup.add(satellite)
    })

    planetGroup.visible = false
    sceneRef.current.add(planetGroup)
    planetRef.current = planetGroup
  }

  // Start journey animation
  const startJourney = useCallback(async () => {
    if (!searchQuery.trim() || !cameraRef.current || !starsRef.current) {
      toast.error("الرجاء إدخال اسم الكوكب للبحث")
      return
    }

    setIsSearching(true)
    setIsLoading(true)

    // Camera zoom animation
    const camera = cameraRef.current
    const targetZ = 0.5
    const startZ = camera.position.z
    const duration = 2000
    const startTime = Date.now()

    const zoomAnimation = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

      camera.position.z = startZ + (targetZ - startZ) * easeProgress

      if (progress < 1) {
        requestAnimationFrame(zoomAnimation)
      } else {
        // Show planet
        if (planetRef.current) {
          planetRef.current.visible = true
          planetRef.current.position.z = -2
        }
        setShowPlanet(true)
        generatePlanetData(searchQuery)
      }
    }

    zoomAnimation()
    onSearch?.(searchQuery)
  }, [searchQuery, onSearch])

  // Generate planet data (mock AI generation)
  const generatePlanetData = async (query: string) => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockData: PlanetData = {
      name: query,
      type: activeTab,
      description: `عالم ${query} هو كوكب مليء بالمغامرات والأسرار، حيث تتقاطع الأبطال والأشرار في صراعات ملحمية.`,
      tags: ["مغامرة", "خيال", "أكشن", "دراما"],
      aiStory: `في أعماق كوكب ${query}، تدور أحداث ملحمية عن شجاعة لا تُضاهى وصداقة تتحدى الزمن. يقود البطل رحلة استكشافية عبر مجالات مجهولة، حيث يكتشف قوى خارقة وأسراراً عمرها قرون. في كل خطوة، يواجه تحديات تختبر إرادته، لكنه يتعلم أن القوة الحقيقية تأتي من الروابط التي يبنيها مع رفاقه. هذه القصة ليست مجرد مغامرة، بل هي رحلة اكتشاف الذات والعثور على المعنى الحقيقي للبطولة.`,
      episodes: Math.floor(Math.random() * 500) + 50,
      chapters: Math.floor(Math.random() * 1000) + 100,
      rating: Number((Math.random() * 3 + 7).toFixed(1))
    }

    setSelectedPlanet(mockData)
    setIsLoading(false)
    toast.success(`تم العثور على كوكب ${query}!`)
  }

  // Return to galaxy
  const returnToGalaxy = useCallback(() => {
    if (!cameraRef.current) return

    const camera = cameraRef.current
    const targetZ = 5
    const startZ = camera.position.z
    const duration = 1500
    const startTime = Date.now()

    // Hide planet
    if (planetRef.current) {
      planetRef.current.visible = false
    }
    setShowPlanet(false)
    setSelectedPlanet(null)

    const zoomOutAnimation = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      camera.position.z = startZ + (targetZ - startZ) * easeProgress

      if (progress < 1) {
        requestAnimationFrame(zoomOutAnimation)
      } else {
        setIsSearching(false)
      }
    }

    zoomOutAnimation()
  }, [])

  // Handle tab change
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab)
    if (selectedPlanet) {
      setSelectedPlanet({
        ...selectedPlanet,
        type: tab
      })
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, #0a0a1f 0%, #000000 70%)" }}
      />

      {/* Search Overlay */}
      <AnimatePresence>
        {!showPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-8"
              style={{ 
                textShadow: "0 0 40px #7f00ff, 0 0 80px #3f007f",
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
              animate={{ 
                textShadow: [
                  "0 0 40px #7f00ff, 0 0 80px #3f007f",
                  "0 0 60px #9f4fff, 0 0 100px #5f1faf",
                  "0 0 40px #7f00ff, 0 0 80px #3f007f"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              الفضاء اللامحدود
            </motion.h1>

            <motion.p 
              className="text-white/60 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              اكتشف عوالم جديدة من خلال البحث في المجرة
            </motion.p>

            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startJourney()}
                  placeholder="ابحث عن كوكب (مثلاً: ون بيس)..."
                  className="w-80 md:w-96 px-6 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 text-lg outline-none focus:border-purple-500/50 transition-all"
                  style={{ boxShadow: "0 0 30px rgba(127, 0, 255, 0.2)" }}
                  disabled={isSearching}
                />
                <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              </div>

              <motion.button
                onClick={startJourney}
                disabled={isSearching || !searchQuery.trim()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 0 30px rgba(127, 0, 255, 0.4)" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <LuRotateCcw className="w-5 h-5" />
                    </motion.div>
                    جاري البحث...
                  </>
                ) : (
                  <>
                    استكشف
                    <LuArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Quick suggestions */}
            <motion.div 
              className="flex gap-3 mt-6 justify-center flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {["ون بيس", "ناروتو", "هجوم العمالقة", "ديمون سلاير"].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:border-purple-500/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Planet Info Panel */}
      <AnimatePresence>
        {showPlanet && selectedPlanet && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-purple-500/30 z-20 overflow-y-auto"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <motion.h2 
                  className="text-3xl font-bold text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedPlanet.name}
                </motion.h2>
                <motion.button
                  onClick={returnToGalaxy}
                  className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <LuRotateCcw className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Type Tabs */}
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

              {/* Stats */}
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

              {/* Tags */}
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

              {/* Description */}
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

              {/* AI Story */}
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

              {/* Action Buttons */}
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
