import React, { useState } from 'react';
import './ZoomInterviewPanel.css';

// Пример компонента для HR/оператора
export function CreateInterviewPanel({ candidateId, jobId }) {
  const [scheduledTime, setScheduledTime] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/interview/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, job_id: jobId, scheduled_time: scheduledTime })
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="zoom-interview-create-panel">
      <h3>Запланировать Zoom-интервью</h3>
      <label>
        Время (UTC):
        <input type="datetime-local" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
      </label>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Создание...' : 'Создать интервью'}
      </button>
      <div style={{ minHeight: 32, marginTop: 8 }}>
        {error && <div style={{color:'#E53935', fontWeight:600, borderRadius:10, background:'#fff3f3', padding:'8px 12px', boxShadow:'0 2px 8px 0 rgba(229,57,53,0.09)', transition:'all 0.3s'}}>{error}</div>}
        {result && (
          <div className="zoom-links" style={{animation:'fadeIn 0.6s'}}>
            <div><b>Ссылка для кандидата:</b> <a href={result.join_url} target="_blank" rel="noopener noreferrer">Перейти в Zoom</a></div>
            <div><b>Ссылка для HR:</b> <a href={result.start_url} target="_blank" rel="noopener noreferrer">Начать Zoom</a></div>
            <div><b>Meeting ID:</b> {result.zoom_meeting_id}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Пример панели для кандидата/HR для просмотра интервью
export function InterviewInfoPanel({ interviewId }) {
  // fadeIn animation for transcript/info
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeIn { from {opacity:0;transform:translateY(16px);} to {opacity:1;transform:translateY(0);} }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetch(`/api/interview/${interviewId}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setInfo)
      .catch(e => setError(e.toString()));
  }, [interviewId]);

  if (error) return <div style={{color:'#E53935', fontWeight:600, borderRadius:10, background:'#fff3f3', padding:'8px 12px', boxShadow:'0 2px 8px 0 rgba(229,57,53,0.09)', margin:'32px auto', maxWidth:420}}>{error}</div>;
  if (!info) return <div style={{textAlign:'center', margin:'32px', color:'#6C63FF'}}>Загрузка...</div>;

  return (
    <div className="zoom-interview-info-panel">
      <h3>Интервью #{info.id}</h3>
      <div><b>Кандидат:</b> {info.candidate_id}</div>
      <div><b>Вакансия:</b> {info.job_id}</div>
      <div><b>Время:</b> {info.scheduled_time || 'Не задано'}</div>
      <div><b>Статус:</b> <span style={{color: info.status==='finished' ? '#48C6EF' : '#6C63FF', fontWeight:600}}>{info.status}</span></div>
      <div><b>Ссылка для Zoom:</b> <a href={info.join_url} target="_blank" rel="noopener noreferrer">Перейти</a></div>
      {info.transcript && (
        <div className="zoom-transcript" style={{animation:'fadeIn 0.6s'}}>
          <b>Транскрипт:</b>
          <pre>{info.transcript}</pre>
        </div>
      )}
    </div>
  );
}
