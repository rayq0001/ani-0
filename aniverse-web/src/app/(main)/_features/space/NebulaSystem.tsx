"use client"

import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export const NebulaSystem = () => {
    const nebulaTexture = useTexture('/space/nebula.png')
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (!groupRef.current) return
        const t = state.clock.getElapsedTime()
        
        // Very slow organic movement
        groupRef.current.rotation.z = t * 0.02
        groupRef.current.position.x = Math.sin(t * 0.1) * 2
        groupRef.current.position.y = Math.cos(t * 0.15) * 2
    })

    return (
        <group ref={groupRef}>
            {/* Layer 1: Core Nebula */}
            <mesh scale={[500, 500, 1]} position={[0, 0, -100]}>
                <planeGeometry />
                <meshBasicMaterial 
                    map={nebulaTexture} 
                    transparent 
                    opacity={0.6}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Layer 2: Subtle Depth Layer */}
            <mesh scale={[600, 600, 1]} position={[20, -10, -150]} rotation={[0, 0, Math.PI / 4]}>
                <planeGeometry />
                <meshBasicMaterial 
                    map={nebulaTexture} 
                    transparent 
                    opacity={0.3}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    color="#4433ff"
                />
            </mesh>

            {/* Layer 3: Accent Highlights */}
            <mesh scale={[400, 400, 1]} position={[-30, 20, -80]} rotation={[0, 0, -Math.PI / 6]}>
                <planeGeometry />
                <meshBasicMaterial 
                    map={nebulaTexture} 
                    transparent 
                    opacity={0.2}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    color="#ff33aa"
                />
            </mesh>
        </group>
    )
}
