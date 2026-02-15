'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '@/services/recommendationEngine';
import { MapPin, Flame, Leaf, UtensilsCrossed } from 'lucide-react';
import { clsx } from 'clsx';

interface OnboardingProps {
    onComplete: (region: UserProfile['baseRegion'], isVeg: boolean, spice: UserProfile['spiceTolerance']) => void;
}

const REGIONS = ['North', 'South', 'East', 'West'] as const;
const SPICE_LEVELS = ['Mild', 'Medium', 'Spicy'] as const;

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [region, setRegion] = React.useState<UserProfile['baseRegion'] | null>(null);
    const [isVeg, setIsVeg] = React.useState<boolean | null>(null);

    // Step 1: Region Selection
    if (!region) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-gradient pb-2">
                        Cravelecious
                    </h1>
                    <p className="text-muted-foreground">
                        First, let's establish your flavor baseline.
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium text-lg">Which region are you from?</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {REGIONS.map((r) => (
                            <motion.button
                                key={r}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setRegion(r)}
                                className="p-4 rounded-xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all"
                            >
                                <span className="text-lg font-semibold">{r}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Dietary Preference
    if (isVeg === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-6 text-center animate-in slide-in-from-right duration-500">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter text-gradient pb-2">
                        Dietary Preference
                    </h1>
                    <p className="text-muted-foreground">
                        Are you strictly Vegetarian?
                    </p>
                </div>

                <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6">
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Leaf className="w-5 h-5" />
                        <span className="font-medium text-lg">Select your preference</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsVeg(true)}
                            className="p-6 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/50 transition-all flex flex-col items-center gap-3"
                        >
                            <Leaf className="w-8 h-8 text-green-400" />
                            <span className="text-lg font-semibold text-green-100">Vegetarian</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsVeg(false)}
                            className="p-6 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/50 transition-all flex flex-col items-center gap-3"
                        >
                            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
                            <span className="text-lg font-semibold text-orange-100">Non-Veg / All</span>
                        </motion.button>
                    </div>
                    <button
                        onClick={() => setRegion(null)}
                        className="text-sm text-muted-foreground hover:text-white underline underline-offset-4"
                    >
                        Back to Region
                    </button>
                </div>
            </div>
        );
    }

    // Step 3: Spice Tolerance
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-6 text-center animate-in slide-in-from-right duration-500">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter text-gradient pb-2">
                    Spice Level
                </h1>
                <p className="text-muted-foreground">
                    How much heat can you handle?
                </p>
            </div>

            <div className="glass-card p-8 rounded-2xl w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-2 text-primary">
                    <Flame className="w-5 h-5" />
                    <span className="font-medium text-lg">Select your tolerance</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {SPICE_LEVELS.map((s, idx) => (
                        <motion.button
                            key={s}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onComplete(region, isVeg, s)}
                            className={clsx(
                                "p-4 rounded-xl border border-white/10 transition-all flex items-center justify-between px-6",
                                idx === 0 ? "bg-green-500/10 hover:bg-green-500/20 text-green-400" :
                                    idx === 1 ? "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400" :
                                        "bg-red-500/10 hover:bg-red-500/20 text-red-500"
                            )}
                        >
                            <span className="text-lg font-semibold">{s}</span>
                            <div className="flex gap-0.5">
                                {Array.from({ length: idx + 1 }).map((_, i) => (
                                    <Flame key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                        </motion.button>
                    ))}
                </div>
                <button
                    onClick={() => setIsVeg(null)}
                    className="text-sm text-muted-foreground hover:text-white underline underline-offset-4"
                >
                    Back to Dietary Preference
                </button>
            </div>
        </div>
    );
}
