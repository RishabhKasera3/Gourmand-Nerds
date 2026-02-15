'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/services/recommendationEngine';

interface FlavorRadarProps {
    flavorWeights: UserProfile['flavorWeights'];
}

const AXES = [
    { name: 'Spicy', tags: ['spicy', 'hot', 'fiery', 'pepper', 'chili'] },
    { name: 'Sweet', tags: ['sweet', 'syrupy', 'sugary', 'caramel', 'dessert'] },
    { name: 'Sour', tags: ['sour', 'tangy', 'fermented', 'citrus'] },
    { name: 'Rich', tags: ['creamy', 'rich', 'buttery', 'heavy', 'coconut'] },
    { name: 'Crunchy', tags: ['crunchy', 'crispy', 'dry', 'fried'] },
    { name: 'Savory', tags: ['savory', 'umami', 'salty', 'earthy', 'roasted'] },
];

export default function FlavorRadar({ flavorWeights }: FlavorRadarProps) {
    const data = useMemo(() => {
        return AXES.map(axis => {
            let score = 0;
            axis.tags.forEach(tag => {
                // Sum up weights for matching tags
                // Check exact match or partial match
                Object.entries(flavorWeights).forEach(([key, weight]) => {
                    if (key.toLowerCase().includes(tag) || tag.includes(key.toLowerCase())) {
                        score += weight;
                    }
                });
            });
            // Normalize score mostly to 0-10 range for display, clamping at 0
            return { angle: 0, value: Math.max(0, Math.min(10, score)) };
        });
    }, [flavorWeights]);

    // Calculate polygon points
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const angleStep = (Math.PI * 2) / AXES.length;

    const points = data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2; // Start from top
        const valueRatio = d.value / 10; // Assuming max score of 10 for full radius
        const r = valueRatio * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const axisPoints = AXES.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return { x, y, label: AXES[i].name };
    });

    return (
        <div className="relative w-full h-64 flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
                {/* Background Grid (Hexagons) */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((scale, idx) => (
                    <polygon
                        key={idx}
                        points={AXES.map((_, i) => {
                            const angle = i * angleStep - Math.PI / 2;
                            const r = radius * scale;
                            const x = center + r * Math.cos(angle);
                            const y = center + r * Math.sin(angle);
                            return `${x},${y}`;
                        }).join(' ')}
                        fill="transparent"
                        stroke="currentColor"
                        strokeOpacity={0.1}
                        strokeWidth="1"
                    />
                ))}

                {/* Axes Lines */}
                {axisPoints.map((pt, i) => (
                    <line
                        key={i}
                        x1={center}
                        y1={center}
                        x2={pt.x}
                        y2={pt.y}
                        stroke="currentColor"
                        strokeOpacity={0.1}
                        strokeWidth="1"
                    />
                ))}

                {/* Data Polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    points={points}
                    fill="rgba(var(--primary-rgb), 0.2)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    fillOpacity="0.5"
                    className="text-primary"
                />

                {/* Axis Labels */}
                {axisPoints.map((pt, i) => (
                    <text
                        key={i}
                        x={pt.x}
                        y={pt.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[10px] fill-muted-foreground uppercase tracking-wider font-semibold"
                        dx={Math.cos(i * angleStep - Math.PI / 2) * 20}
                        dy={Math.sin(i * angleStep - Math.PI / 2) * 20}
                    >
                        {pt.label}
                    </text>
                ))}
            </svg>
        </div>
    );
}
