
import React, { useState } from 'react';

interface MoodInputProps {
  onSearch: (mood: string) => void;
  isLoading: boolean;
}

export const MoodInput: React.FC<MoodInputProps> = ({ onSearch, isLoading }) => {
  const [mood, setMood] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mood.trim()) {
      onSearch(mood);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mt-12 mb-24">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Strict Black/White Glow */}
        <div className="absolute -inset-0.5 bg-white opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition duration-1000"></div>
        
        <div className="relative bg-black border border-white/10 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-end transition-all duration-500 group-focus-within:border-white/30">
          <div className="flex-1 w-full">
            <label className="block text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4 font-bold">State of Mind</label>
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Describe the atmosphere you seek..."
              className="w-full bg-transparent border-none text-2xl md:text-4xl focus:ring-0 placeholder-zinc-800 font-serif text-white selection:bg-white selection:text-black"
            />
          </div>
          <button
            disabled={isLoading || !mood}
            type="submit"
            className="w-full md:w-auto px-10 py-5 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-black rounded-sm hover:bg-zinc-200 transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isLoading ? "Processing" : "Sequence"}
          </button>
        </div>
        
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 pointer-events-none"></div>
      </form>
    </div>
  );
};
