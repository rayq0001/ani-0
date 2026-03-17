"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { NebulaSystem } from './NebulaSystem'
import { HighResStarField } from './HighResStarField'
import { SpaceDust } from './SpaceDust'

export const SpaceScene = () => {
    return (
        <div className="fixed inset-0 bg-[#050510]">
            <Canvas
                shadows
                camera={{ position: [0, 0, 100], fov: 60 }}
                gl={{ antialias: true, stencil: false, depth: true }}
                dpr={[1, 2]} // Support for retina/high-res displays
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={60} far={2000} />
                <color attach="background" args={['#050510']} />
                
                <Suspense fallback={null}>
                    <group>
                        <NebulaSystem />
                        <HighResStarField count={20000} />
                        <SpaceDust count={150} />
                        
                        {/* Ambient Deep Glow */}
                        <pointLight position={[0, 0, 0]} intensity={2} color="#4c1d95" />
                    </group>

                    <EffectComposer disableNormalPass>
                        <Bloom 
                            intensity={1.8}
                            luminanceThreshold={0.15}
                            luminanceSmoothing={0.95}
                            mipmapBlur
                        />
                        <Noise opacity={0.015} premultiply />
                        <ChromaticAberration 
                            offset={new THREE.Vector2(0.0008, 0.0008)} 
                            radialModulation={true}
                        />
                    </EffectComposer>
                </Suspense>

                <OrbitControls 
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.05}
                />
            </Canvas>
        </div>
    )
}
