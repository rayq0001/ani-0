"use client"

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Bloom, EffectComposer, Noise, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { NebulaSystem } from './NebulaSystem'
import { HighResStarField } from './HighResStarField'

export const SpaceScene = () => {
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Canvas
                gl={{ antialias: true, stencil: false, depth: true }}
                dpr={[1, 2]} // Support for retina/high-res displays
            >
                <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={60} far={2000} />
                <color attach="background" args={['#050510']} />
                
                <Suspense fallback={null}>
                    <group>
                        <NebulaSystem />
                        <HighResStarField count={20000} />
                    </group>

                    <EffectComposer>
                        <Bloom 
                            intensity={1.5}
                            luminanceThreshold={0.2}
                            luminanceSmoothing={0.9}
                            height={480}
                        />
                        <Noise opacity={0.02} />
                        <ChromaticAberration 
                            offset={new THREE.Vector2(0.0005, 0.0005)} 
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
