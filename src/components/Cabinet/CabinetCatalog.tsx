import React, { useState, useEffect } from 'react';
import { Plus, Filter, RefreshCw } from 'lucide-react';
import { cabinetService } from '../../services/cabinetService';

const CabinetCatalog: React.FC = () => {
  const [cabinets, setCabinets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadCabinets();
  }, []);

  const loadCabinets = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call when implemented
      // For now, we'll use sample data
      const sampleCabinets = [
        {
          id: 1,
          name: 'Base Cabinet - Double Door',
          type: 'base',
          width: 900,
          height: 720,
          depth: 580,
          description: 'Base cabinet with double doors',
          imageUrl: '/image.png'
        },
        {
          id: 2,
          name: 'Base Cabinet - Drawer',
          type: 'base',
          width: 600,
          height: 720,
          depth: 580,
          description: 'Base cabinet with drawer',
          imageUrl: '/image.png'
        },
        {
          id: 3,
          name: 'Base Cabinet - Single Door',
          type: 'base',
          width: 600,
          height: 720,
          depth: 580,
          description: 'Standard base cabinet with single door',
          imageUrl: '/image.png'
        },
        {
          id: 4,
          name: 'Base Cabinet - Sink',
          type: 'base',
          width: 900,
          height: 720,
          depth: 580,
          description: 'Base cabinet designed for sink installation',
          imageUrl: '/image.png'
        },
        {
          id: 5,
          name: 'Wall Cabinet - Double Door',
          type: 'wall',
          width: 900,
          height: 720,
          depth: 350,
          description: 'Wall cabinet with double doors',
          imageUrl: '/image.png'
        },
        {
          id: 6,
          name: 'Wall Cabinet - Single Door',
          type: 'wall',
          width: 600,
          height: 720,
          depth: 350,
          description: 'Wall cabinet with single door',
          imageUrl: '/image.png'
        },
        {
          id: 7,
          name: 'Tall Cabinet - Pantry',
          type: 'tall',
          width: 600,
          height: 2100,
          depth: 580,
          description: 'Tall pantry cabinet with multiple shelves',
          imageUrl: '/image.png'
        },
        {
          id: 8,
          name: 'Corner Cabinet - Lazy Susan',
          type: 'corner',
          width: 900,
          height: 720,
          depth: 900,
          description: 'Corner cabinet with lazy susan mechanism',
          imageUrl: '/image.png'
        },
        {
          id: 9,
          name: 'Island Cabinet - Drawers',
          type: 'island',
          width: 900,
          height: 720,
          depth: 580,
          description: 'Island cabinet with multiple drawers',
          imageUrl: '/image.png'
        }
      ];
      
      setCabinets(sampleCabinets);
    } catch (error) {
      console.error('Error loading cabinets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCabinet = () => {
    setShowAddModal(true);
  };

  const filteredCabinets = activeTab === 'all' 
    ? cabinets 
    : cabinets.filter(cabinet => cabinet.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cabinet Catalog & Costing</h1>
        <p className="text-gray-600">Design and calculate costs for custom kitchen cabinets with our comprehensive catalog system.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              Cabinet Catalog
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`${
                activeTab === 'calculator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              Cost Calculator
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`${
                activeTab === 'optimization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              Cutting Optimization
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
            >
              Projects
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add Cabinet Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleAddCabinet}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Cabinet
            </button>
          </div>

          {/* Cabinet Type Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveTab('base')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Base Cabinets
            </button>
            <button
              onClick={() => setActiveTab('wall')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'wall' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Wall Cabinets
            </button>
            <button
              onClick={() => setActiveTab('tall')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'tall' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Tall Cabinets
            </button>
            <button
              onClick={() => setActiveTab('corner')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'corner' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Corner Cabinets
            </button>
            <button
              onClick={() => setActiveTab('island')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'island' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Island Cabinets
            </button>
          </div>

          {/* Cabinet Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCabinets.map((cabinet) => (
                <div key={cabinet.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={cabinet.imageUrl} 
                      alt={cabinet.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{cabinet.name}</h3>
                      <span className="ml-2">
                        <img src="/logo.webp" alt="Logo" className="h-6 w-6" />
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{cabinet.description}</p>
                    <div className="mt-3 text-sm text-gray-700">
                      <p>Default Size: {cabinet.width} × {cabinet.height} × {cabinet.depth} mm</p>
                      <p>Type: {cabinet.type.charAt(0).toUpperCase() + cabinet.type.slice(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCabinets.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cabinets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'all' 
                  ? 'Get started by adding your first cabinet to the catalog.'
                  : `No ${activeTab} cabinets found in the catalog.`}
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddCabinet}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Cabinet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinetCatalog;