'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { Dish, dishes } from '@/data/dishes';

interface DishSearchProps {
    onSelect: (dish: Dish) => void;
}

export default function DishSearch({ onSelect }: DishSearchProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredDishes = useMemo(() => {
        if (!query) return [];
        return dishes.filter(d =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.cuisine.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5); // Limit to 5 suggestions
    }, [query]);

    return (
        <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">What are you craving?</h2>
                <p className="text-muted-foreground">Search for a dish to analyze your probability.</p>
            </div>

            <div className="relative z-50">
                <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
                    <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="e.g. Butter Chicken, Masala Dosa..."
                        className="w-full pl-12 pr-4 py-4 bg-secondary/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-secondary/80 text-lg transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                </div>

                <AnimatePresence>
                    {filteredDishes.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-card/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                            {filteredDishes.map((dish) => (
                                <button
                                    key={dish.id}
                                    onClick={() => onSelect(dish)}
                                    className="w-full flex items-center p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left group"
                                >
                                    <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{dish.name}</h3>
                                        <p className="text-sm text-muted-foreground">{dish.cuisine} • {dish.region}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="pt-8 grid grid-cols-2 gap-4 opacity-50 text-sm">
                <div className="p-4 rounded-lg bg-secondary/30 border border-white/5">
                    <span className="block font-semibold text-primary mb-1">Behavioral</span>
                    We track your micro-interactions
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-white/5">
                    <span className="block font-semibold text-primary mb-1">Deterministic</span>
                    No random numbers allowed
                </div>
            </div>
        </div>
    );
}
