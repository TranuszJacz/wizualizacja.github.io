import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

interface TrendData {
  rok: number;
  cenaMieszkania: number;
  wynagrodzenie: number;
  wzrostCen: number;
  wzrostWynagrodzen: number;
  indeksCen: number;
  indeksWynagrodzen: number;
}

const PorownanieTrendow: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [selectedWojewodztwo, setSelectedWojewodztwo] = useState<string>('Mazowieckie');
  const [viewType, setViewType] = useState<'absolute' | 'growth' | 'index'>('absolute');
  const [loading, setLoading] = useState(true);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Ładuj oba pliki CSV równocześnie
        const [housingResponse, salaryResponse] = await Promise.all([
          fetch('/Dane(Sheet1).csv'),
          fetch('/Dane1(Sheet1).csv')
        ]);
        
        const [housingText, salaryText] = await Promise.all([
          housingResponse.text(),
          salaryResponse.text()
        ]);
        
        // Przetwórz dane cenowe
        const housingData: { [year: number]: { [wojewodztwo: string]: number } } = {};
        Papa.parse(housingText, {
          header: false,
          complete: (result) => {
            const rows = result.data as string[][];
            if (rows.length > 1) {
              const years = rows[0].slice(1).map(year => parseInt(year));
              
              rows.slice(1).forEach((row) => {
                if (row[0] && row.length > 1) {
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
                  
                  years.forEach((rok, index) => {
                    if (row[index + 1]) {
                      const priceStr = row[index + 1]
                        .replace(/[^\d,]/g, '')
                        .replace(',', '.');
                      const price = parseFloat(priceStr);
                      
                      if (!isNaN(price) && price > 0) {
                        if (!housingData[rok]) housingData[rok] = {};
                        housingData[rok][wojewodztwo] = Math.round(price);
                      }
                    }
                  });
                }
              });
            }
          }
        });
        
        // Przetwórz dane o wynagrodzeniach
        const salaryData: { [year: number]: { [wojewodztwo: string]: number } } = {};
        Papa.parse(salaryText, {
          header: false,
          complete: (result) => {
            const rows = result.data as string[][];
            if (rows.length > 1) {
              const years = rows[0].slice(1).map(year => parseInt(year));
              
              rows.slice(1).forEach((row) => {
                if (row[0] && row.length > 1) {
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
                  
                  years.forEach((rok, yearIndex) => {
                    if (row[yearIndex + 1]) {
                      const salaryStr = row[yearIndex + 1]
                        .replace(/[^\d,]/g, '')
                        .replace(',', '.');
                      const salary = parseFloat(salaryStr);
                      
                      if (!isNaN(salary) && salary > 0) {
                        if (!salaryData[rok]) salaryData[rok] = {};
                        salaryData[rok][wojewodztwo] = Math.round(salary);
                      }
                    }
                  });
                }
              });
            }
          }
        });
        
        // Połącz dane i oblicz trendy
        const calculateTrends = () => {
          const years = Object.keys(housingData).map(Number).sort();
          const wojewodztwa = Object.keys(housingData[years[0]] || {});
          
          setAvailableWojewodztwa(wojewodztwa);
          if (!selectedWojewodztwo || !wojewodztwa.includes(selectedWojewodztwo)) {
            setSelectedWojewodztwo(wojewodztwa[0] || 'Mazowieckie');
          }
          
          const trendData: TrendData[] = [];
          
          years.forEach((rok) => {
            const wojewodztwoData = selectedWojewodztwo;
            const cenaMieszkania = housingData[rok]?.[wojewodztwoData] || 0;
            const wynagrodzenie = salaryData[rok]?.[wojewodztwoData] || 0;
            
            if (cenaMieszkania > 0 && wynagrodzenie > 0) {
              const previousYear = trendData[trendData.length - 1];
              
              const wzrostCen = previousYear 
                ? Math.round(((cenaMieszkania - previousYear.cenaMieszkania) / previousYear.cenaMieszkania) * 100)
                : 0;
              const wzrostWynagrodzen = previousYear
                ? Math.round(((wynagrodzenie - previousYear.wynagrodzenie) / previousYear.wynagrodzenie) * 100)
                : 0;
              
              // Indeks (pierwszy rok = 100)
              const baseYear = years[0];
              const baseCena = housingData[baseYear]?.[wojewodztwoData] || cenaMieszkania;
              const baseWynagrodzenie = salaryData[baseYear]?.[wojewodztwoData] || wynagrodzenie;
              
              const indeksCen = Math.round((cenaMieszkania / baseCena) * 100);
              const indeksWynagrodzen = Math.round((wynagrodzenie / baseWynagrodzenie) * 100);
              
              trendData.push({
                rok,
                cenaMieszkania,
                wynagrodzenie,
                wzrostCen,
                wzrostWynagrodzen,
                indeksCen,
                indeksWynagrodzen
              });
            }
          });
          
          setData(trendData);
        };
        
        calculateTrends();
        setLoading(false);
        
      } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [selectedWojewodztwo]);

  const formatTooltip = (value: number, name: string) => {
    if (viewType === 'growth') {
      return [`${value}%`, name === 'wzrostCen' ? 'Wzrost cen mieszkań' : 'Wzrost wynagrodzeń'];
    } else if (viewType === 'index') {
      return [`${value}`, name === 'indeksCen' ? 'Indeks cen mieszkań' : 'Indeks wynagrodzeń'];
    } else {
      return [
        `${value.toLocaleString()} ${name === 'cenaMieszkania' ? 'zł/m²' : 'zł'}`,
        name === 'cenaMieszkania' ? 'Cena mieszkania' : 'Wynagrodzenie'
      ];
    }
  };

  const renderChart = () => {
    if (viewType === 'growth') {
      return (
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rok" />
          <YAxis label={{ value: 'Wzrost roczny (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Bar dataKey="wzrostCen" fill="#ff7300" name="Wzrost cen mieszkań" />
          <Bar dataKey="wzrostWynagrodzen" fill="#82ca9d" name="Wzrost wynagrodzeń" />
        </ComposedChart>
      );
    } else if (viewType === 'index') {
      return (
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rok" />
          <YAxis label={{ value: 'Indeks (2015 = 100)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Line type="monotone" dataKey="indeksCen" stroke="#ff7300" strokeWidth={3} name="Indeks cen mieszkań" />
          <Line type="monotone" dataKey="indeksWynagrodzen" stroke="#82ca9d" strokeWidth={3} name="Indeks wynagrodzeń" />
        </ComposedChart>
      );
    } else {
      return (
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rok" />
          <YAxis yAxisId="left" label={{ value: 'Cena (zł/m²)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Wynagrodzenie (zł)', angle: 90, position: 'insideRight' }} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          <Bar yAxisId="left" dataKey="cenaMieszkania" fill="#ff7300" name="Cena mieszkania" />
          <Line yAxisId="right" type="monotone" dataKey="wynagrodzenie" stroke="#82ca9d" strokeWidth={3} name="Wynagrodzenie" />
        </ComposedChart>
      );
    }
  };

  const getGap = () => {
    const latest = data[data.length - 1];
    if (!latest) return { gap: 0, trend: 'stable' };
    
    const gap = latest.indeksCen - latest.indeksWynagrodzen;
    const trend = gap > 20 ? 'rosnąca' : gap > 10 ? 'umiarkowana' : 'mała';
    
    return { gap, trend };
  };

  const gapAnalysis = getGap();

  if (loading) {
    return (
      <div className="chart-section">
        <h2>Porównanie Tempa Wzrostu Cen Mieszkań vs Wynagrodzeń</h2>
        <div className="loading">Ładowanie danych porównawczych...</div>
      </div>
    );
  }

  return (
    <div className="chart-section">
      <h2>Porównanie Tempa Wzrostu Cen Mieszkań vs Wynagrodzeń</h2>
      
      <div className="controls">
        <div className="control-group">
          <label htmlFor="wojewodztwo-select">Wybierz województwo:</label>
          <select 
            id="wojewodztwo-select"
            value={selectedWojewodztwo}
            onChange={(e) => setSelectedWojewodztwo(e.target.value)}
          >
            {availableWojewodztwa.map(woj => (
              <option key={woj} value={woj}>{woj}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="view-select">Typ wykresu:</label>
          <select 
            id="view-select"
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'absolute' | 'growth' | 'index')}
          >
            <option value="absolute">Wartości bezwzględne</option>
            <option value="growth">Wzrost roczny (%)</option>
            <option value="index">Indeks wzrostu (2015=100)</option>
          </select>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={500}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      <div className="analysis">
        <h3>Analiza Trendu - {selectedWojewodztwo}</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Różnica indeksów wzrostu</h4>
            <div className="stat-value">{gapAnalysis.gap} punktów</div>
            <div className="stat-description">Przewaga wzrostu cen nad wynagrodzenieami</div>
          </div>
          
          <div className="stat-card">
            <h4>Ocena trendu</h4>
            <div className="stat-value">{gapAnalysis.trend}</div>
            <div className="stat-description">Luka między cenami a wynagrodzenieami</div>
          </div>
          
          <div className="stat-card">
            <h4>Implikacja</h4>
            <div className="stat-value">
              {gapAnalysis.gap > 20 ? 'Krytyczna' : gapAnalysis.gap > 10 ? 'Ostrzeżenie' : 'Stabilna'}
            </div>
            <div className="stat-description">Dostępność mieszkań</div>
          </div>
        </div>

        <div className="summary">
          <h4>Kluczowe Wnioski:</h4>
          <ul>
            <li>Ceny mieszkań rosną znacznie szybciej niż wynagrodzenia</li>
            <li>Różnica w tempie wzrostu pogarsza dostępność mieszkań</li>
            <li>Trend jest szczególnie widoczny w dużych miastach</li>
            <li>Konieczne są interwencje polityki mieszkaniowej</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PorownanieTrendow;
