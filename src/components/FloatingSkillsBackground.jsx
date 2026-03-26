import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import skills from "../data/skills";

function FloatingIcons() {
    // Flatten all skills to get a single list of icons
    const allSkills = useMemo(() => {
        return skills.flatMap((category) => category.items);
    }, []);

    return (
        <group>
            {allSkills.map((skill, i) => (
                <FloatingIcon key={i} skill={skill} index={i} total={allSkills.length} />
            ))}
        </group>
    );
}

function FloatingIcon({ skill, index, total }) {
    const Icon = skill.icon;

    // Random position distribution usually within a certain range
    const position = useMemo(() => {
        const radius = 10; // Spread radius
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);

        // Convert spherical to cartesian for distribution on a sphere surface (approx)
        // Adding randomness to fill the volume
        const r = radius * Math.cbrt(Math.random());
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        // Spread them out more horizontally for a "cloud" feel
        return [x * 1.5, y * 0.8, z * 0.5 - 2];
    }, []);

    return (
        <Float
            speed={1.5} // Animation speed
            rotationIntensity={1} // XYZ rotation intensity
            floatIntensity={2} // Up/down float intensity
            floatingRange={[-0.5, 0.5]} // Range of y-axis values the object will float within
        >
            <mesh position={position}>
                <Html
                    transform
                    distanceFactor={6} // Scale the HTML content based on distance
                    zIndexRange={[-20, -10]} // Force it behind everything
                    style={{
                        pointerEvents: "none", // Let clicks pass through if needed
                    }}
                >
                    <div
                        className="
              flex items-center justify-center 
              w-12 h-12 
              bg-[#0A0A0A]
              border border-white/5
              transition-opacity duration-1000
            "
                    >
                        <Icon className="text-2xl text-white/50" />
                    </div>
                </Html>
            </mesh>
        </Float>
    );
}

export default function FloatingSkillsBackground() {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
            <Canvas gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                {/* Fog to fade out distant icons */}
                <fog attach="fog" args={["#000000", 8, 20]} />

                <FloatingIcons />
            </Canvas>
        </div>
    );
}
