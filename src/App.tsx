import React, { useState } from 'react';
import './App.css'; // Agrega tu hoja de estilos CSS

import Clientes from './components/Clientes';
import CatalogoMontos from './components/CatalogoMontos';
import Prestamos from './components/Prestamos';
import Amortizaciones from './components/Amortizaciones';

function App() {
  const [activeSection, setActiveSection] = useState('clientes');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>App de Gestión Financiera</h1>
        <nav>
          <ul className="nav-menu">
            <li className={`nav-item ${activeSection === 'clientes' && 'active'}`}>
              <button onClick={() => handleSectionChange('clientes')}>Clientes</button>
            </li>
            <li className={`nav-item ${activeSection === 'catalogoMontos' && 'active'}`}>
              <button onClick={() => handleSectionChange('catalogoMontos')}>Catálogo de Montos</button>
            </li>
            <li className={`nav-item ${activeSection === 'prestamos' && 'active'}`}>
              <button onClick={() => handleSectionChange('prestamos')}>Prestamos</button>
            </li>
            <li className={`nav-item ${activeSection === 'amortizaciones' && 'active'}`}>
              <button onClick={() => handleSectionChange('amortizaciones')}>Amortizaciones</button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="content">
        {activeSection === 'clientes' && <Clientes />}
        {activeSection === 'catalogoMontos' && <CatalogoMontos />}
        {activeSection === 'prestamos' && <Prestamos />}
        {activeSection === 'amortizaciones' && <Amortizaciones />}
      </div>
    </div>
  );
}

export default App;
