// // components/hero-3d-scene.tsx
// 'use client'; // This component MUST be a client component because it uses browser APIs (canvas, WebGL)

// import React, { useRef, useEffect } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, Stars, Sphere, Html, PresentationControls } from '@react-three/drei';
// import * as THREE from 'three';

// // Optional: A simple glow material for spheres
// const GlowMaterial = ({ color, opacity }: { color: string, opacity: number }) => (
//     <meshStandardMaterial
//         emissive={new THREE.Color(color)}
//         emissiveIntensity={0.8}
//         toneMapped={false}
//         transparent
//         opacity={opacity}
//     />
// );

// interface RotatingSphereProps {
//     position: [number, number, number];
//     color: string;
//     size?: number;
//     rotationSpeed?: number;
//     glow?: boolean;
// }

// const RotatingSphere: React.FC<RotatingSphereProps> = ({ position, color, size = 0.5, rotationSpeed = 0.005, glow = true }) => {
//     const meshRef = useRef<THREE.Mesh>(null!);
//     const { viewport } = useThree();

//     useFrame((state, delta) => {
//         // Basic rotation
//         meshRef.current.rotation.x += rotationSpeed;
//         meshRef.current.rotation.y += rotationSpeed * 0.5;

//         // Optional: Parallax effect based on mouse position
//         const x = (state.mouse.x * viewport.width) / 10;
//         const y = (state.mouse.y * viewport.height) / 10;
//         meshRef.current.position.x = position[0] + x;
//         meshRef.current.position.y = position[1] + y;
//     });

//     return (
//         <Sphere args={[size, 32, 32]} position={position} ref={meshRef}>
//             {glow ? (
//                 <GlowMaterial color={color} opacity={0.6} />
//             ) : (
//                 <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
//             )}
//         </Sphere>
//     );
// };


// const Hero3DScene: React.FC = () => {
//     return (
//         <Canvas
//             camera={{ position: [0, 0, 8], fov: 60 }}
//             dpr={[1, 2]} // Device Pixel Ratio
//             className="!absolute !inset-0" // Important for fitting correctly
//             style={{ background: 'transparent' }} // Let parent control background
//         >
//             {/* Lights for the scene */}
//             <ambientLight intensity={0.5} />
//             <pointLight position={[10, 10, 10]} intensity={1} color="#a020f0" /> {/* Purple light */}
//             <pointLight position={[-10, -10, -10]} intensity={0.7} color="#00ffff" /> {/* Cyan light */}
//             <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ff00ff" /> {/* Magenta spot */}

//             {/* Stars for a cosmic background */}
//             <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

//             {/* Main rotating central element - could be a more complex model */}
//             <RotatingSphere position={[0, 0, 0]} color="#8A2BE2" size={1.5} rotationSpeed={0.002} /> {/* Blue Violet */}

//             {/* Smaller, scattered, rotating elements */}
//             <RotatingSphere position={[3, 2, -2]} color="#00FFFF" size={0.7} rotationSpeed={0.008} /> {/* Cyan */}
//             <RotatingSphere position={[-4, -1, 3]} color="#FF00FF" size={0.6} rotationSpeed={0.01} /> {/* Magenta */}
//             <RotatingSphere position={[0, -3, -1]} color="#FFFF00" size={0.8} rotationSpeed={0.007} /> {/* Yellow */}
//             <RotatingSphere position={[2, -4, 4]} color="#00FF00" size={0.5} rotationSpeed={0.009} /> {/* Green */}

//             {/* OrbitControls for development (remove in production if not desired) */}
//             {/* <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> */}
//             {/* PresentationControls offer more constrained and natural movement */}
//             <PresentationControls
//                 global
//                 // config is often meant for default spring values. If it errors, remove or simplify.
//                 // snap is often a boolean to enable/disable snapping.
//                 snap={true} // or false if you don't want snapping
//                 rotation={[0, 0.3, 0]}
//                 polar={[-Math.PI / 3, Math.PI / 3]}
//                 azimuth={[-Math.PI / 1.4, Math.PI / 2]}
//             >
//                 {/* ... */}
//             </PresentationControls>
//             {/* Optional: HTML element rendered in 3D space */}
//             {/* <Html position={[0, 0, -3]}>
//         <div style={{ color: 'white', fontSize: '24px', whiteSpace: 'nowrap' }}>
//           WEB 3.0 PROTOCOL
//         </div>
//       </Html> */}
//         </Canvas>
//     );
// };

// export default Hero3DScene;


// components/hero-3d-scene.tsx
'use client'; // This component MUST be a client component because it uses browser APIs (canvas, WebGL)

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// Optional: A simple glow material for spheres
const GlowMaterial = ({ color, opacity }: { color: string, opacity: number }) => (
    <meshStandardMaterial
        emissive={new THREE.Color(color)}
        emissiveIntensity={0.8}
        toneMapped={false}
        transparent
        opacity={opacity}
    />
);

interface RotatingSphereProps {
    position: [number, number, number];
    color: string;
    size?: number;
    rotationSpeed?: number;
    glow?: boolean;
}

const RotatingSphere: React.FC<RotatingSphereProps> = ({ position, color, size = 0.5, rotationSpeed = 0.005, glow = true }) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { viewport } = useThree();

    useFrame((state) => {
        // Basic rotation
        meshRef.current.rotation.x += rotationSpeed;
        meshRef.current.rotation.y += rotationSpeed * 0.5;

        // Optional: Parallax effect based on mouse position
        const x = (state.mouse.x * viewport.width) / 10;
        const y = (state.mouse.y * viewport.height) / 10;
        //  const x = state.mouse.x * viewport.width / 10; // Adjusted for better parallax effect
        //  const y = state.mouse.y * viewport.height / 10; // Adjusted for better parallax effect
        // const y = state.mouse.y;
        meshRef.current.position.x = position[0] + x;
        meshRef.current.position.y = position[1] + y;
    });

    return (
        <Sphere args={[size, 32, 32]} position={position} ref={meshRef}>
            {glow ? (
                <GlowMaterial color={color} opacity={0.6} />
            ) : (
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            )}
        </Sphere>
    );
};

// New component for slow moving star-like dots with increased speed
const MovingDots: React.FC = () => {
    const dotsRef = useRef<THREE.Mesh[]>([]);

    useFrame(() => {
        dotsRef.current.forEach((dot, index) => {
            if (dot) {
                // Increased speed of movement
                dot.position.y += Math.sin(Date.now() * 0.0010 + index) * 0.004;
                dot.position.x += Math.cos(Date.now() * 0.0010 + index) * 0.004;
            }
        });
    });

    const createDots = () => {
        const dots = [];
        const count = 4000; // dense star field
        for (let i = 0; i < count; i++) {
            const position: [number, number, number] = [
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
            ];
            dots.push(
                <Sphere
                    key={i}
                    args={[0.02, 8, 8]} // small star-like spheres
                    position={position}
                    ref={(el) => { if (el) dotsRef.current[i] = el }}
                >
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
                </Sphere>
            );
        }
        return dots;
    };

    return <>{createDots()}</>;
};

// New bigger circle that follows mouse cursor smoothly
const LargerFollowerCircle: React.FC = () => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const { viewport } = useThree();

    // Smooth follow delta for interpolation
    const targetPosition = useRef({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });

    useFrame((state, delta) => {
        targetPosition.current.x = (state.mouse.x * viewport.width) / 6;  // A bit smaller area than RotatingSphere parallax
        targetPosition.current.y = (state.mouse.y * viewport.height) / 6;

        // Linear interpolation for smoothness
        currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.1;
        currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.1;

        if(meshRef.current){
            meshRef.current.position.x = currentPosition.current.x;
            meshRef.current.position.y = currentPosition.current.y;
        }
    });

    return (
        <Sphere args={[1.0, 32, 32]} ref={meshRef} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
        </Sphere>
    );
};

const Hero3DScene: React.FC = () => {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 2]} // Device Pixel Ratio
            className="!absolute !inset-0" // Important for fitting correctly
            style={{ background: 'transparent' }} // Let parent control background
        >
            {/* Lights for the scene */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#a020f0" /> {/* Purple light */}
            <pointLight position={[-10, -10, -10]} intensity={0.7} color="#00ffff" /> {/* Cyan light */}
            <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow color="#ff00ff" /> {/* Magenta spot */}

            {/* Stars for a cosmic background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

            {/* Main rotating central element */}
            <RotatingSphere position={[0, 0, 0]} color="#8A2BE2" size={0.5} rotationSpeed={0.002} />

            {/* Smaller, scattered, rotating elements */}
            {/* <RotatingSphere position={[3, 2, -2]} color="#00FFFF" size={0.2} rotationSpeed={0.008} /> */}
            {/* <RotatingSphere position={[-3, -1, 3]} color="#FF00FF" size={0.3} rotationSpeed={0.01} /> */}
            {/* <RotatingSphere position={[0, -3, -1]} color="#FFFF00" size={0.5} rotationSpeed={0.007} /> */}
            {/* <RotatingSphere position={[2, -4, 4]} color="#00FF00" size={0.4} rotationSpeed={0.009} /> */}

            {/* Add slow moving star-like dots with increased speed */}
            <MovingDots />

            {/* Add bigger circle that follows the mouse cursor */}
            <LargerFollowerCircle />

            <PresentationControls
                global
                snap={true}
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
            >
                {/* ... */}
            </PresentationControls>
        </Canvas>
    );
};

export default Hero3DScene;

