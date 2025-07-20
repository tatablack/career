import React, { useState, useEffect } from 'react';
import ActionBar from './components/ActionBar';
import Minimap from './components/Minimap';
import Timeline from './components/Timeline';
import TechTreePanel from './components/TechTreePanel';

function App() {
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [isTechTreeVisible, setIsTechTreeVisible] = useState<boolean>(false);
  const [isMinimapVisible, setIsMinimapVisible] = useState<boolean>(true);

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const toggleTechTree = () => {
    setIsTechTreeVisible(!isTechTreeVisible);
  };

  const toggleMinimap = () => {
    setIsMinimapVisible(!isMinimapVisible);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'i') {
        toggleTechTree();
      } else if (event.key.toLowerCase() === 'm') {
        toggleMinimap();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTechTreeVisible, isMinimapVisible]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Main Content */}
      <div className="relative">
        <Timeline onYearChange={handleYearChange} />
      </div>

      {/* Fixed UI Elements */}
      {isMinimapVisible && <Minimap currentYear={currentYear} />}
      <ActionBar />
      <TechTreePanel 
        isVisible={isTechTreeVisible} 
        onClose={toggleTechTree}
        currentYear={currentYear}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-900/5 via-transparent to-silver-900/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-silver-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

export default App;
