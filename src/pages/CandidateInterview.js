import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/CandidateInterview.css';

const CandidateInterview = () => {
  const { accessLink } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('welcome'); // 'welcome', 'instructions', 'interview', 'complete'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [answerMode, setAnswerMode] = useState('text'); // 'text' или 'audio'
  const [meetingStarted, setMeetingStarted] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  // Загрузка данных интервью по access link
  useEffect(() => {
    const fetchInterview = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/interviews/access/${accessLink}`);
        setInterview(response.data);
        
        // Инициализируем объект ответов
        const initialAnswers = {};
        response.data.questions.forEach(question => {
          initialAnswers[question.id] = {
            question_id: question.id,
            answer_text: '',
            audio_url: null,
            audio_blob: null,
            is_answered: false
          };
        });
        setAnswers(initialAnswers);
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке интервью:', err);
        if (err.response && err.response.status === 404) {
          setError('Интервью не найдено. Проверьте корректность ссылки.');
        } else if (err.response && err.response.status === 403) {
          setError('Это интервью уже завершено или недоступно.');
        } else {
          setError('Произошла ошибка при загрузке интервью. Пожалуйста, попробуйте позже.');
        }
        setLoading(false);
      }
    };
    
    fetchInterview();
  }, [accessLink]);
  
  // Обработка таймера для записи аудио
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRecording]);
  
  // Освобождаем ресурсы при размонтировании компонента
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  // Начало интервью
  const handleStartInterview = async () => {
    try {
      await axios.post(`/api/v1/interviews/access/${accessLink}/start`);
      setCurrentStep('interview');
    } catch (err) {
      console.error('Ошибка при начале интервью:', err);
      setError('Не удалось начать интервью. Пожалуйста, попробуйте позже.');
    }
  };
  
  // Отправка ответа на вопрос
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    
    const currentQuestion = interview.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];
    
    if (answerMode === 'text' && !textAnswer.trim()) {
      alert('Пожалуйста, введите ответ на вопрос.');
      return;
    }
    
    if (answerMode === 'audio' && !audioBlob) {
      alert('Пожалуйста, запишите аудиоответ на вопрос.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Формируем данные для отправки
      const formData = new FormData();
      formData.append('question_id', currentQuestion.id);
      
      if (answerMode === 'text') {
        formData.append('answer_text', textAnswer);
      } else {
        // Создаем файл из Blob
        const audioFile = new File([audioBlob], `answer_${currentQuestion.id}.webm`, {
          type: 'audio/webm'
        });
        formData.append('audio_file', audioFile);
      }
      
      // Отправляем ответ на сервер
      await axios.post(`/api/v1/interviews/access/${accessLink}/answers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Обновляем состояние ответа
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          answer_text: answerMode === 'text' ? textAnswer : '',
          audio_blob: answerMode === 'audio' ? audioBlob : null,
          audio_url: answerMode === 'audio' ? audioUrl : null,
          is_answered: true
        }
      }));
      
      // Сбрасываем состояние ответа
      setTextAnswer('');
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      
      // Если это был последний вопрос, завершаем интервью
      if (currentQuestionIndex === interview.questions.length - 1) {
        await completeInterview();
      } else {
        // Переходим к следующему вопросу
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }
      
      setIsAnswering(false);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Ошибка при отправке ответа:', err);
      alert('Не удалось отправить ответ. Пожалуйста, попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };
  
  // Завершение интервью
  const completeInterview = async () => {
    try {
      await axios.post(`/api/v1/interviews/access/${accessLink}/complete`);
      setCurrentStep('complete');
    } catch (err) {
      console.error('Ошибка при завершении интервью:', err);
      alert('Не удалось завершить интервью. Пожалуйста, попробуйте еще раз.');
    }
  };
  
  // Начало записи аудио
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Останавливаем все треки
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Ошибка при запуске записи аудио:', err);
      alert('Не удалось запустить запись аудио. Пожалуйста, проверьте, что у вас есть доступ к микрофону и попробуйте еще раз.');
    }
  };
  
  // Остановка записи аудио
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Форматирование времени записи
  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Обработка начала видеовстречи
  const handleStartMeeting = () => {
    const { meeting_id, meeting_password } = interview;
    
    if (!meeting_id) {
      alert('Для этого интервью не настроена видеовстреча.');
      return;
    }
    
    // Открываем Zoom в новом окне
    const zoomUrl = `https://zoom.us/j/${meeting_id}?pwd=${meeting_password || ''}`;
    window.open(zoomUrl, '_blank');
    
    setMeetingStarted(true);
  };
  
  // Рендеринг экрана загрузки
  if (loading) {
    return (
      <div className="candidate-interview-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка интервью...</p>
        </div>
      </div>
    );
  }
  
  // Рендеринг экрана ошибки
  if (error) {
    return (
      <div className="candidate-interview-page">
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2>Ошибка</h2>
          <p>{error}</p>
          <button 
            className="primary-button"
            onClick={() => navigate('/')}
          >
            На главную
          </button>
        </div>
      </div>
    );
  }
  
  // Рендеринг экрана приветствия
  if (currentStep === 'welcome') {
    return (
      <div className="candidate-interview-page">
        <div className="welcome-container">
          <div className="interview-header">
            <div className="company-logo">
              <img src="/logo.png" alt="Company Logo" />
            </div>
            <h1>Добро пожаловать на интервью</h1>
          </div>
          
          <div className="interview-info">
            <h2>Информация о собеседовании</h2>
            <div className="info-card">
              <div className="info-item">
                <span className="info-label">Вакансия:</span>
                <span className="info-value">{interview.vacancy_title}</span>
              </div>
              
              {interview.candidate_name && (
                <div className="info-item">
                  <span className="info-label">Кандидат:</span>
                  <span className="info-value">{interview.candidate_name}</span>
                </div>
              )}
              
              {interview.scheduled_at && (
                <div className="info-item">
                  <span className="info-label">Запланировано на:</span>
                  <span className="info-value">
                    {new Date(interview.scheduled_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
              
              <div className="info-item">
                <span className="info-label">Формат:</span>
                <span className="info-value">
                  {interview.meeting_id ? 'Видеоинтервью через Zoom' : 'AI-интервью с текстовыми/аудио ответами'}
                </span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Количество вопросов:</span>
                <span className="info-value">{interview.questions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="interview-actions">
            {interview.meeting_id ? (
              <button 
                className="primary-button"
                onClick={handleStartMeeting}
              >
                Присоединиться к видеовстрече
              </button>
            ) : (
              <button 
                className="primary-button"
                onClick={() => setCurrentStep('instructions')}
              >
                Начать интервью
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Рендеринг экрана инструкций
  if (currentStep === 'instructions') {
    return (
      <div className="candidate-interview-page">
        <div className="instructions-container">
          <div className="interview-header">
            <h1>Инструкции перед началом</h1>
          </div>
          
          <div className="instructions-content">
            <div className="instruction-item">
              <div className="instruction-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="instruction-text">
                <h3>Время</h3>
                <p>Вы можете отвечать на вопросы в своем темпе. Рекомендуемое время на один вопрос - 2-3 минуты.</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <div className="instruction-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <div className="instruction-text">
                <h3>Аудио</h3>
                <p>Вы можете выбрать для ответа текстовый формат или аудиозапись. Для аудиозаписи убедитесь, что ваш микрофон работает.</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <div className="instruction-icon">
                <i className="fas fa-redo"></i>
              </div>
              <div className="instruction-text">
                <h3>Повторные ответы</h3>
                <p>Вы не сможете вернуться и изменить свои ответы после их отправки, поэтому отвечайте внимательно.</p>
              </div>
            </div>
            
            <div className="instruction-item">
              <div className="instruction-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="instruction-text">
                <h3>AI-анализ</h3>
                <p>Ваши ответы будут проанализированы с помощью искусственного интеллекта для оценки соответствия требованиям вакансии.</p>
              </div>
            </div>
          </div>
          
          <div className="privacy-notice">
            <p>
              Нажимая кнопку "Начать интервью", вы даете согласие на обработку своих ответов
              и использование этих данных для оценки вашей кандидатуры на данную вакансию.
            </p>
          </div>
          
          <div className="instructions-actions">
            <button 
              className="secondary-button"
              onClick={() => setCurrentStep('welcome')}
            >
              Назад
            </button>
            <button 
              className="primary-button"
              onClick={handleStartInterview}
            >
              Начать интервью
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Рендеринг экрана интервью
  if (currentStep === 'interview') {
    const currentQuestion = interview.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
    const currentAnswer = answers[currentQuestion.id];
    
    return (
      <div className="candidate-interview-page">
        <div className="interview-container">
          <div className="interview-progress">
            <div className="progress-info">
              <span>Вопрос {currentQuestionIndex + 1} из {interview.questions.length}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentQuestionIndex + 1) / interview.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="question-container">
            <h2 className="question-text">
              {currentQuestion.question_text}
            </h2>
            
            {currentQuestion.category && (
              <div className="question-category">
                Категория: {currentQuestion.category}
              </div>
            )}
            
            {isAnswering ? (
              <div className="answer-container">
                <div className="answer-mode-selector">
                  <button 
                    className={`mode-button ${answerMode === 'text' ? 'active' : ''}`}
                    onClick={() => setAnswerMode('text')}
                    disabled={isRecording}
                  >
                    <i className="fas fa-keyboard"></i> Текстовый ответ
                  </button>
                  <button 
                    className={`mode-button ${answerMode === 'audio' ? 'active' : ''}`}
                    onClick={() => setAnswerMode('audio')}
                    disabled={isRecording}
                  >
                    <i className="fas fa-microphone"></i> Аудиоответ
                  </button>
                </div>
                
                {answerMode === 'text' ? (
                  <div className="text-answer-input">
                    <textarea
                      placeholder="Введите ваш ответ здесь..."
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      rows={6}
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                ) : (
                  <div className="audio-answer-input">
                    {isRecording ? (
                      <div className="recording-container">
                        <div className="recording-indicator">
                          <div className="recording-pulse"></div>
                          <span className="recording-time">{formatRecordingTime(recordingTime)}</span>
                        </div>
                        <button 
                          className="stop-recording-button"
                          onClick={stopRecording}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-stop"></i> Остановить запись
                        </button>
                      </div>
                    ) : audioUrl ? (
                      <div className="audio-preview-container">
                        <audio controls src={audioUrl} className="audio-preview"></audio>
                        <button
                          className="record-again-button"
                          onClick={() => {
                            if (audioUrl) {
                              URL.revokeObjectURL(audioUrl);
                            }
                            setAudioUrl(null);
                            setAudioBlob(null);
                          }}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-redo"></i> Записать заново
                        </button>
                      </div>
                    ) : (
                      <div className="start-recording-container">
                        <p>Нажмите кнопку ниже, чтобы начать запись вашего ответа.</p>
                        <button 
                          className="start-recording-button"
                          onClick={startRecording}
                          disabled={isSubmitting}
                        >
                          <i className="fas fa-microphone"></i> Начать запись
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="answer-actions">
                  <button 
                    className="secondary-button"
                    onClick={() => {
                      setIsAnswering(false);
                      setTextAnswer('');
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl);
                      }
                      setAudioUrl(null);
                      setAudioBlob(null);
                      setIsRecording(false);
                    }}
                    disabled={isSubmitting || isRecording}
                  >
                    Отмена
                  </button>
                  <button 
                    className="primary-button"
                    onClick={handleSubmitAnswer}
                    disabled={
                      isSubmitting || 
                      isRecording || 
                      (answerMode === 'text' && !textAnswer.trim()) || 
                      (answerMode === 'audio' && !audioBlob)
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <div className="button-spinner"></div> Отправка...
                      </>
                    ) : (
                      isLastQuestion ? 'Завершить интервью' : 'Следующий вопрос'
                    )}
                  </button>
                </div>
              </div>
            ) : currentAnswer.is_answered ? (
              <div className="answer-complete-container">
                <div className="answer-complete-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <p>Ответ на этот вопрос успешно записан!</p>
                <button 
                  className="primary-button"
                  onClick={() => {
                    if (currentQuestionIndex < interview.questions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      setCurrentStep('complete');
                    }
                  }}
                >
                  {currentQuestionIndex < interview.questions.length - 1 ? 'Перейти к следующему вопросу' : 'Завершить интервью'}
                </button>
              </div>
            ) : (
              <div className="answer-actions-container">
                <button 
                  className="primary-button"
                  onClick={() => setIsAnswering(true)}
                >
                  Ответить на вопрос
                </button>
                {!currentQuestion.is_required && (
                  <button 
                    className="skip-button"
                    onClick={() => {
                      if (currentQuestionIndex < interview.questions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                      } else {
                        completeInterview();
                      }
                    }}
                  >
                    Пропустить вопрос
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Рендеринг экрана завершения
  if (currentStep === 'complete') {
    return (
      <div className="candidate-interview-page">
        <div className="complete-container">
          <div className="complete-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Интервью завершено!</h1>
          <p>Спасибо за прохождение собеседования на вакансию {interview.vacancy_title}.</p>
          <div className="complete-info">
            <p>Ваши ответы успешно записаны и будут проанализированы нашими специалистами.</p>
            <p>Мы свяжемся с вами в ближайшее время для информирования о результатах.</p>
          </div>
          
          <div className="complete-actions">
            <button 
              className="primary-button"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Если ни одно из условий не выполнено, возвращаем пустую страницу
  return null;
};

export default CandidateInterview;
