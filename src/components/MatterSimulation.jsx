import React, { useState, useEffect } from 'react';

const MatterSimulation = () => {
  const [temperature, setTemperature] = useState(25);
  const [pressure, setPressure] = useState(1);
  const [selectedState, setSelectedState] = useState('liquid');
  const [particles, setParticles] = useState([]);
  const [currentState, setCurrentState] = useState('liquid');
  const numParticles = 30;

  const stateProperties = {
    solid: {
      color: 'bg-blue-600',
      description: 'Particles vibrate in fixed positions with strong bonds'
    },
    liquid: {
      color: 'bg-blue-400',
      description: 'Particles flow freely while maintaining some contact'
    },
    gas: {
      color: 'bg-blue-200',
      description: 'Particles move rapidly with large spaces between them'
    }
  };

  // Update particles
  useEffect(() => {
    const speed = temperature / 25;
    const spacing = Math.max(1 - pressure / 5, 0.2);
    
    const newParticles = Array.from({ length: numParticles }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dx: (Math.random() - 0.5) * speed,
      dy: (Math.random() - 0.5) * speed,
      spacing
    }));
    
    setParticles(newParticles);
  }, [temperature, pressure]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let { x, y, dx, dy, spacing } = particle;
          
          if (currentState === 'solid') {
            x += (Math.random() - 0.5) * 0.5;
            y += (Math.random() - 0.5) * 0.5;
          } else {
            x += dx;
            y += dy;
            if (x < 0 || x > 100) dx *= -1;
            if (y < 0 || y > 100) dy *= -1;
          }
          
          return {
            ...particle,
            x: x < 0 ? 0 : x > 100 ? 100 : x,
            y: y < 0 ? 0 : y > 100 ? 100 : y,
            dx,
            dy
          };
        })
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [currentState]);

  // Update current state based on temperature and pressure
  useEffect(() => {
    if (temperature <= 0 && pressure >= 0.8) {
      setCurrentState('solid');
    } else if (temperature > 100 && pressure <= 1) {
      setCurrentState('gas');
    } else {
      setCurrentState('liquid');
    }
  }, [temperature, pressure]);

  // Handle state selection
  const handleStateSelect = (state) => {
    setSelectedState(state);
    switch (state) {
      case 'solid':
        setTemperature(-10);
        setPressure(1);
        break;
      case 'liquid':
        setTemperature(25);
        setPressure(1);
        break;
      case 'gas':
        setTemperature(120);
        setPressure(0.5);
        break;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">States of Matter Simulation</h2>
      
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select State</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedState}
            onChange={(e) => handleStateSelect(e.target.value)}
          >
            <option value="solid">Solid</option>
            <option value="liquid">Liquid</option>
            <option value="gas">Gas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Temperature: {temperature.toFixed(1)}°C
          </label>
          <input 
            type="range" 
            min="-50" 
            max="150" 
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Pressure: {pressure.toFixed(2)} atm
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1"
            value={pressure}
            onChange={(e) => setPressure(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Current state info */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">Current State: {currentState.charAt(0).toUpperCase() + currentState.slice(1)}</span>
            <p className="text-sm mt-1">{stateProperties[currentState].description}</p>
          </div>
          <div className={`w-4 h-4 rounded-full ${stateProperties[currentState].color}`}></div>
        </div>
      </div>

      {/* Simulation container */}
      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden border-2 mb-4">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 ${stateProperties[currentState].color} rounded-full transition-transform duration-200`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `scale(${particle.spacing})`
            }}
          />
        ))}
      </div>

      {/* State ranges info */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-medium">Solid</h3>
          <p>≤ 0°C</p>
          <p>≥ 0.8 atm</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-medium">Liquid</h3>
          <p>0-100°C</p>
          <p>0.5-3 atm</p>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <h3 className="font-medium">Gas</h3>
          <p>≥ 100°C</p>
          <p>≤ 1 atm</p>
        </div>
      </div>
    </div>
  );
};

export default MatterSimulation;