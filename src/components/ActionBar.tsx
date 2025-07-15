import React from 'react';
import { Heart, Droplets } from 'lucide-react';


const ActionBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-4 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Health Orb */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 border-2 border-silver-400 shadow-lg shadow-red-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-red-500/50">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
            100
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center space-x-2 bg-black/80 rounded-lg p-2 border border-gray-700">
          {["typescript", "python", "docker", "php"].map((name, index) => (
            <div
              key={index}
              className="relative w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded border border-gray-600 flex items-center justify-center transition-all duration-200 hover:bg-orange-600 hover:border-orange-400 cursor-pointer group"
            >
              <img 
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`} 
                alt={name} 
                className={`w-6 h-6 ${index === 0 ? 'opacity-60 grayscale' : ''}`} 
              />
            </div>
          ))}
        </div>

        {/* Mana Orb */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 border-2 border-silver-400 shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
            85
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
