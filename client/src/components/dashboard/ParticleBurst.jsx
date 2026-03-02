import { useRef, useEffect, useState, memo } from 'react';

/**
 * ParticleBurst — Stripe-inspired SVG starburst visual.
 * Renders static radiating lines from center-bottom that react subtly to mouse movement.
 * Performance: No canvas, no continuous animation loops. Uses mousemove → rAF → CSS transform only.
 */
const ParticleBurst = memo(function ParticleBurst() {
    const containerRef = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const rafRef = useRef(null);
    const targetRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    // Generate static line data once
    const lines = useRef(
        Array.from({ length: 60 }, (_, i) => {
            const angle = (i / 60) * Math.PI - Math.PI / 2; // spread from -90 to +90 degrees (upper half)
            const length = 80 + Math.random() * 160; // varied lengths
            const opacity = 0.15 + Math.random() * 0.4;
            const width = 0.5 + Math.random() * 1;
            return { angle, length, opacity, width };
        })
    ).current;

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height;
            // Normalize to -1..1 range with dampening
            targetRef.current = {
                x: ((e.clientX - centerX) / rect.width) * 0.15,
                y: ((e.clientY - centerY) / rect.height) * 0.1,
            };
        };

        const animate = () => {
            // Lerp toward target for smooth movement
            currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.06;
            currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.06;

            // Only update state if change is meaningful (avoid unnecessary re-renders)
            const dx = Math.abs(currentRef.current.x - offset.x);
            const dy = Math.abs(currentRef.current.y - offset.y);
            if (dx > 0.0005 || dy > 0.0005) {
                setOffset({ x: currentRef.current.x, y: currentRef.current.y });
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [offset.x, offset.y]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            <svg
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full"
                viewBox="0 0 800 400"
                preserveAspectRatio="xMidYMax meet"
                style={{
                    transform: `translate3d(${offset.x * 20}px, ${offset.y * 10}px, 0)`,
                    willChange: 'transform',
                }}
            >
                <defs>
                    <radialGradient id="burst-glow" cx="50%" cy="100%" r="60%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                </defs>
                {/* Subtle center glow */}
                <circle cx="400" cy="400" r="200" fill="url(#burst-glow)" />
                {/* Radiating lines */}
                {lines.map((line, i) => {
                    const x1 = 400;
                    const y1 = 400;
                    const x2 = 400 + Math.cos(line.angle) * line.length;
                    const y2 = 400 + Math.sin(line.angle) * line.length;
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth={line.width}
                            opacity={line.opacity}
                            strokeLinecap="round"
                        />
                    );
                })}
                {/* Small dots at line endpoints */}
                {lines.filter((_, i) => i % 3 === 0).map((line, i) => {
                    const cx = 400 + Math.cos(line.angle) * line.length;
                    const cy = 400 + Math.sin(line.angle) * line.length;
                    return (
                        <circle
                            key={`dot-${i}`}
                            cx={cx}
                            cy={cy}
                            r={1 + Math.random() * 1.5}
                            fill="rgba(255,255,255,0.5)"
                            opacity={line.opacity}
                        />
                    );
                })}
            </svg>
        </div>
    );
});

export default ParticleBurst;
