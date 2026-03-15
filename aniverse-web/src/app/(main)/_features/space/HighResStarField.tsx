"use client"

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const HighResStarField = ({ count = 15000 }) => {
    const pointsRef = useRef<THREE.Points>(null)

    const [positions, colors, sizes] = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Distribute stars in a large sphere
            const r = 400 + Math.random() * 600
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = r * Math.cos(phi)

            // Star colors (mostly white/blue, some yellow/red)
            const mix = Math.random()
            if (mix > 0.9) {
                // Blueish
                colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0
            } else if (mix > 0.8) {
                // Yellowish
                colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.7
            } else {
                // White
                colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0
            }

            sizes[i] = Math.random() * 2.0 + 0.5
        }
        return [positions, colors, sizes]
    }, [count])

    useFrame((state) => {
        if (!pointsRef.current) return
        const t = state.clock.getElapsedTime()
        
        // Subtle rotation for parallax
        pointsRef.current.rotation.y = t * 0.005
        pointsRef.current.rotation.x = t * 0.002
    })

    const vertexShader = `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `

    const fragmentShader = `
        varying vec3 vColor;
        void main() {
            float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (dist > 0.5) discard;
            float strength = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(vColor, strength);
        }
    `

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={sizes.length}
                    array={sizes}
                    itemSize={1}
                    args={[sizes, 1]}
                />
            </bufferGeometry>
            <shaderMaterial
                uniforms={{
                    time: { value: 0 }
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}
