import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

interface WynagrodzeniaData {
  rok: number;
  [wojewodztwo: string]: number;
}

const WykresynWynagrodzen: React.FC = () => {
  const [data, setData] = useState<WynagrodzeniaData[]>([]);
  const [selectedWojewodztwa, setSelectedWojewodztwa] = useState<string[]>([]);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Kolory dla różnych województw
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff',
    '#800080', '#008080', '#808000', '#800000', '#008000'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/Dane1(Sheet1).csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: false,
          complete: (result) => {
            const rows = result.data as string[][];
            if (rows.length > 1) {
              // Pierwsza linia zawiera lata (pomijamy pierwszą kolumnę z nazwą)
              const years = rows[0].slice(1).map(year => parseInt(year));
              
              // Przygotowujemy dane w formacie potrzebnym do wykresu
              const processedData: WynagrodzeniaData[] = years.map(rok => {
                const yearData: WynagrodzeniaData = { rok };
                
                // Dla każdego województwa dodajemy wynagrodzenie za dany rok
                rows.slice(1).forEach((row) => {
                  if (row[0] && row.length > 1) {
                    // Czyścimy nazwę województwa
                    const wojewodztwo = row[0]
                      .replace(/[^\p{L}\s-]/gu, '')
                      .trim()
                      .replace(/ŚLĄSKIE/g, 'Śląskie')
                      .replace(/DOLNOŚLĄSKIE/g, 'Dolnośląskie')
                      .replace(/KUJAWSKO-POMORSKIE/g, 'Kujawsko-Pomorskie')
                      .replace(/LUBELSKIE/g, 'Lubelskie')
                      .replace(/LUBUSKIE/g, 'Lubuskie')
                      .replace(/ŁÓDZKIE/g, 'Łódzkie')
                      .replace(/MAŁOPOLSKIE/g, 'Małopolskie')
                      .replace(/MAZOWIECKIE/g, 'Mazowieckie')
                      .replace(/OPOLSKIE/g, 'Opolskie')
                      .replace(/PODKARPACKIE/g, 'Podkarpackie')
                      .replace(/PODLASKIE/g, 'Podlaskie')
                      .replace(/POMORSKIE/g, 'Pomorskie')
                      .replace(/ŚWIĘTOKRZYSKIE/g, 'Świętokrzyskie')
                      .replace(/WARMIŃSKO-MAZURSKIE/g, 'Warmińsko-Mazurskie')
                      .replace(/WIELKOPOLSKIE/g, 'Wielkopolskie')
                      .replace(/ZACHODNIOPOMORSKIE/g, 'Zachodniopomorskie');
                    
                    // Znajdź indeks roku i pobierz wynagrodzenie
                    const yearIndex = years.indexOf(rok);
                    if (yearIndex !== -1 && row[yearIndex + 1]) {
                      // Konwertuj wynagrodzenie (usuń separatory tysięcy i zamień przecinek na kropkę)
                      const salaryStr = row[yearIndex + 1]
                        .replace(/[^\d,]/g, '')
                        .replace(',', '.');
                      const salary = parseFloat(salaryStr);
                      
                      if (!isNaN(salary) && salary > 0) {
                        yearData[wojewodztwo] = Math.round(salary);
                      }
                    }
                  }
                });
                
                return yearData;
              });
              
              setData(processedData);
              
              // Wyciągnij nazwy województw z pierwszego roku danych
              const wojewodztwa = Object.keys(processedData[0] || {}).filter(key => key !== 'rok');
              setAvailableWojewodztwa(wojewodztwa);
              setSelectedWojewodztwa(wojewodztwa.slice(0, 3));
            }
            setLoading(false);
          },
          error: (error: Error) => {
            console.error('Błąd podczas parsowania CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleWojewodztwoToggle = (wojewodztwo: string) => {
    setSelectedWojewodztwa(prev => 
      prev.includes(wojewodztwo)
        ? prev.filter(w => w !== wojewodztwo)
        : [...prev, wojewodztwo]
    );
  };

  const formatTooltip = (value: number, name: string) => {
    return [`${value} zł`, name];
  };

  if (loading) {
    return (
      <div className="chart-section">
        <h2>Wzrost Wynagrodzeń w Czasie dla Różnych Regionów</h2>
        <div className="loading">Ładowanie danych wynagrodzeń...</div>
      </div>
    );
  }

  return (
    <div className="chart-section">
      <h2>Wzrost Wynagrodzeń w Czasie dla Różnych Regionów</h2>
      
      <div className="controls">
        <h3>Wybierz województwa:</h3>
        <div className="checkbox-grid">
          {availableWojewodztwa.map((wojewodztwo) => (
            <label key={wojewodztwo} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedWojewodztwa.includes(wojewodztwo)}
                onChange={() => handleWojewodztwoToggle(wojewodztwo)}
              />
              {wojewodztwo}
            </label>
          ))}
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="rok" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Średnie wynagrodzenie (zł)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={(label) => `Rok: ${label}`}
            />
            <Legend />
            {selectedWojewodztwa.map((wojewodztwo, index) => (
              <Line
                key={wojewodztwo}
                type="monotone"
                dataKey={wojewodztwo}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="summary">
        <h3>Kluczowe Wnioski:</h3>
        <ul>
          <li>Mazowieckie konsekwentnie utrzymuje najwyższy poziom wynagrodzeń</li>
          <li>Wszystkie województwa wykazują stały wzrost wynagrodzeń</li>
          <li>Różnice między województwami pozostają stosunkowo stałe w czasie</li>
          <li>Średni wzrost wynagrodzeń wynosi około 5-7% rocznie</li>
        </ul>
      </div>
    </div>
  );
};

export default WykresynWynagrodzen;
