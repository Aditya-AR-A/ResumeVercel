"use client";

import React, { useState, useEffect } from 'react';

import type { PlotParams } from 'react-plotly.js';
import type { ScatterData, PieData } from 'plotly.js';
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic<PlotParams>(() => import('react-plotly.js'), { ssr: false });

type ChartData = Partial<ScatterData> | Partial<PieData> | null;

function generateData(type: string): ChartData {
  switch (type) {
    case 'sales':
      return {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        y: [20, 14, 23, 25, 22, 16],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'blue' },
        name: 'Sales Data'
      };
    case 'ml_performance':
      return {
        x: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
        y: [0.92, 0.89, 0.94, 0.91],
        type: 'bar',
        marker: { color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'] },
        name: 'Model Performance'
      };
    case 'customer_segments':
      return {
        labels: ['Premium', 'Standard', 'Basic', 'Trial'],
        values: [35, 40, 20, 5],
        type: 'pie',
        marker: { colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'] },
        name: 'Customer Segments'
      };
    default:
      return null;
  }
}

const InteractiveDashboard = () => {
  const [selectedDataset, setSelectedDataset] = useState('sales');

  const [chartData, setChartData] = useState<ChartData>(null);


  useEffect(() => {
    setChartData(generateData(selectedDataset));
  }, [selectedDataset]);

  const getLayout = () => {
    switch (selectedDataset) {
      case 'sales':
        return {
          title: { text: 'Monthly Sales Trend Analysis' },
          xaxis: { title: { text: 'Month' } },
          yaxis: { title: { text: 'Sales (K$)' } }
        };
      case 'ml_performance':
        return {
          title: { text: 'Machine Learning Model Performance Metrics' },
          xaxis: { title: { text: 'Metrics' } },
          yaxis: { title: { text: 'Score' }, range: [0, 1] }
        };
      case 'customer_segments':
        return {
          title: { text: 'Customer Segmentation Analysis' }
        };
      default:
        return {};
    }
  };

  return (
    <section id="dashboard" className="section py-8 px-4">
      <h2>Interactive Data Dashboard</h2>
      <p>This dashboard demonstrates real-time data visualization capabilities using Plotly.js</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Dataset:</label>
        <select 
          value={selectedDataset} 
          onChange={(e) => setSelectedDataset(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="sales">Sales Analysis</option>
          <option value="ml_performance">ML Model Performance</option>
          <option value="customer_segments">Customer Segmentation</option>
        </select>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {chartData && (
          <Plot
            data={[chartData]}
            layout={{
              ...getLayout(),
              autosize: true,
              margin: { l: 50, r: 50, t: 50, b: 50 }
            }}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
          />
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
        <h4>Technical Implementation:</h4>
        <ul>
          <li><strong>Frontend:</strong> React + TypeScript + Plotly.js</li>
          <li><strong>Data Processing:</strong> Dynamic data generation and transformation</li>
          <li><strong>Interactivity:</strong> Real-time chart updates based on user selection</li>
          <li><strong>Responsive Design:</strong> Auto-resizing charts for mobile compatibility</li>
        </ul>
      </div>
    </section>
  );
};

export default InteractiveDashboard;
