import React, { useEffect, useState } from 'react';
import './MLDashboard.css';
import '../AppFramer.css';

const fetchErrors = async () => {
  const res = await fetch('/api/ml/errors');
  if (!res.ok) return null;
  return await res.json();
};

const ConfusionMatrix = ({ TP, TN, FP, FN }) => (
  <div className="cmatrix">
    <div className="cmatrix-title">Confusion Matrix</div>
    <table>
      <thead>
        <tr><th></th><th>Predicted: 1</th><th>Predicted: 0</th></tr>
      </thead>
      <tbody>
        <tr><th>Actual: 1</th><td>{TP}</td><td>{FN}</td></tr>
        <tr><th>Actual: 0</th><td>{FP}</td><td>{TN}</td></tr>
      </tbody>
    </table>
  </div>
);

const ROCInfo = ({ metrics }) => (
  <div className="roc-info">
    <div><b>ROC-AUC:</b> {metrics.roc_auc !== null ? metrics.roc_auc.toFixed(3) : 'N/A'}</div>
    <div><b>Accuracy:</b> {metrics.accuracy.toFixed(3)}</div>
    <div><b>F1:</b> {metrics.f1.toFixed(3)}</div>
    <div><b>Precision:</b> {metrics.precision.toFixed(3)}</div>
    <div><b>Recall:</b> {metrics.recall.toFixed(3)}</div>
  </div>
);

const ErrorTable = ({ data, type, filterScore, filterHR }) => (
  <div className="ml-errors-table">
    <h4>{type === 'fp' ? 'False Positives (FP)' : 'False Negatives (FN)'}</h4>
    <table>
      <thead>
        <tr>
          <th>Score</th>
          <th>HR Rating</th>
          <th>ML Prob</th>
          <th>True Label</th>
        </tr>
      </thead>
      <tbody>
        {data.filter(e =>
          (filterScore === '' || e.score >= filterScore[0] && e.score <= filterScore[1]) &&
          (filterHR === '' || e.hr_rating >= filterHR[0] && e.hr_rating <= filterHR[1])
        ).map((e, i) => (
          <tr key={i}>
            <td>{e.score}</td>
            <td>{e.hr_rating}</td>
            <td>{(e.ml_prob * 100).toFixed(1)}%</td>
            <td>{e.is_successful}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MLDashboard = () => {
  const [mlErrors, setMlErrors] = useState(null);
  const [scoreRange, setScoreRange] = useState(['', '']);
  const [hrRange, setHrRange] = useState(['', '']);

  useEffect(() => {
    fetchErrors().then(setMlErrors);
  }, []);

  if (!mlErrors) return <div>Загрузка аналитики ML...</div>;

  return (
    <div className="ml-dashboard">
      <h2>ML Аналитика ошибок</h2>
      <ROCInfo metrics={mlErrors.metrics} />
      <ConfusionMatrix TP={mlErrors.TP} TN={mlErrors.TN} FP={mlErrors.FP} FN={mlErrors.FN} />
      <div className="ml-filters">
        <label>Score от <input type="number" value={scoreRange[0]} onChange={e => setScoreRange([e.target.value, scoreRange[1]])} style={{width:40}} /> до <input type="number" value={scoreRange[1]} onChange={e => setScoreRange([scoreRange[0], e.target.value])} style={{width:40}} /></label>
        <label>HR Rating от <input type="number" value={hrRange[0]} onChange={e => setHrRange([e.target.value, hrRange[1]])} style={{width:40}} /> до <input type="number" value={hrRange[1]} onChange={e => setHrRange([hrRange[0], e.target.value])} style={{width:40}} /></label>
      </div>
      <div className="ml-errors-tables">
        <ErrorTable data={mlErrors.false_positives} type="fp" filterScore={scoreRange[0] !== '' && scoreRange[1] !== '' ? scoreRange : ''} filterHR={hrRange[0] !== '' && hrRange[1] !== '' ? hrRange : ''} />
        <ErrorTable data={mlErrors.false_negatives} type="fn" filterScore={scoreRange[0] !== '' && scoreRange[1] !== '' ? scoreRange : ''} filterHR={hrRange[0] !== '' && hrRange[1] !== '' ? hrRange : ''} />
      </div>
    </div>
  );
};

export default MLDashboard;
