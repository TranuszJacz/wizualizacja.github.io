import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Papa from 'papaparse';

interface CenyData {
  rok: number;
  [wojewodztwo: string]: number;
}

const EwolucjaCenMieszkan: React.FC = () => {
  const [data, setData] = useState<CenyData[]>([]);
  const [selectedWojewodztwa, setSelectedWojewodztwa] = useState<string[]>([]);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
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
        const response = await fetch('/Dane(Sheet1).csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: false,
          complete: (result) => {
            const rows = result.data as string[][];
            if (rows.length > 1) {
              // Pierwsza linia zawiera lata (pomijamy pierwszą kolumnę z nazwą)
              const years = rows[0].slice(1).map(year => parseInt(year));
              
              // Przygotowujemy dane w formacie potrzebnym do wykresu
              const processedData: CenyData[] = years.map(rok => {
                const yearData: CenyData = { rok };
                
                // Dla każdego województwa dodajemy cenę za dany rok
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
                    
                    // Znajdź indeks roku i pobierz cenę
                    const yearIndex = years.indexOf(rok);
                    if (yearIndex !== -1 && row[yearIndex + 1]) {
                      // Konwertuj cenę (usuń separatory tysięcy i zamień przecinek na kropkę)
                      const priceStr = row[yearIndex + 1]
                        .replace(/[^\d,]/g, '')
                        .replace(',', '.');
                      const price = parseFloat(priceStr);
                      
                      if (!isNaN(price) && price > 0) {
                        yearData[wojewodztwo] = Math.round(price);
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
              setSelectedWojewodztwa(wojewodztwa.slice(0, 4));
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
    return [`${value.toLocaleString()} zł/m²`, name];
  };

  if (loading) {
    return (
      <div className="chart-section">
        <h2>Ewolucja Cen Mieszkań w Poszczególnych Województwach</h2>
        <div className="loading">Ładowanie danych cen mieszkań...</div>
      </div>
    );
  }

  const calculateGrowthRate = (wojewodztwo: string) => {
    const firstValue = data[0]?.[wojewodztwo] as number;
    const lastValue = data[data.length - 1]?.[wojewodztwo] as number;
    
    if (!firstValue || !lastValue) return 0;
    
    return Math.round(((lastValue - firstValue) / firstValue) * 100);
  };

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="rok" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Cena za m² (zł)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={(label) => `Rok: ${label}`}
          />
          <Legend />
          {selectedWojewodztwa.map((wojewodztwo, index) => (
            <Area
              key={wojewodztwo}
              type="monotone"
              dataKey={wojewodztwo}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      );
    } else {
      return (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="rok" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Cena za m² (zł)', angle: -90, position: 'insideLeft' }}
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
      );
    }
  };

  return (
    <div className="chart-section">
      <h2>Ewolucja Cen Mieszkań w Poszczególnych Województwach</h2>
      
      <div className="controls">
        <div className="control-row">
          <div className="control-group">
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
          
          <div className="control-group">
            <h3>Typ wykresu:</h3>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="line"
                  checked={chartType === 'line'}
                  onChange={(e) => setChartType(e.target.value as 'line' | 'area')}
                />
                Wykres liniowy
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="area"
                  checked={chartType === 'area'}
                  onChange={(e) => setChartType(e.target.value as 'line' | 'area')}
                />
                Wykres warstwowy
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="growth-analysis">
        <h3>Wzrost Cen 2015-2024</h3>
        <div className="growth-cards">
          {selectedWojewodztwa.map((wojewodztwo, index) => (
            <div key={wojewodztwo} className="growth-card">
              <div 
                className="growth-indicator"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <div className="growth-content">
                <h4>{wojewodztwo}</h4>
                <div className="growth-value">+{calculateGrowthRate(wojewodztwo)}%</div>
                <div className="growth-description">
                  {data.length > 0 && (
                    <>
                      {(data[0][wojewodztwo] as number).toLocaleString()} → {(data[data.length - 1][wojewodztwo] as number).toLocaleString()} zł/m²
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="summary">
        <h3>Kluczowe Wnioski:</h3>
        <ul>
          <li>Mazowieckie utrzymuje najwyższe ceny mieszkań w Polsce</li>
          <li>Wszystkie województwa wykazują silny trend wzrostowy</li>
          <li>Średni wzrost cen wynosi około 100% w ciągu 9 lat</li>
          <li>Różnice cenowe między województwami się pogłębiają</li>
          <li>Tempo wzrostu cen znacznie przewyższa inflację</li>
        </ul>
      </div>
    </div>
  );
};

export default EwolucjaCenMieszkan;
