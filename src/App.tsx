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
      
      <footer className="app-footer">
        <div className="declaration">
          <h3>Oświadczenie autorów</h3>
          <p>
            Świadomi odpowiedzialności prawnej oświadczamy, że niniejszy projekt został wykonany przez nas samodzielnie 
            i nie zawiera treści uzyskanych w sposób niezgodny z obowiązującymi przepisami i dobrymi obyczajami. 
            W szczególności, nie korzystaliśmy z materiałów chronionych prawem autorskim.
          </p>
          
          <h4>Źródła danych</h4>
          <p>
            Wykorzystane dane pochodzą z publicznie dostępnego serwisu internetowego Głównego Urzędu Statystycznego: 
            <a href="https://stat.gov.pl/" target="_blank" rel="noopener noreferrer"> https://stat.gov.pl/</a>, 
            Bank Danych Lokalnych, w szczególności:
          </p>
          
          <ul>
            <li>
              <strong>Kategoria:</strong> WYNAGRODZENIA I ŚWIADCZENIA SPOŁECZNE (K40)<br/>
              <strong>Grupa:</strong> WYNAGRODZENIA (G403)<br/>
              <strong>Podgrupa:</strong> Przeciętne miesięczne wynagrodzenia brutto (P2497)
            </li>
            <li>
              <strong>Kategoria:</strong> RYNEK NIERUCHOMOŚCI (K48)<br/>
              <strong>Grupa:</strong> RYNKOWA SPRZEDAŻ LOKALI MIESZKALNYCH (G597)<br/>
              <strong>Podgrupa:</strong> Średnia cena za 1 m² lokali mieszkalnych sprzedanych w ramach transakcji rynkowych
            </li>
          </ul>
          
          <div className="authors">
            <p><strong>Data:</strong> 13.06.2025</p>
            <p><strong>Podpisy autorów pracy:</strong></p>
            <ul>
              <li>Krzysztof Federczyk</li>
              <li>Maciej Chaciński</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
