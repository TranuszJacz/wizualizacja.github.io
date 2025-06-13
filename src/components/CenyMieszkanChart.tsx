import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

interface HousingData {
  year: string;
  [wojewodztwo: string]: string | number;
}

const CenyMieszkanChart: React.FC = () => {
  const [data, setData] = useState<HousingData[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', 
    '#ff0000', '#0000ff', '#ff00ff', '#00ffff', '#ffff00',
    '#800080', '#ffa500', '#808080', '#000080', '#008000', '#800000'
  ];

  const wojewodztwa = [
    'DOLNOŚLĄSKIE', 'KUJAWSKO-POMORSKIE', 'LUBELSKIE', 'LUBUSKIE', 
    'ŁÓDZKIE', 'MAŁOPOLSKIE', 'MAZOWIECKIE', 'OPOLSKIE', 
    'PODKARPACKIE', 'PODLASKIE', 'POMORSKIE', 'ŚLĄSKIE', 
    'ŚWIĘTOKRZYSKIE', 'WARMIŃSKO-MAZURSKIE', 'WIELKOPOLSKIE', 'ZACHODNIOPOMORSKIE'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/src/Dane(Sheet1).csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: false,
          complete: (result) => {
            const rows = result.data as string[][];
            if (rows.length > 1) {
              const years = rows[0].slice(1); // Pomijamy pierwszą kolumnę z nazwami województw
              
              const processedData: HousingData[] = years.map(year => {
                const yearData: HousingData = { year };
                
                rows.slice(1).forEach((row, index) => {
                  if (row[0] && row[year]) {
                    const wojewodztwo = row[0].replace(/[^a-zA-ZĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]/g, '').trim();
                    const price = parseFloat(row[years.indexOf(year) + 1]?.replace(/[^\d,]/g, '')?.replace(',', '.') || '0');
                    if (price > 0) {
                      yearData[wojewodztwo] = price;
                    }
                  }
                });
                
                return yearData;
              });
              
              setData(processedData);
              setSelectedRegions(wojewodztwa.slice(0, 5)); // Domyślnie wybieramy pierwsze 5 województw
            }
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

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pl-PL').format(value) + ' zł/m²';
  };

  if (loading) {
    return <div className="loading">Ładowanie danych cen mieszkań...</div>;
  }

  return (
    <div className="chart-container">
      <div className="chart-controls">
        <h3>Wybierz województwa do porównania:</h3>
        <div className="region-selector">
          {wojewodztwa.map((region, index) => (
            <label key={region} className="region-checkbox">
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => toggleRegion(region)}
              />
              <span style={{ color: colors[index % colors.length] }}>
                {region}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 100, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k zł`}
            />
            <Tooltip 
              formatter={(value: number) => formatPrice(value)}
              labelStyle={{ color: '#333' }}
            />
            <Legend />
            {selectedRegions.map((region, index) => (
              <Line
                key={region}
                type="monotone"
                dataKey={region}
                stroke={colors[wojewodztwa.indexOf(region) % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-description">
        <p>
          <strong>Wykres pokazuje ewolucję średnich cen mieszkań w poszczególnych województwach Polski w latach 2010-2023.</strong>
          <br />
          Można zaobserwować znaczne różnice regionalne - najwyższe ceny notowane są tradycyjnie w Mazowieckiem i Małopolskiem,
          podczas gdy województwa wschodnie i północne charakteryzują się niższymi cenami za metr kwadratowy.
        </p>
      </div>
    </div>
  );
};

export default CenyMieszkanChart;
