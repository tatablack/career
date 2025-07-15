import React, { useState, useEffect } from 'react';
import { X, Code, Database, Server, Wrench } from 'lucide-react';
import techTreeData from '../data/tech_tree.json';

interface TechItem {
  name: string;
  type: string;
  tree: string;
  startYear: string;
  endYear: string;
}

interface TechTreePanelProps {
  isVisible: boolean;
  onClose: () => void;
  currentYear: number;
}

const TechTreePanel: React.FC<TechTreePanelProps> = ({ isVisible, onClose, currentYear }) => {
  const [activeTab, setActiveTab] = useState<string>('UI / UX');
  const [pulsingTechs, setPulsingTechs] = useState<Set<string>>(new Set());

  // Process tech tree data to eliminate composite tabs and duplicate items
  const processedTechData = React.useMemo(() => {
    const processed: { [key: string]: TechItem[] } = {};
    
    // Initialize individual tabs
    const individualTabs = ['UI / UX', 'Backend', 'Data', 'Platform'];
    individualTabs.forEach(tab => {
      processed[tab] = [];
    });

    // Process each category in the original data
    Object.entries(techTreeData).forEach(([category, items]) => {
      if (category.includes(',')) {
        // This is a composite category, split and add to individual tabs
        const individualCategories = category.split(',').map(cat => cat.trim());
        individualCategories.forEach(individualCategory => {
          if (processed[individualCategory]) {
            processed[individualCategory].push(...items);
          }
        });
      } else {
        // This is an individual category, add directly
        if (processed[category]) {
          processed[category].push(...items);
        }
      }
    });

    // Remove duplicates and sort by start year within each tab
    Object.keys(processed).forEach(tab => {
      // Remove duplicates based on name and startYear
      const uniqueItems = processed[tab].filter((item, index, array) => 
        array.findIndex(i => i.name === item.name && i.startYear === item.startYear) === index
      );
      
      // Sort by start year
      processed[tab] = uniqueItems.sort((a, b) => parseInt(a.startYear) - parseInt(b.startYear));
    });

    return processed;
  }, []);

  // Track when technologies become active and manage pulsing
  useEffect(() => {
    const newlyActiveTechs = new Set<string>();
    
    // Check all technologies across all tabs
    Object.values(processedTechData).flat().forEach(item => {
      const startYear = parseInt(item.startYear);
      const techKey = `${item.name}-${item.startYear}`;
      
      // If this tech just became active (current year matches start year)
      if (currentYear === startYear) {
        newlyActiveTechs.add(techKey);
      }
    });

    // Add newly active techs to pulsing set
    if (newlyActiveTechs.size > 0) {
      setPulsingTechs(prev => new Set([...prev, ...newlyActiveTechs]));
      
      // Remove them from pulsing after 3 seconds
      const timer = setTimeout(() => {
        setPulsingTechs(prev => {
          const updated = new Set(prev);
          newlyActiveTechs.forEach(tech => updated.delete(tech));
          return updated;
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentYear, processedTechData]);

  const getTabIcon = (tabName: string) => {
    switch (tabName) {
      case 'UI / UX': return <Code className="w-4 h-4" />;
      case 'Backend': return <Server className="w-4 h-4" />;
      case 'Data': return <Database className="w-4 h-4" />;
      case 'Platform': return <Wrench className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const types = type.split(',');
    const primaryType = types[0];
    
    switch (primaryType) {
      case 'Language': return 'from-blue-600 to-blue-700 border-blue-500';
      case 'Framework': return 'from-green-600 to-green-700 border-green-500';
      case 'Library': return 'from-purple-600 to-purple-700 border-purple-500';
      case 'Database': return 'from-red-600 to-red-700 border-red-500';
      case 'Platform': return 'from-yellow-600 to-yellow-700 border-yellow-500';
      case 'OS': return 'from-gray-600 to-gray-700 border-gray-500';
      case 'Build tooling': return 'from-orange-600 to-orange-700 border-orange-500';
      case 'Automation': return 'from-teal-600 to-teal-700 border-teal-500';
      default: return 'from-gray-600 to-gray-700 border-gray-500';
    }
  };

  const isItemActive = (item: TechItem) => {
    const startYear = parseInt(item.startYear);
    const endYear = item.endYear ? parseInt(item.endYear) : currentYear;
    return currentYear >= startYear && currentYear <= endYear;
  };

  const isItemLearned = (item: TechItem) => {
    const startYear = parseInt(item.startYear);
    return currentYear >= startYear;
  };

  const isItemOld = (item: TechItem) => {
    if (!item.endYear) return false;
    const endYear = parseInt(item.endYear);
    return currentYear > endYear + 5;
  };

  const isItemPulsing = (item: TechItem) => {
    const techKey = `${item.name}-${item.startYear}`;
    return pulsingTechs.has(techKey);
  };

  const organizeByType = (items: TechItem[]) => {
    const typeGroups: { [key: string]: TechItem[] } = {};
    
    items.forEach(item => {
      const types = item.type.split(',');
      const primaryType = types[0];
      
      if (!typeGroups[primaryType]) {
        typeGroups[primaryType] = [];
      }
      typeGroups[primaryType].push(item);
    });

    // Sort items within each type by start year
    Object.keys(typeGroups).forEach(type => {
      typeGroups[type].sort((a, b) => parseInt(a.startYear) - parseInt(b.startYear));
    });

    return typeGroups;
  };

  const renderTechTree = (items: TechItem[]) => {
    const typeGroups = organizeByType(items);
    
    return (
      <div className="space-y-6">
        {Object.entries(typeGroups).map(([type, typeItems]) => (
          <div key={type} className="space-y-3">
            <div className="text-sm font-bold text-orange-400 uppercase tracking-wider border-b border-gray-700 pb-1">
              {type}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {typeItems.map((item, index) => {
                const isActive = isItemActive(item);
                const isLearned = isItemLearned(item);
                const isOld = isItemOld(item);
                const isPulsing = isItemPulsing(item);
                
                return (
                  <div
                    key={`${item.name}-${item.startYear}-${index}`}
                    className={`relative p-2 rounded border text-xs transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${getTypeColor(item.type)} shadow-lg ${isPulsing ? 'animate-pulse' : ''}`
                        : isLearned
                        ? `bg-gradient-to-br ${getTypeColor(item.type)} ${isOld ? 'opacity-50' : 'opacity-80'}`
                        : 'bg-gray-800 border-gray-600 opacity-40'
                    }`}
                  >
                    <div className="font-semibold text-white truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-gray-300 text-xs mt-1">
                      {item.startYear}{item.endYear && item.endYear !== item.startYear ? ` - ${item.endYear}` : ''}
                    </div>
                    
                    {/* Connection lines for tree structure */}
                    {index > 0 && (
                      <div className="absolute -top-2 left-1/2 w-px h-2 bg-gray-600"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isVisible) return null;

  const availableTabs = Object.keys(processedTechData).filter(tab => processedTechData[tab].length > 0);

  return (
    <div className="fixed top-4 left-4 w-96 h-[calc(100vh-2rem)] bg-black/95 border-2 border-gray-700 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header - Empty top third */}
      <div className="h-1/3 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-lg border-b border-gray-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-lg font-bold text-orange-400">Tech Tree</div>
          <div className="text-sm text-gray-400">Press 'i' to toggle</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-gray-800 border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600">
          {availableTabs.map((tabName) => (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 text-xs font-medium transition-colors border-b-2 ${
                activeTab === tabName
                  ? 'text-orange-400 border-orange-400 bg-gray-700'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600'
              }`}
            >
              {getTabIcon(tabName)}
              <span className="whitespace-nowrap">{tabName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-600">
        {renderTechTree(processedTechData[activeTab] || [])}
      </div>
    </div>
  );
};

export default TechTreePanel;