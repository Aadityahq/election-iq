import React, { useEffect } from 'react';
import { electionPhases } from '../data/quizData';
import UiIcon from './UiIcon';
import '../styles/timeline.css';

function Timeline() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.charts.load('current', { packages: ['timeline'] });
      window.google.charts.setOnLoadCallback(drawChart);
    };

    function drawChart() {
      const container = document.getElementById('timeline');
      if (!container) return;

      const chart = new window.google.visualization.Timeline(container);
      const dataTable = new window.google.visualization.DataTable();

      dataTable.addColumn({ type: 'string', id: 'Phase' });
      dataTable.addColumn({ type: 'string', id: 'Name' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });

      dataTable.addRows([
        ['Election', 'Voter Registration', new Date(2024, 0, 1), new Date(2024, 2, 31)],
        ['Election', 'Nomination Filing', new Date(2024, 3, 1), new Date(2024, 3, 15)],
        ['Election', 'Campaigning', new Date(2024, 3, 16), new Date(2024, 4, 30)],
        ['Election', 'Voting Day', new Date(2024, 5, 1), new Date(2024, 5, 7)],
        ['Election', 'Vote Counting', new Date(2024, 5, 8), new Date(2024, 5, 10)],
        ['Election', 'Results & Inauguration', new Date(2024, 5, 11), new Date(2024, 6, 31)],
      ]);

      const options = {
        title: 'Election Timeline 2024',
        backgroundColor: 'transparent',
        hAxis: {
          textStyle: { color: '#fff', fontSize: 12 },
        },
        vAxis: {
          textStyle: { color: '#fff', fontSize: 12 },
        },
        colors: ['#6366f1'],
      };

      chart.draw(dataTable, options);
    }

    return () => {
      const container = document.getElementById('timeline');
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className="timeline-container">
      <h2>Election Timeline</h2>
      
      <div id="timeline" style={{ width: '100%', height: '300px' }}></div>

      <div className="phases-grid">
        {electionPhases.map((phase) => (
          <div key={phase.id} className="phase-card">
            <div className="phase-icon">
              <UiIcon name={phase.icon} size={24} />
            </div>
            <h3>{phase.name}</h3>
            <p className="phase-desc">{phase.description}</p>
            <p className="phase-duration">Duration: {phase.duration}</p>
            <details>
              <summary>Learn More</summary>
              <p>{phase.details}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
