'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Dish } from '@/data/dishes';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import React from 'react';

interface SwipeCardProps {
    dish: Dish;
    onSwipe: (direction: 'left' | 'right') => void;
    index: number;
}

export default function SwipeCard({ dish, onSwipe, index }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Interactive Scale (for top card only)
    const activeScale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);

    // Stack Effect
    // index 0 = Top, index 1 = Middle, index 2 = Bottom
    const stackScale = 1 - (index * 0.05);
    const stackY = index * 10;

    // Use either active scale (if top/0) or stack scale
    // But we can't switch transforms easily without layout shifts.
    // Actually, we can just apply stack scale * active scale.
    // When dragging, index is 0, so stackScale is 1. activeScale varies.
    // When not dragging (index > 0), activeScale is default 1 (x=0).

    // Color overlays
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);
    const dislikeOpacity = useTransform(x, [-100, 0], [1, 0]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        } else {
            // Reset - controlled by Framer Motion automatically
        }
    };

    const isTop = index === 0;

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : 1 - (index * 0.3), // Fade out back cards
                scale: isTop ? activeScale : stackScale,
                y: stackY,
                zIndex: 100 - index,
                position: 'absolute',
                top: 0,
                touchAction: 'none'
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={isTop ? { cursor: 'grabbing' } : {}}
            className="w-full max-w-sm h-[500px] bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/10 select-none cursor-grab"
        >
            {/* Image */}
            <div className="relative h-3/5 w-full">
                <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Overlays - Only active on top card really matters, but keeping code clean */}
                <motion.div
                    style={{ opacity: isTop ? likeOpacity : 0 }}
                    className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
                >
                    <ThumbsUp className="w-24 h-24 text-white fill-current" />
                </motion.div>
                <motion.div
                    style={{ opacity: isTop ? dislikeOpacity : 0 }}
                    className="absolute inset-0 bg-destructive/30 flex items-center justify-center"
                >
                    <ThumbsDown className="w-24 h-24 text-white fill-current" />
                </motion.div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                    <span className="text-sm font-semibold text-white">{dish.spiceLevel === 1 ? 'Mild' : dish.spiceLevel === 2 ? 'Medium' : 'Spicy'}</span>
                    <div className="flex">
                        {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-primary mx-0.5" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="h-2/5 p-6 flex flex-col justify-between bg-card text-card-foreground">
                <div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold leading-tight">{dish.name}</h2>
                            <p className="text-muted-foreground">{dish.region} • {dish.cuisine}</p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {dish.flavorTags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground border border-white/5 capitalize">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {dish.description}
                </p>
            </div>
        </motion.div>
    );
}
