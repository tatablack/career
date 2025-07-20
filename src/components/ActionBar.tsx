import React from 'react';


const ActionBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-900 to-transparent p-4 z-50">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
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
      </div>
    </div>
  );
};

export default ActionBar;
