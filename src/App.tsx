import React from 'react';
import EwolucjaCenMieszkan from './components/EwolucjaCenMieszkan'
import WykresynWynagrodzen from './components/WykresynWynagrodzen'
import PorownanieTrendow from './components/PorownanieTrendow'
import MetryKwadratowe from './components/MetryKwadratowe'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Analiza Rynku Mieszkaniowego i Wynagrodzeń w Polsce</h1>
        <p>Trendy cen mieszkań, wynagrodzeń i dostępności mieszkań w latach 2015-2024</p>
      </header>
      
      <main className="app-main">
        <section className="chart-section">
          <EwolucjaCenMieszkan />
        </section>
        
        <section className="chart-section">
          <WykresynWynagrodzen />
        </section>
        
        <section className="chart-section">
          <PorownanieTrendow />
        </section>
        
        <section className="chart-section">
          <MetryKwadratowe />
        </section>
      </main>
      
      <footer className="app-footer">
        <p>© 2024 Analiza Rynku Mieszkaniowego - Dane symulowane dla celów demonstracyjnych</p>
      </footer>
    </div>
  );
};

export default App;
