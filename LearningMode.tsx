'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dish } from '@/data/dishes';
import { UserProfile, updateTasteProfile, generateLearningSet } from '@/services/recommendationEngine';
import SwipeCard from './SwipeCard';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LearningModeProps {
    targetDish: Dish;
    userProfile: UserProfile;
    allDishes: Dish[];
    onComplete: (updatedProfile: UserProfile) => void;
}

export default function LearningMode({ targetDish, userProfile, allDishes, onComplete }: LearningModeProps) {
    const [learningSet, setLearningSet] = useState<Dish[]>([]);
    const [currentProfile, setCurrentProfile] = useState<UserProfile>(userProfile);
    const [activeIndex, setActiveIndex] = useState(0);

    // Initialize Learning Set
    useEffect(() => {
        const set = generateLearningSet(targetDish, allDishes, userProfile);
        setLearningSet(set);
    }, [targetDish, allDishes, userProfile]);

    const handleSwipe = (direction: 'left' | 'right') => {
        const dish = learningSet[activeIndex];
        const isLike = direction === 'right';

        // Update Profile
        const updated = updateTasteProfile(currentProfile, dish, isLike);
        setCurrentProfile(updated);

        // Using a timeout to allow animation to complete before removing from DOM or switching index
        setTimeout(() => {
            setActiveIndex(prev => prev + 1);
        }, 200);
    };

    const progress = Math.min(100, (currentProfile.totalSwipes / 20) * 100);

    useEffect(() => {
        if (currentProfile.totalSwipes >= 20) {
            setTimeout(() => {
                onComplete(currentProfile);
            }, 500); // Small delay to show completion state
        }
    }, [currentProfile.totalSwipes, onComplete, currentProfile]);

    if (learningSet.length === 0) {
        return <div className="flex items-center justify-center h-64">Loading taste data...</div>;
    }

    // If we ran out of cards before 20 swipes (unlikely with 25 generated), handle simple exit
    if (activeIndex >= learningSet.length && currentProfile.totalSwipes < 20) {
        setTimeout(() => onComplete(currentProfile), 500);
        return <div>Finishing up...</div>;
    }

    // Determine which cards to show: active + next 2
    const visibleCards = learningSet.slice(activeIndex, activeIndex + 3);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-md mx-auto relative overflow-hidden">

            {/* Header / Progress */}
            <div className="absolute top-0 left-0 right-0 z-50 p-6 flex flex-col items-center space-y-2 bg-gradient-to-b from-background to-transparent">
                <h3 className="text-xl font-bold text-center">Refining Your Taste</h3>
                <p className="text-sm text-muted-foreground">Swipe right to like, left to dislike</p>

                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="text-xs text-muted-foreground">{currentProfile.totalSwipes} / 20 collected</p>
            </div>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm h-[500px]">
                <AnimatePresence>
                    {visibleCards.map((dish, i) => (
                        <SwipeCard
                            key={dish.id}
                            dish={dish}
                            index={i} // 0 is Top Card, 1 is Second, 2 is Third
                            onSwipe={handleSwipe}
                        />
                    ))}
                </AnimatePresence>

                {/* Empty State behind cards */}
                <div className="absolute inset-0 flex items-center justify-center z-[-1]">
                    <div className="text-center text-muted-foreground opacity-20">
                        <CheckCircle2 className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-xl font-bold">All caught up!</p>
                    </div>
                </div>
            </div>

            {/* Manual Controls */}
            <div className="absolute -bottom-20 flex gap-8 z-50">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center text-destructive hover:scale-110 transition-transform shadow-lg border border-white/5 backdrop-blur-md"
                    aria-label="Dislike"
                >
                    <ArrowLeft className="w-8 h-8" />
                </button>

                <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:scale-110 transition-transform shadow-lg border border-primary/30 backdrop-blur-md"
                    aria-label="Like"
                >
                    <CheckCircle2 className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
