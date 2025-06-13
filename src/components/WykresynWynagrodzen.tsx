import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WynagrodzeniaData {
  rok: number;
  [wojewodztwo: string]: number;
}

const WykresynWynagrodzen: React.FC = () => {
  const [data, setData] = useState<WynagrodzeniaData[]>([]);
  const [selectedWojewodztwa, setSelectedWojewodztwa] = useState<string[]>([]);
  const [availableWojewodztwa, setAvailableWojewodztwa] = useState<string[]>([]);

  // Kolory dla różnych województw
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
    '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#0000ff',
    '#800080', '#008080', '#808000', '#800000', '#008000'
  ];

  useEffect(() => {
    // Symulowane dane wynagrodzeń dla różnych województw (2015-2024)
    const mockData: WynagrodzeniaData[] = [
      { rok: 2015, 'Mazowieckie': 4500, 'Śląskie': 3800, 'Wielkopolskie': 3600, 'Małopolskie': 3400, 'Dolnośląskie': 3500 },
      { rok: 2016, 'Mazowieckie': 4700, 'Śląskie': 3950, 'Wielkopolskie': 3750, 'Małopolskie': 3550, 'Dolnośląskie': 3650 },
      { rok: 2017, 'Mazowieckie': 4950, 'Śląskie': 4150, 'Wielkopolskie': 3950, 'Małopolskie': 3750, 'Dolnośląskie': 3850 },
      { rok: 2018, 'Mazowieckie': 5200, 'Śląskie': 4350, 'Wielkopolskie': 4150, 'Małopolskie': 3950, 'Dolnośląskie': 4050 },
      { rok: 2019, 'Mazowieckie': 5500, 'Śląskie': 4600, 'Wielkopolskie': 4400, 'Małopolskie': 4200, 'Dolnośląskie': 4300 },
      { rok: 2020, 'Mazowieckie': 5750, 'Śląskie': 4800, 'Wielkopolskie': 4600, 'Małopolskie': 4400, 'Dolnośląskie': 4500 },
      { rok: 2021, 'Mazowieckie': 6100, 'Śląskie': 5100, 'Wielkopolskie': 4900, 'Małopolskie': 4700, 'Dolnośląskie': 4800 },
      { rok: 2022, 'Mazowieckie': 6500, 'Śląskie': 5450, 'Wielkopolskie': 5250, 'Małopolskie': 5000, 'Dolnośląskie': 5150 },
      { rok: 2023, 'Mazowieckie': 7000, 'Śląskie': 5850, 'Wielkopolskie': 5650, 'Małopolskie': 5400, 'Dolnośląskie': 5550 },
      { rok: 2024, 'Mazowieckie': 7500, 'Śląskie': 6300, 'Wielkopolskie': 6100, 'Małopolskie': 5850, 'Dolnośląskie': 6000 }
    ];

    setData(mockData);
    
    // Wyciągnij nazwy województw (pomijając kolumnę 'rok')
    const wojewodztwa = Object.keys(mockData[0]).filter(key => key !== 'rok');
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
    return [`${value} zł`, name];
  };

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
