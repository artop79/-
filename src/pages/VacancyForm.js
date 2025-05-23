import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import axios from 'axios';
import '../assets/css/VacancyForm.css';

const VacancyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: {
      skills: [],
      experience: [],
      education: []
    },
    interview_type: 'smart',
    evaluation_criteria: {
      technical_skills: 40,
      soft_skills: 30,
      experience: 20,
      cultural_fit: 10
    },
    is_active: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [experienceInput, setExperienceInput] = useState('');
  const [educationInput, setEducationInput] = useState('');
  
  // Загрузка данных для режима редактирования
  useEffect(() => {
    if (isEditMode) {
      fetchVacancyData();
    }
  }, [id]);
  
  const fetchVacancyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/vacancies/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке данных вакансии:', err);
      setLoading(false);
      // Показать сообщение об ошибке
    }
  };
  
  // Обработка изменений в форме
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Сбрасываем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Обработка изменения критериев оценки
  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevState => ({
      ...prevState,
      evaluation_criteria: {
        ...prevState.evaluation_criteria,
        [name]: parseInt(value, 10)
      }
    }));
  };
  
  // Добавление навыка
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prevState => ({
        ...prevState,
        requirements: {
          ...prevState.requirements,
          skills: [...prevState.requirements.skills, skillInput.trim()]
        }
      }));
      setSkillInput('');
    }
  };
  
  // Удаление навыка
  const handleRemoveSkill = (index) => {
    setFormData(prevState => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        skills: prevState.requirements.skills.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Добавление требования к опыту
  const handleAddExperience = () => {
    if (experienceInput.trim()) {
      setFormData(prevState => ({
        ...prevState,
        requirements: {
          ...prevState.requirements,
          experience: [...prevState.requirements.experience, experienceInput.trim()]
        }
      }));
      setExperienceInput('');
    }
  };
  
  // Удаление требования к опыту
  const handleRemoveExperience = (index) => {
    setFormData(prevState => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        experience: prevState.requirements.experience.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Добавление требования к образованию
  const handleAddEducation = () => {
    if (educationInput.trim()) {
      setFormData(prevState => ({
        ...prevState,
        requirements: {
          ...prevState.requirements,
          education: [...prevState.requirements.education, educationInput.trim()]
        }
      }));
      setEducationInput('');
    }
  };
  
  // Удаление требования к образованию
  const handleRemoveEducation = (index) => {
    setFormData(prevState => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        education: prevState.requirements.education.filter((_, i) => i !== index)
      }
    }));
  };
  
  // Валидация формы
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Название вакансии обязательно';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Название вакансии не должно превышать 255 символов';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Описание вакансии обязательно';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Описание вакансии должно содержать минимум 10 символов';
    }
    
    if (formData.requirements.skills.length === 0) {
      newErrors.skills = 'Добавьте хотя бы один навык';
    }
    
    if (formData.requirements.experience.length === 0) {
      newErrors.experience = 'Добавьте хотя бы одно требование к опыту';
    }
    
    // Проверка суммы критериев оценки
    const criteriaSum = Object.values(formData.evaluation_criteria).reduce((sum, val) => sum + val, 0);
    if (criteriaSum !== 100) {
      newErrors.evaluation_criteria = 'Сумма весов критериев должна быть 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Прокрутка к первой ошибке
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSaveLoading(true);
    
    try {
      if (isEditMode) {
        // Обновление существующей вакансии
        await axios.put(`/api/v1/vacancies/${id}`, formData);
      } else {
        // Создание новой вакансии
        await axios.post('/api/v1/vacancies', formData);
      }
      
      // Перенаправление на страницу вакансий
      navigate('/vacancies');
    } catch (err) {
      console.error('Ошибка при сохранении вакансии:', err);
      
      // Обработка ошибок валидации с сервера
      if (err.response && err.response.data && err.response.data.detail) {
        const serverErrors = {};
        
        if (Array.isArray(err.response.data.detail)) {
          err.response.data.detail.forEach(item => {
            const fieldName = item.loc[item.loc.length - 1];
            serverErrors[fieldName] = item.msg;
          });
        } else {
          serverErrors.general = err.response.data.detail;
        }
        
        setErrors(prevErrors => ({
          ...prevErrors,
          ...serverErrors
        }));
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          general: 'Произошла ошибка при сохранении. Пожалуйста, попробуйте еще раз.'
        }));
      }
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Отмена редактирования
  const handleCancel = () => {
    navigate('/vacancies');
  };
  
  if (loading) {
    return (
      <div className="vacancy-form-page">
        <DashboardHeader />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка данных вакансии...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="vacancy-form-page">
      <DashboardHeader />
      
      <div className="vacancy-form-container">
        <div className="vacancy-form-header">
          <h1>{isEditMode ? 'Редактирование вакансии' : 'Создание новой вакансии'}</h1>
        </div>
        
        {errors.general && (
          <div className="form-error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="vacancy-form">
          <div className="form-section">
            <h2>Основная информация</h2>
            
            <div className="form-group">
              <label htmlFor="title">Название вакансии *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'form-input error' : 'form-input'}
                placeholder="Например: Senior Frontend Developer"
              />
              {errors.title && <p className="error-text">{errors.title}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Описание вакансии *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'form-textarea error' : 'form-textarea'}
                placeholder="Подробное описание должностных обязанностей и условий работы"
                rows={6}
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>
            
            <div className="form-group form-checkbox">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className="checkbox-label">Вакансия активна</span>
              </label>
              <p className="form-hint">Неактивные вакансии не будут доступны для проведения интервью</p>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Требования к кандидатам</h2>
            
            <div className="form-group">
              <label>Навыки и технологии *</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  className={errors.skills ? 'form-input error' : 'form-input'}
                  placeholder="Например: JavaScript, React, Node.js"
                />
                <button 
                  type="button" 
                  className="tag-add-button"
                  onClick={handleAddSkill}
                >
                  Добавить
                </button>
              </div>
              {errors.skills && <p className="error-text">{errors.skills}</p>}
              
              <div className="tags-container">
                {formData.requirements.skills.map((skill, index) => (
                  <div key={index} className="tag">
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      className="tag-remove" 
                      onClick={() => handleRemoveSkill(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Требования к опыту работы *</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={experienceInput}
                  onChange={(e) => setExperienceInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExperience())}
                  className={errors.experience ? 'form-input error' : 'form-input'}
                  placeholder="Например: Опыт коммерческой разработки от 3 лет"
                />
                <button 
                  type="button" 
                  className="tag-add-button"
                  onClick={handleAddExperience}
                >
                  Добавить
                </button>
              </div>
              {errors.experience && <p className="error-text">{errors.experience}</p>}
              
              <div className="tags-container">
                {formData.requirements.experience.map((item, index) => (
                  <div key={index} className="tag">
                    <span>{item}</span>
                    <button 
                      type="button" 
                      className="tag-remove" 
                      onClick={() => handleRemoveExperience(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>Требования к образованию</label>
              <div className="tag-input-container">
                <input
                  type="text"
                  value={educationInput}
                  onChange={(e) => setEducationInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEducation())}
                  className="form-input"
                  placeholder="Например: Высшее техническое образование"
                />
                <button 
                  type="button" 
                  className="tag-add-button"
                  onClick={handleAddEducation}
                >
                  Добавить
                </button>
              </div>
              
              <div className="tags-container">
                {formData.requirements.education.map((item, index) => (
                  <div key={index} className="tag">
                    <span>{item}</span>
                    <button 
                      type="button" 
                      className="tag-remove" 
                      onClick={() => handleRemoveEducation(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Параметры интервью</h2>
            
            <div className="form-group">
              <label>Тип интервью</label>
              <div className="radio-group">
                <label className="radio-container">
                  <input
                    type="radio"
                    name="interview_type"
                    value="smart"
                    checked={formData.interview_type === 'smart'}
                    onChange={handleChange}
                  />
                  <span className="radio-label">Smart-интервью с AI</span>
                </label>
                <p className="form-hint">AI автоматически создаст вопросы на основе требований вакансии и проанализирует ответы</p>
                
                <label className="radio-container">
                  <input
                    type="radio"
                    name="interview_type"
                    value="manual"
                    checked={formData.interview_type === 'manual'}
                    onChange={handleChange}
                  />
                  <span className="radio-label">Ручное интервью</span>
                </label>
                <p className="form-hint">Вы сами составите вопросы для интервью</p>
              </div>
            </div>
            
            <div className="form-group">
              <label>Критерии оценки кандидатов</label>
              <p className="form-hint">Укажите вес каждого критерия в процентах (сумма должна быть 100%)</p>
              
              {errors.evaluation_criteria && (
                <p className="error-text">{errors.evaluation_criteria}</p>
              )}
              
              <div className="criteria-sliders">
                <div className="criteria-slider">
                  <div className="criteria-label">
                    <span>Технические навыки</span>
                    <span>{formData.evaluation_criteria.technical_skills}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    name="technical_skills"
                    value={formData.evaluation_criteria.technical_skills}
                    onChange={handleCriteriaChange}
                    className="slider"
                  />
                </div>
                
                <div className="criteria-slider">
                  <div className="criteria-label">
                    <span>Софт-скиллы</span>
                    <span>{formData.evaluation_criteria.soft_skills}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    name="soft_skills"
                    value={formData.evaluation_criteria.soft_skills}
                    onChange={handleCriteriaChange}
                    className="slider"
                  />
                </div>
                
                <div className="criteria-slider">
                  <div className="criteria-label">
                    <span>Опыт работы</span>
                    <span>{formData.evaluation_criteria.experience}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    name="experience"
                    value={formData.evaluation_criteria.experience}
                    onChange={handleCriteriaChange}
                    className="slider"
                  />
                </div>
                
                <div className="criteria-slider">
                  <div className="criteria-label">
                    <span>Культурное соответствие</span>
                    <span>{formData.evaluation_criteria.cultural_fit}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    name="cultural_fit"
                    value={formData.evaluation_criteria.cultural_fit}
                    onChange={handleCriteriaChange}
                    className="slider"
                  />
                </div>
                
                <div className="criteria-total">
                  <span>Сумма:</span>
                  <span className={
                    Object.values(formData.evaluation_criteria).reduce((sum, val) => sum + val, 0) === 100
                      ? 'total-valid'
                      : 'total-invalid'
                  }>
                    {Object.values(formData.evaluation_criteria).reduce((sum, val) => sum + val, 0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
              disabled={saveLoading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={saveLoading}
            >
              {saveLoading ? (
                <>
                  <span className="button-spinner"></span>
                  Сохранение...
                </>
              ) : (
                isEditMode ? 'Сохранить изменения' : 'Создать вакансию'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VacancyForm;
