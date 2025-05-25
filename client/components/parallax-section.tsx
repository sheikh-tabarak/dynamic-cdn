// components/parallax-section.tsx
'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // How much elements move relative to scroll
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ children, className, speed = 0.2 }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        y: -sectionRef.current.offsetHeight * speed, // Move content opposite to scroll
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', // Start when section bottom enters viewport
          end: 'bottom top',   // End when section top leaves viewport
          scrub: true,         // Link animation to scroll position
        },
      });
    }
  }, [speed]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </section>
  );
};

export default ParallaxSection;