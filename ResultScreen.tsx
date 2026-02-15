'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dish } from '@/data/dishes';
import { UserProfile, calculatePrediction } from '@/services/recommendationEngine';
import { Share2, Sparkles, Activity, Star, Info, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getFlavorMolecules } from '@/services/flavorDB';
import FlavorRadar from './FlavorRadar';

interface ResultScreenProps {
    finalDish: Dish;
    userProfile: UserProfile;
    onReset: () => void;
}

export default function ResultScreen({ finalDish, userProfile, onReset }: ResultScreenProps) {
    const prediction = calculatePrediction(finalDish, userProfile);
    const [molecules, setMolecules] = useState<any[]>([]);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Fetch FlavorDB Data (Visual Intelligence)
        const primaryFlavor = finalDish.flavorTags?.[0] || "Savory";
        getFlavorMolecules(primaryFlavor).then(setMolecules);

        return () => clearInterval(interval);
    }, [finalDish.flavorTags]);

    const handleShare = async () => {
        const shareData = {
            title: 'Cravelecious Match!',
            text: `I got matched with ${finalDish.name} (${prediction.probability}% match)! Find your flavor at Cravelecious.`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('Result copied to clipboard!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto space-y-6 animate-in zoom-in duration-500 p-6 pb-20">

            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gradient">The Verdict</h2>
                <p className="text-muted-foreground text-lg">{finalDish.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Score Card */}
                <div className="glass-card w-full p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />

                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                        {/* Circular Progress */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/10" />
                            <circle
                                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                                className="text-primary"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * prediction.probability) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold">{prediction.probability}%</span>
                            <span className="text-xs text-muted-foreground">Match</span>
                        </div>
                    </div>

                    {/* Flavor Radar */}
                    <div className="w-full">
                        <p className="text-xs text-center text-muted-foreground mb-4 uppercase tracking-widest font-semibold flex justify-center items-center gap-2">
                            <Sparkles className="w-3 h-3 text-purple-400" /> Taste Profile
                        </p>
                        <FlavorRadar flavorWeights={userProfile.flavorWeights} />
                    </div>
                </div>

                {/* Molecular & Details Column */}
                <div className="space-y-6">

                    {/* Flavor Intelligence Card */}
                    <div className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden">
                        <h4 className="text-xs uppercase text-cyan-400 mb-4 flex items-center gap-2 font-bold tracking-widest">
                            <Activity className="w-4 h-4" /> Molecular Breakdown
                        </h4>
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                            {molecules.length > 0 ? (
                                molecules.map((mol, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="text-gray-200 font-mono text-xs">{mol.name}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{mol.profile}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-500 italic flex items-center gap-2">
                                    <span className="animate-pulse">●</span> Analyzing molecular data...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            Why this score?
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {prediction.explanation}
                        </p>
                    </div>

                    {/* Confidence */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-2 rounded-full w-fit mx-auto">
                        <Info className="w-3 h-3" />
                        <span>Confidence: {Math.round(prediction.confidence)}%</span>
                    </div>

                </div>
            </div>

            {/* Cross-Region Intelligence Alert */}
            {!prediction.matchDetails.regionMatch && (
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <h3 className="font-semibold text-purple-400 mb-1 text-sm">Cross-Region Discovery</h3>
                    <p className="text-xs text-muted-foreground">
                        You're exploring outside your primary region. We've adjusted for your adventurous palate.
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 w-full">
                <button
                    onClick={onReset}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors font-medium border border-white/5"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                </button>
                <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 transition-colors font-medium text-primary-foreground"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>

        </div>
    );
}
