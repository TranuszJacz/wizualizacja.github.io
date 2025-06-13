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
              const years = rows[0].slice(1); // Pomijamy pierwszą kolumnę z nazwami województw
              
              const processedData: HousingData[] = years.map(year => {
                const yearData: HousingData = { year };
                
                rows.slice(1).forEach((row) => {
                  if (row[0]) {
                    // Clean region name
                    const wojewodztwo = row[0]
                      .replace(/[^\p{L}\s-]/gu, '')
                      .trim()
                      .toUpperCase();
                    
                    // Get price for this year
                    const yearIndex = years.indexOf(year);
                    if (yearIndex !== -1 && row[yearIndex + 1]) {
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
              
              // Get available regions from the data
              const availableRegions = Array.from(new Set(
                processedData.flatMap(yearData => 
                  Object.keys(yearData).filter(key => key !== 'year')
                )
              ));
              
              setSelectedRegions(availableRegions.slice(0, 5));
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
    return (
      <div className="chart-section">
        <h2>Ewolucja Cen Mieszkań w Poszczególnych Województwach</h2>
        <div className="loading">Ładowanie danych cen mieszkań...</div>
      </div>
    );
  }

  return (
    <div className="chart-section">
      <h2>Ewolucja Cen Mieszkań w Poszczególnych Województwach</h2>
      <div className="controls">
        <h3>Wybierz województwa do porównania:</h3>
        <div className="checkbox-grid">
          {Array.from(new Set(
            data.flatMap(yearData => 
              Object.keys(yearData).filter(key => key !== 'year')
            )
          )).map((region, index) => (
            <label key={region} className="checkbox-label">
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
      
      <div className="chart-container">
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
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="summary">
        <h3>Kluczowe Wnioski:</h3>
        <ul>
          <li>Wykres pokazuje ewolucję średnich cen mieszkań w poszczególnych województwach Polski w latach 2010-2023</li>
          <li>Można zaobserwować znaczne różnice regionalne - najwyższe ceny notowane są tradycyjnie w Mazowieckiem i Małopolskiem</li>
          <li>Województwa wschodnie i północne charakteryzują się niższymi cenami za metr kwadratowy</li>
          <li>Dane pochodzą z rzeczywistych transakcji rynkowych sprzedaży lokali mieszkalnych</li>
        </ul>
      </div>
    </div>
  );
};

export default CenyMieszkanChart;
