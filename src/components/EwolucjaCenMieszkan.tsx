import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface CenyData {
  rok: number;
  [wojewodztwo: string]: number;
}

const EwolucjaCenMieszkan: React.FC = () => {
  const [data, setData] = useState<CenyData[]>([]);
  const [selectedWojewodztwa, setSelectedWojewodztwa] = useState<string[]>([]);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  // Kolory dla różnych województw
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff',
    '#800080', '#008080', '#808000', '#800000', '#008000'
  ];

  useEffect(() => {
    // Symulowane dane cen mieszkań dla różnych województw (2015-2024)
    const mockData: CenyData[] = [
      { rok: 2015, 'Mazowieckie': 8000, 'Śląskie': 6500, 'Wielkopolskie': 6000, 'Małopolskie': 7000, 'Dolnośląskie': 6800, 'Pomorskie': 6200, 'Łódzkie': 5500 },
      { rok: 2016, 'Mazowieckie': 8500, 'Śląskie': 6900, 'Wielkopolskie': 6350, 'Małopolskie': 7400, 'Dolnośląskie': 7200, 'Pomorskie': 6600, 'Łódzkie': 5800 },
      { rok: 2017, 'Mazowieckie': 9200, 'Śląskie': 7400, 'Wielkopolskie': 6800, 'Małopolskie': 7900, 'Dolnośląskie': 7700, 'Pomorskie': 7100, 'Łódzkie': 6200 },
      { rok: 2018, 'Mazowieckie': 10000, 'Śląskie': 8000, 'Wielkopolskie': 7400, 'Małopolskie': 8600, 'Dolnośląskie': 8300, 'Pomorskie': 7700, 'Łódzkie': 6700 },
      { rok: 2019, 'Mazowieckie': 10800, 'Śląskie': 8600, 'Wielkopolskie': 8000, 'Małopolskie': 9300, 'Dolnośląskie': 9000, 'Pomorskie': 8300, 'Łódzkie': 7200 },
      { rok: 2020, 'Mazowieckie': 11500, 'Śląskie': 9200, 'Wielkopolskie': 8500, 'Małopolskie': 9900, 'Dolnośląskie': 9600, 'Pomorskie': 8800, 'Łódzkie': 7600 },
      { rok: 2021, 'Mazowieckie': 12500, 'Śląskie': 10000, 'Wielkopolskie': 9200, 'Małopolskie': 10800, 'Dolnośląskie': 10400, 'Pomorskie': 9500, 'Łódzkie': 8200 },
      { rok: 2022, 'Mazowieckie': 13800, 'Śląskie': 11000, 'Wielkopolskie': 10100, 'Małopolskie': 11900, 'Dolnośląskie': 11400, 'Pomorskie': 10400, 'Łódzkie': 9000 },
      { rok: 2023, 'Mazowieckie': 15200, 'Śląskie': 12100, 'Wielkopolskie': 11100, 'Małopolskie': 13100, 'Dolnośląskie': 12500, 'Pomorskie': 11400, 'Łódzkie': 9900 },
      { rok: 2024, 'Mazowieckie': 16800, 'Śląskie': 13300, 'Wielkopolskie': 12200, 'Małopolskie': 14400, 'Dolnośląskie': 13700, 'Pomorskie': 12500, 'Łódzkie': 10900 }
    ];

    setData(mockData);
    
    // Wyciągnij nazwy województw (pomijając kolumnę 'rok')
    const wojewodztwa = Object.keys(mockData[0]).filter(key => key !== 'rok');
    setAvailableWojewodztwa(wojewodztwa);
    setSelectedWojewodztwa(wojewodztwa.slice(0, 4)); // Wybierz pierwsze 4 domyślnie
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
