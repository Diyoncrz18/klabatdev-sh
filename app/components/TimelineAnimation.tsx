'use client';

import { useEffect, useRef, useState } from 'react';

interface TimelineAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  startOffset?: number;
}

export default function TimelineAnimation({ 
  children, 
  delay = 0, 
  duration = 1000,
  startOffset = 0 
}: TimelineAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          const startTime = Date.now() + delay;
          
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min(elapsed / duration, 1);
            setProgress(currentProgress);
            
            if (currentProgress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          setTimeout(() => {
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, duration]);

  const opacity = isVisible ? progress : 0;
  const translateY = isVisible ? (1 - progress) * 50 : 50;
  const scale = isVisible ? 0.8 + (progress * 0.2) : 0.8;

  return (
    <div
      ref={ref}
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    >
      {children}
    </div>
  );
}

