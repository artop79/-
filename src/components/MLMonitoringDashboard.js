import React, { useEffect, useState } from 'react';
import './MLDashboard.css';

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) return null;
  return await res.json();
};

const SHAP_IMAGE_API = '/api/ml/shap_plot/';

const DriftAlert = () => {
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    fetchJson('/api/ml/drift_alert').then(setAlert);
  }, []);
  if (!alert) return null;
  return alert.alert ? (
    <div className="ml-alert ml-alert-error">
      <b>ВНИМАНИЕ:</b> Обнаружен дрейф данных! {alert.reasons && alert.reasons.join('; ')}
    </div>
  ) : null;
};

const FPFnLogTable = ({ log }) => (
  <div className="ml-errors-table">
    <h4>Журнал ошибок (FP/FN)</h4>
    <table>
      <thead>
        <tr>
          <th>Дата</th><th>Кандидат</th><th>True</th><th>Pred</th><th>Prob</th><th>Признаки</th>
        </tr>
      </thead>
      <tbody>
        {log.map((e, i) => (
          <tr key={i} className={e.true_label !== e.pred_label ? 'row-error' : ''}>
            <td>{e.timestamp && e.timestamp.slice(0,19).replace('T',' ')}</td>
            <td>{e.candidate_id}</td>
            <td>{e.true_label}</td>
            <td>{e.pred_label}</td>
            <td>{(e.prob*100).toFixed(1)}%</td>
            <td>{Object.entries(e.features).map(([k,v]) => `${k}: ${v}`).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DriftLogTable = ({ log }) => (
  <div className="ml-errors-table">
    <h4>История дрейфа</h4>
    <table>
      <thead>
        <tr><th>Дата</th><th>Score mean</th><th>Score p</th><th>HR mean</th><th>HR p</th></tr>
      </thead>
      <tbody>
        {log.map((e, i) => (
          <tr key={i}>
            <td>{e.timestamp && e.timestamp.slice(0,19).replace('T',' ')}</td>
            <td>{e.drift_metrics.score_mean_cur?.toFixed(2)}</td>
            <td>{e.drift_metrics.score_ks_p?.toFixed(3)}</td>
            <td>{e.drift_metrics.hr_mean_cur?.toFixed(2)}</td>
            <td>{e.drift_metrics.hr_ks_p?.toFixed(3)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SHAPGallery = ({ shapPlots }) => (
  <div className="ml-shap-gallery">
    <h4>SHAP-графики (важность признаков)</h4>
    <div className="shap-img-list">
      {shapPlots.map((fname, i) => (
        <div key={i} className="shap-img-item">
          <img src={SHAP_IMAGE_API + fname} alt={fname} style={{maxWidth:220, borderRadius:8}} />
          <div className="shap-img-caption">{fname}</div>
        </div>
      ))}
    </div>
  </div>
);

const MLMonitoringDashboard = () => {
  const [fpfnLog, setFpfnLog] = useState([]);
  const [driftLog, setDriftLog] = useState([]);
  const [shapPlots, setShapPlots] = useState([]);

  // Фильтры
  const [fpfnFilters, setFpfnFilters] = useState({date_from: '', date_to: '', candidate_id: '', error_type: 'all'});
  const [driftFilters, setDriftFilters] = useState({date_from: '', date_to: ''});

  const buildQuery = (filters) => Object.entries(filters).filter(([k,v]) => v).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');

  // Загрузка логов с учётом фильтров
  useEffect(() => {
    fetchJson('/api/ml/fpfn_log?' + buildQuery(fpfnFilters)).then(d => setFpfnLog(d && d.log ? d.log : []));
    fetchJson('/api/ml/drift_log?' + buildQuery(driftFilters)).then(d => setDriftLog(d && d.log ? d.log : []));
    // SHAP-графики по FP/FN
    fetchJson('/api/ml/fpfn_log?' + buildQuery(fpfnFilters)).then(d => {
      if (d && d.log) {
        const files = d.log.map(e => e.shap_plot).filter(Boolean);
        setShapPlots(files.slice(-8).reverse());
      }
    });
  }, [fpfnFilters, driftFilters]);

  // Скачивание CSV
  const downloadCSV = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="ml-dashboard">
      <h2>Мониторинг ML-модели</h2>
      <DriftAlert />
      {/* Фильтры FP/FN */}
      <div className="ml-filters">
        <label>Дата от <input type="date" value={fpfnFilters.date_from} onChange={e => setFpfnFilters(f => ({...f, date_from: e.target.value}))} /></label>
        <label>до <input type="date" value={fpfnFilters.date_to} onChange={e => setFpfnFilters(f => ({...f, date_to: e.target.value}))} /></label>
        <label>Кандидат <input type="text" placeholder="ID" value={fpfnFilters.candidate_id} onChange={e => setFpfnFilters(f => ({...f, candidate_id: e.target.value}))} style={{width:60}} /></label>
        <label>Тип ошибки
          <select value={fpfnFilters.error_type} onChange={e => setFpfnFilters(f => ({...f, error_type: e.target.value}))}>
            <option value="all">Все</option>
            <option value="fp">FP</option>
            <option value="fn">FN</option>
          </select>
        </label>
        <button onClick={() => downloadCSV('/api/ml/fpfn_log.csv?' + buildQuery(fpfnFilters))}>Скачать FP/FN CSV</button>
      </div>
      {/* Фильтры дрейфа */}
      <div className="ml-filters">
        <label>Дата от <input type="date" value={driftFilters.date_from} onChange={e => setDriftFilters(f => ({...f, date_from: e.target.value}))} /></label>
        <label>до <input type="date" value={driftFilters.date_to} onChange={e => setDriftFilters(f => ({...f, date_to: e.target.value}))} /></label>
        <button onClick={() => downloadCSV('/api/ml/drift_log.csv?' + buildQuery(driftFilters))}>Скачать Drift CSV</button>
      </div>
      <div className="ml-errors-tables">
        <FPFnLogTable log={fpfnLog} />
        <DriftLogTable log={driftLog} />
      </div>
      <SHAPGallery shapPlots={shapPlots} />
    </div>
  );
};

export default MLMonitoringDashboard;
