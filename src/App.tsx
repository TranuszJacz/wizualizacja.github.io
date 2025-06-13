import React from 'react';
import EwolucjaCenMieszkan from './components/EwolucjaCenMieszkan'
import WykresynWynagrodzen from './components/WykresynWynagrodzen'
import PorownanieTrendow from './components/PorownanieTrendow'
import MetryKwadratowe from './components/MetryKwadratowe'
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
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
    </div>
  );
};

export default App;
