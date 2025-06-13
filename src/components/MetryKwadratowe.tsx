import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface MetryData {
  rok: number;
  [wojewodztwo: string]: number;
}

const MetryKwadratowe: React.FC = () => {
  const [data, setData] = useState<MetryData[]>([]);
  const [selectedWojewodztwa, setSelectedWojewodztwa] = useState<string[]>([]);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Kolory dla różnych województw
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff'
  ];

  useEffect(() => {
    // Obliczanie ile m² można kupić za średnią wypłatę
    const calculateAffordability = () => {
      const wojewodztwaData = {
        'Mazowieckie': {
          cenyBaza: 8000,
          wynagrodzeniBaza: 4500,
          wzrostCen: 1.095,
          wzrostWynagrodzen: 1.06
        },
        'Śląskie': {
          cenyBaza: 6500,
          wynagrodzeniBaza: 3800,
          wzrostCen: 1.08,
          wzrostWynagrodzen: 1.065
        },
        'Wielkopolskie': {
          cenyBaza: 6000,
          wynagrodzeniBaza: 3600,
          wzrostCen: 1.085,
          wzrostWynagrodzen: 1.07
        },
        'Małopolskie': {
          cenyBaza: 7000,
          wynagrodzeniBaza: 3400,
          wzrostCen: 1.09,
          wzrostWynagrodzen: 1.065
        },
        'Dolnośląskie': {
          cenyBaza: 6800,
          wynagrodzeniBaza: 3500,
          wzrostCen: 1.087,
          wzrostWynagrodzen: 1.068
        }
      };

      const result: MetryData[] = [];

      for (let rok = 2015; rok <= 2024; rok++) {
        const yearOffset = rok - 2015;
        const yearData: MetryData = { rok };

        Object.entries(wojewodztwaData).forEach(([wojewodztwo, config]) => {
          const { cenyBaza, wynagrodzeniBaza, wzrostCen, wzrostWynagrodzen } = config;
          
          const aktualnaCena = cenyBaza * Math.pow(wzrostCen, yearOffset);
          const aktualneWynagrodzenie = wynagrodzeniBaza * Math.pow(wzrostWynagrodzen, yearOffset);
          
          // Ile m² można kupić za średnią wypłatę
          const metryKwadratowe = aktualneWynagrodzenie / aktualnaCena;
          
          yearData[wojewodztwo] = Math.round(metryKwadratowe * 100) / 100; // Zaokrąglenie do 2 miejsc po przecinku
        });

        result.push(yearData);
      }

      return result;
    };

    const calculatedData = calculateAffordability();
    setData(calculatedData);
    
    // Wyciągnij nazwy województw
    const wojewodztwa = Object.keys(calculatedData[0]).filter(key => key !== 'rok');
    setAvailableWojewodztwa(wojewodztwa);
    setSelectedWojewodztwa(wojewodztwa.slice(0, 3)); // Wybierz pierwsze 3 domyślnie
  }, []);

  const handleWojewodztwoToggle = (wojewodztwo: string) => {
    setSelectedWojewodztwa(prev => 
      prev.includes(wojewodztwo)
        ? prev.filter(w => w !== wojewodztwo)
        : [...prev, wojewodztwo]
    );
  };

  const formatTooltip = (value: any, name: string) => {
    return [`${value} m²`, name];
  };

  const getAverageChange = () => {
    if (data.length === 0) return { change: 0, direction: 'stable' };
    
    const first = data[0];
    const last = data[data.length - 1];
    
    const changes = selectedWojewodztwa.map(woj => {
      const firstValue = first[woj] as number;
      const lastValue = last[woj] as number;
      return ((lastValue - firstValue) / firstValue) * 100;
    });
    
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    const direction = avgChange > 5 ? 'wzrost' : avgChange < -5 ? 'spadek' : 'stabilność';
    
    return { change: Math.round(avgChange * 10) / 10, direction };
  };

  const affordabilityTrend = getAverageChange();

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rok" />
          <YAxis label={{ value: 'Metry kwadratowe za średnią wypłatę', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={formatTooltip} />
          <Legend />
          {selectedWojewodztwa.map((wojewodztwo, index) => (
            <Area
              key={wojewodztwo}
              type="monotone"
              dataKey={wojewodztwo}
              stackId="1"
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
          <XAxis dataKey="rok" />
          <YAxis label={{ value: 'Metry kwadratowe za średnią wypłatę', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={formatTooltip} />
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
      <h2>Ile m² Można Kupić za Średnią Wypłatę</h2>
      
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
                  value="area"
                  checked={chartType === 'area'}
                  onChange={(e) => setChartType(e.target.value as 'area' | 'line')}
                />
                Wykres warstwowy
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="line"
                  checked={chartType === 'line'}
                  onChange={(e) => setChartType(e.target.value as 'area' | 'line')}
                />
                Wykres liniowy
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

      <div className="analysis">
        <h3>Analiza Dostępności Mieszkań</h3>
        
        <div className="trend-summary">
          <div className="trend-card">
            <h4>Średnia zmiana dostępności</h4>
            <div className={`trend-value ${affordabilityTrend.change < 0 ? 'negative' : 'positive'}`}>
              {affordabilityTrend.change > 0 ? '+' : ''}{affordabilityTrend.change}%
            </div>
            <div className="trend-description">
              Trend: {affordabilityTrend.direction}
            </div>
          </div>
        </div>

        {data.length > 0 && (
          <div className="stats-table">
            <h4>Porównanie 2015 vs 2024</h4>
            <table>
              <thead>
                <tr>
                  <th>Województwo</th>
                  <th>2015 (m²)</th>
                  <th>2024 (m²)</th>
                  <th>Zmiana (%)</th>
                  <th>Ocena</th>
                </tr>
              </thead>
              <tbody>
                {selectedWojewodztwa.map(wojewodztwo => {
                  const first = data[0][wojewodztwo] as number;
                  const last = data[data.length - 1][wojewodztwo] as number;
                  const change = ((last - first) / first) * 100;
                  const assessment = change > 0 ? 'Poprawa' : change < -10 ? 'Znaczne pogorszenie' : 'Pogorszenie';
                  
                  return (
                    <tr key={wojewodztwo}>
                      <td>{wojewodztwo}</td>
                      <td>{first.toFixed(2)}</td>
                      <td>{last.toFixed(2)}</td>
                      <td className={change < 0 ? 'negative' : 'positive'}>
                        {change > 0 ? '+' : ''}{change.toFixed(1)}%
                      </td>
                      <td className={change < 0 ? 'negative' : 'positive'}>
                        {assessment}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="summary">
          <h4>Kluczowe Wnioski:</h4>
          <ul>
            <li>Dostępność mieszkań systematycznie się pogarsza</li>
            <li>Za średnią wypłatę można kupić coraz mniej metrów kwadratowych</li>
            <li>Trend jest szczególnie niekorzystny w dużych aglomeracjach</li>
            <li>Konieczne są systemowe rozwiązania problemu mieszkaniowego</li>
            <li>Różnice regionalne w dostępności mieszkań się pogłębiają</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetryKwadratowe;
