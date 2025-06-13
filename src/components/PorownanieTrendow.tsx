import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const wojewodztwa = ['Mazowieckie', 'Śląskie', 'Wielkopolskie', 'Małopolskie', 'Dolnośląskie'];

  useEffect(() => {
    // Symulowane dane dla wybranego województwa
    const generateData = (wojewodztwo: string): TrendData[] => {
      const baseData = {
        'Mazowieckie': { cenaBaza: 8000, wynagrodzeniBaza: 4500 },
        'Śląskie': { cenaBaza: 6500, wynagrodzeniBaza: 3800 },
        'Wielkopolskie': { cenaBaza: 6000, wynagrodzeniBaza: 3600 },
        'Małopolskie': { cenaBaza: 7000, wynagrodzeniBaza: 3400 },
        'Dolnośląskie': { cenaBaza: 6800, wynagrodzeniBaza: 3500 }
      };

      const { cenaBaza, wynagrodzeniBaza } = baseData[wojewodztwo as keyof typeof baseData];
      
      const result: TrendData[] = [];
      
      for (let rok = 2015; rok <= 2024; rok++) {
        const yearOffset = rok - 2015;
        
        // Ceny mieszkań rosną szybciej (7-12% rocznie)
        const cenaMieszkania = Math.round(cenaBaza * Math.pow(1.095, yearOffset));
        
        // Wynagrodzenia rosną wolniej (5-7% rocznie)
        const wynagrodzenie = Math.round(wynagrodzeniBaza * Math.pow(1.06, yearOffset));
        
        // Oblicz wzrost rok do roku
        const previousYear = result[result.length - 1];
        const wzrostCen = previousYear 
          ? Math.round(((cenaMieszkania - previousYear.cenaMieszkania) / previousYear.cenaMieszkania) * 100)
          : 0;
        const wzrostWynagrodzen = previousYear
          ? Math.round(((wynagrodzenie - previousYear.wynagrodzenie) / previousYear.wynagrodzenie) * 100)
          : 0;
        
        // Indeks (2015 = 100)
        const indeksCen = Math.round((cenaMieszkania / cenaBaza) * 100);
        const indeksWynagrodzen = Math.round((wynagrodzenie / wynagrodzeniBaza) * 100);
        
        result.push({
          rok,
          cenaMieszkania,
          wynagrodzenie,
          wzrostCen,
          wzrostWynagrodzen,
          indeksCen,
          indeksWynagrodzen
        });
      }
      
      return result;
    };

    setData(generateData(selectedWojewodztwo));
  }, [selectedWojewodztwo]);

  const formatTooltip = (value: any, name: string) => {
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
            {wojewodztwa.map(woj => (
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
