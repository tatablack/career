import React, { useState, useEffect } from 'react';
import { Map, Navigation } from 'lucide-react';

interface MinimapProps {
  currentYear: number;
}

const Minimap: React.FC<MinimapProps> = ({ currentYear }) => {
  const [currentRegion, setCurrentRegion] = useState<'italy' | 'netherlands' | 'scotland'>('italy');

  useEffect(() => {
    if (currentYear >= 2015) {
      setCurrentRegion('scotland');
    } else if (currentYear >= 2011) {
      setCurrentRegion('netherlands');
    } else {
      setCurrentRegion('italy');
    }
  }, [currentYear]);

  const getRegionName = () => {
    switch (currentRegion) {
      case 'italy': return 'Italy';
      case 'netherlands': return 'Netherlands';
      case 'scotland': return 'Scotland';
      default: return 'Europe';
    }
  };

  const getMapStyle = () => {
    const baseStyle = {
      backgroundImage: 'url(/europe.png)',
      backgroundSize: '1000px 696px',
      backgroundRepeat: 'no-repeat',
    };

    switch (currentRegion) {
      case 'italy':
        return {
          ...baseStyle,
          backgroundPosition: '-390px -490px', // Focus on Italy
        };
      case 'netherlands':
        return {
          ...baseStyle,
          backgroundSize: '2500px 1740px',
          backgroundPosition: '-970px -940px', // Focus on Netherlands
        };
      case 'scotland':
        return {
          ...baseStyle,
          backgroundSize: '2300px 1600px',
          backgroundPosition: '-700px -650px', // Focus on Scotland
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="w-48 h-48 bg-black/80 border-2 border-gray-700 rounded-lg overflow-hidden shadow-2xl">
        {/* Minimap Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-2 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <Map className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold text-gray-200">{getRegionName()}</span>
          </div>
        </div>
        
        {/* Minimap Content */}
        <div className="relative h-40 overflow-hidden">
          {/* Europe Map Background */}
          <div 
            className="absolute inset-0 transition-all duration-1000 ease-in-out opacity-80"
            style={getMapStyle()}
          />
          
          {/* Overlay for game-like effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40" />
          
          {/* Fog of War Effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, 
                transparent 25%, 
                rgba(0, 0, 0, 0.3) 45%, 
                rgba(0, 0, 0, 0.7) 70%, 
                rgba(0, 0, 0, 0.9) 85%, 
                rgba(0, 0, 0, 1) 100%)`
            }}
          />
          
          
          {/* Player position indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50 border border-orange-300"></div>
            {/* Player vision radius */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-orange-400/30 rounded-full animate-pulse"></div>
          </div>
          
          {/* Mock points of interest based on region */}
          {currentRegion === 'italy' && (
            <>
              <div className="absolute top-8 left-12 w-2 h-2 bg-silver-400 rounded-full shadow-sm"></div>
              <div className="absolute bottom-12 right-8 w-2 h-2 bg-silver-400 rounded-full shadow-sm"></div>
              <div className="absolute top-16 right-12 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
            </>
          )}
          
          {currentRegion === 'netherlands' && (
            <>
              <div className="absolute top-6 left-8 w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
              <div className="absolute bottom-8 left-12 w-2 h-2 bg-silver-400 rounded-full shadow-sm"></div>
            </>
          )}
          
          {currentRegion === 'scotland' && (
            <>
              <div className="absolute top-10 right-10 w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
              <div className="absolute bottom-10 left-10 w-2 h-2 bg-silver-400 rounded-full shadow-sm"></div>
            </>
          )}
          
          {/* Compass */}
          <div className="absolute top-2 right-2 z-10">
            <Navigation className="w-4 h-4 text-orange-400" />
          </div>
          
          {/* Region transition indicator */}
          <div className="absolute bottom-2 left-2 text-xs text-gray-400 font-mono z-10">
            {currentYear}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minimap;