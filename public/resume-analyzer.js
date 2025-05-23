// resume-analyzer.js - Интерактивная демонстрация анализа резюме

document.addEventListener('DOMContentLoaded', () => {
    // DOM элементы
    const resumeUploadArea = document.getElementById('resume-upload-area');
    const resumeFileInput = document.getElementById('resume-file');
    const vacancyUploadArea = document.getElementById('vacancy-upload-area');
    const vacancyFileInput = document.getElementById('vacancy-file');
    const analyzeButton = document.getElementById('analyze-button');
    const progressBar = document.getElementById('progress-bar');
    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressBarText = document.getElementById('progress-bar-text');
    const resultPanel = document.getElementById('result-panel');
    const errorPanel = document.getElementById('error-panel');
    const retryButton = document.getElementById('retry-button');

    // Сброс drag&drop зоны
    function resetDropArea(area, fileInput, label, icon = '📄') {
        area.innerHTML = `
            <div class="upload-icon">${icon}</div>
            <h3 class="upload-text">${label}</h3>
            <p>Поддерживаемые форматы: PDF, DOCX</p>
            <button class="button" id="upload-btn-${fileInput.id}">Выбрать файл</button>
            <input type="file" id="${fileInput.id}" class="file-input" accept=".pdf,.docx,.doc">
        `;
        // Получить новый fileInput после innerHTML
        const newInput = area.querySelector('input[type=file]');
        document.getElementById(`upload-btn-${fileInput.id}`).addEventListener('click', () => newInput.click());
        newInput.addEventListener('change', () => handleFileSelect(area, newInput, label, icon));
    }

    // Универсальный обработчик выбора файла
    function handleFileSelect(area, fileInput, label, icon = '📄') {
        if (fileInput.files.length) {
            const fileName = fileInput.files[0].name;
            area.innerHTML = `
                <div class="upload-icon">${icon}</div>
                <h3 class="upload-text">Файл выбран</h3>
                <p>${fileName}</p>
                <button class="button button-outline" id="change-file-${fileInput.id}">Изменить</button>
            `;
            document.getElementById(`change-file-${fileInput.id}`).addEventListener('click', e => {
                e.preventDefault();
                resetDropArea(area, fileInput, label, icon);
                // После сброса клик по новому fileInput
                setTimeout(() => {
                    const newInput = area.querySelector('input[type=file]');
                    newInput.click();
                }, 0);
            });
        }
        updateAnalyzeButtonState();
    }

    // Проверка состояния для активации кнопки анализа
    function updateAnalyzeButtonState() {
        const isResumeLoaded = resumeUploadArea.querySelector('input[type=file]').files.length > 0;
        const isVacancyLoaded = vacancyUploadArea.querySelector('input[type=file]').files.length > 0;
        analyzeButton.disabled = !(isResumeLoaded && isVacancyLoaded);
    }

    // Drag&Drop обработчики для резюме
    resumeUploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        resumeUploadArea.classList.add('dragover');
    });
    resumeUploadArea.addEventListener('dragleave', () => resumeUploadArea.classList.remove('dragover'));
    resumeUploadArea.addEventListener('drop', e => {
        e.preventDefault();
        resumeUploadArea.classList.remove('dragover');
        const fileInput = resumeUploadArea.querySelector('input[type=file]');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(resumeUploadArea, fileInput, 'Перетащите файл резюме или нажмите для выбора');
        }
    });
    resumeUploadArea.querySelector('input[type=file]').addEventListener('change', function() {
        handleFileSelect(resumeUploadArea, this, 'Перетащите файл резюме или нажмите для выбора');
    });

    // Drag&Drop обработчики для вакансии
    vacancyUploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        vacancyUploadArea.classList.add('dragover');
    });
    vacancyUploadArea.addEventListener('dragleave', () => vacancyUploadArea.classList.remove('dragover'));
    vacancyUploadArea.addEventListener('drop', e => {
        e.preventDefault();
        vacancyUploadArea.classList.remove('dragover');
        const fileInput = vacancyUploadArea.querySelector('input[type=file]');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(vacancyUploadArea, fileInput, 'Перетащите файл вакансии или нажмите для выбора');
        }
    });
    vacancyUploadArea.querySelector('input[type=file]').addEventListener('change', function() {
        handleFileSelect(vacancyUploadArea, this, 'Перетащите файл вакансии или нажмите для выбора');
    });

    // Анализ резюме и вакансии
    analyzeButton.addEventListener('click', async () => {
        analyzeButton.disabled = true;
        progressBar.classList.remove('hidden');
        progressBarInner.style.width = '10%';
        progressBarText.textContent = 'Отправляем данные...';
        resultPanel.classList.add('hidden');
        errorPanel.classList.add('hidden');

        // Получаем актуальные fileInput
        const resumeInput = resumeUploadArea.querySelector('input[type=file]');
        const vacancyInput = vacancyUploadArea.querySelector('input[type=file]');
        const formData = new FormData();
        if (resumeInput.files.length) {
            formData.append('resume_file', resumeInput.files[0]);
        } else {
            alert('Пожалуйста, загрузите файл резюме');
            return;
        }
        if (vacancyInput.files.length) {
            formData.append('job_description_file', vacancyInput.files[0]);
        } else {
            alert('Пожалуйста, загрузите файл вакансии/проекта');
            return;
        }

        try {
            progressBarInner.style.width = '35%';
            progressBarText.textContent = 'Анализируем...';
            const response = await fetch('/api/compare', {
                method: 'POST',
                body: formData
            });
            progressBarInner.style.width = '70%';
            if (!response.ok) {
                throw new Error('Ошибка анализа: ' + response.statusText);
            }
            const data = await response.json();
            progressBarInner.style.width = '100%';
            progressBarText.textContent = 'Готово!';
            showResult(data.results);
        } catch (error) {
            progressBar.classList.add('hidden');
            errorPanel.classList.remove('hidden');
            document.getElementById('error-message').textContent = error.message || 'Ошибка анализа. Попробуйте позже.';
        } finally {
            setTimeout(() => {
                progressBar.classList.add('hidden');
                progressBarInner.style.width = '0%';
                progressBarText.textContent = '';
                analyzeButton.disabled = false;
            }, 1200);
        }
    });

    // Обработка ошибок и сброс состояния
    retryButton.addEventListener('click', () => {
        errorPanel.classList.add('hidden');
        analyzeButton.disabled = false;
        progressBar.classList.add('hidden');
        progressBarInner.style.width = '0%';
        progressBarText.textContent = '';
    });

    // Инициализация drag&drop зон
    resetDropArea(resumeUploadArea, resumeFileInput, 'Перетащите файл резюме или нажмите для выбора');
    resetDropArea(vacancyUploadArea, vacancyFileInput, 'Перетащите файл вакансии или нажмите для выбора');
    updateAnalyzeButtonState();

    // Вспомогательная функция для отображения результата анализа
    function showResult(results) {
        // TODO: реализовать красивую отрисовку результата анализа (скоринг, навыки, рекомендации)
        resultPanel.classList.remove('hidden');
        resultPanel.innerHTML = `<pre style="text-align:left;background:#f3f4f6;padding:1rem;border-radius:8px;">${JSON.stringify(results, null, 2)}</pre>`;
    }
});
    // DOM элементы
    const uploadArea = document.getElementById('upload-area');
    const resumeFileInput = document.getElementById('resume-file');
    const uploadButton = document.getElementById('upload-button');
    const analyzeButton = document.getElementById('analyze-button');
    const progressBar = document.getElementById('progress-bar');
    const progressBarInner = document.getElementById('progress-bar-inner');
    const progressBarText = document.getElementById('progress-bar-text');
    const loadingPanel = document.getElementById('loading-panel');
    const resultPanel = document.getElementById('result-panel');
    const errorPanel = document.getElementById('error-panel');
    const retryButton = document.getElementById('retry-button');
    const detailButton = document.getElementById('detail-button');
    const interviewButton = document.getElementById('interview-button');
    // Drag&Drop зоны
    vacancyUploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        vacancyUploadArea.classList.add('dragover');
    });
    vacancyUploadArea.addEventListener('dragleave', () => vacancyUploadArea.classList.remove('dragover'));
    vacancyUploadArea.addEventListener('drop', e => {
        e.preventDefault();
        vacancyUploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            vacancyFileInput.files = e.dataTransfer.files;
            handleFileSelect(vacancyUploadArea, vacancyFileInput, 'Перетащите файл вакансии или нажмите для выбора');
        }
    });
    vacancyFileInput.addEventListener('change', () => handleFileSelect(vacancyUploadArea, vacancyFileInput, 'Перетащите файл вакансии или нажмите для выбора'));

    // Проверка состояния для активации кнопки анализа
    function updateAnalyzeButtonState() {
        const isResumeLoaded = resumeFileInput.files.length > 0;
        const isVacancyLoaded = vacancyFileInput.files.length > 0;
        analyzeButton.disabled = !(isResumeLoaded && isVacancyLoaded);
    }
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            resumeFileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    
    // Универсальный обработчик выбора файла
    function handleFileSelect(area, fileInput, label, icon = '📄') {
        if (fileInput.files.length) {
            const fileName = fileInput.files[0].name;
            area.innerHTML = `
                <div class="upload-icon">${icon}</div>
                <h3 class="upload-text">Файл выбран</h3>
                <p>${fileName}</p>
                <button class="button button-outline" id="change-file-${fileInput.id}">Изменить</button>
            `;
            document.getElementById(`change-file-${fileInput.id}`).addEventListener('click', e => {
                e.preventDefault();
                resetDropArea(area, fileInput, label, icon);
                fileInput.click();
            });
        }
        updateAnalyzeButtonState();
    }
    
    // Сброс формы загрузки
    function resetUploadArea() {
        uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <h3 class="upload-text">Перетащите файл резюме или нажмите для выбора</h3>
            <button class="button" id="upload-button">Выбрать файл</button>
        `;
        
        resumeFileInput.value = '';
        analyzeButton.disabled = true;
        
        resultPanel.classList.add('hidden');
        errorPanel.classList.add('hidden');

        // Формируем данные для отправки
        const formData = new FormData();
        if (resumeFileInput.files.length) {
            formData.append('resume_file', resumeFileInput.files[0]);
        } else {
            alert('Пожалуйста, загрузите файл резюме');
            return;
        }
        if (vacancyFileInput.files.length) {
            formData.append('job_description_file', vacancyFileInput.files[0]);
        } else {
            alert('Пожалуйста, загрузите файл вакансии/проекта');
            return;
        }

        try {
            progressBarInner.style.width = '35%';
            progressBarText.textContent = 'Анализируем...';
            const response = await fetch('/api/compare', {
                method: 'POST',
                body: formData
            });
            progressBarInner.style.width = '70%';
            if (!response.ok) {
                throw new Error('Ошибка анализа: ' + response.statusText);
            }
            const data = await response.json();
            progressBarInner.style.width = '100%';
            progressBarText.textContent = 'Готово!';
            showResult(data.results);
        } catch (error) {
            progressBar.classList.add('hidden');
            errorPanel.classList.remove('hidden');
            document.getElementById('error-message').textContent = error.message || 'Ошибка анализа. Попробуйте позже.';
        } finally {
            skillItem.innerHTML = `
                <div class="skill-name">${skill}</div>
                <div class="skill-bar-container">
                    <div class="skill-bar" style="width: ${percentage}%;"></div>
                </div>
                <div class="skill-score">${score}/10</div>
            `;
            
            skillsList.appendChild(skillItem);
        });
    }
    
    // Кнопка "Попробовать снова"
    retryButton.addEventListener('click', () => {
        errorPanel.classList.add('hidden');
        analyzeButton.disabled = false;
    });
    
    // Кнопка "Полный отчет"
    detailButton.addEventListener('click', () => {
        alert('Здесь будет показан подробный отчет в формате PDF');
    });
    
    // Кнопка "Создать интервью"
    interviewButton.addEventListener('click', () => {
        alert('Переход к созданию интервью на основе результатов анализа');
    });
    
    // Слушатели для полей ввода (обновление данных при изменениях)
    positionInput.addEventListener('input', updatePositionInResults);
    skillsInput.addEventListener('input', () => {
        if (resultPanel.classList.contains('hidden')) return;
        updateSkillsFromInput();
    });
    
    // Обновление должности в результатах
    function updatePositionInResults() {
        const resultTitle = document.querySelector('.result-title');
        if (positionInput.value.trim()) {
            resultTitle.textContent = `Анализ резюме: ${positionInput.value}`;
        } else {
            resultTitle.textContent = 'Результаты анализа';
        }
    }
    
    // Анимированное появление шкалы навыков
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-in-out';
                bar.style.width = targetWidth;
            }, 100);
        });
    }
    
    // Генерация рекомендаций на основе введенных требований
    function generateRecommendations() {
        const recommendationsContainer = document.querySelector('.recommendations');
        recommendationsContainer.innerHTML = '';
        
        // Извлекаем ключевые слова из требований
        const requirements = requirementsInput.value.toLowerCase();
        const skills = skillsInput.value.toLowerCase().split(',').map(s => s.trim());
        
        // Позитивные рекомендации
        addRecommendation('positive', 'Сильный технический бэкграунд в требуемых технологиях');
        addRecommendation('positive', 'Опыт работы более 3 лет в аналогичной позиции');
        
        // Нейтральные рекомендации
        if (!requirements.includes('международн')) {
            addRecommendation('neutral', 'Нет упоминания опыта в международных проектах');
        }
        
        // Отрицательные рекомендации
        if (skills.includes('graphql') && !requirements.includes('graphql')) {
            addRecommendation('negative', 'Отсутствует опыт работы с GraphQL');
        }
        
        if (skills.includes('typescript') && !requirements.includes('typescript')) {
            addRecommendation('negative', 'Недостаточный опыт TypeScript');
        }
    }
    
    // Добавление рекомендации определенного типа
    function addRecommendation(type, text) {
        const recommendationsContainer = document.querySelector('.recommendations');
        
        const recommendation = document.createElement('div');
        recommendation.className = `recommendation ${type}`;
        
        const icon = type === 'positive' ? '✓' : type === 'neutral' ? '⚠' : '✗';
        
        recommendation.innerHTML = `
            <div class="rec-icon">${icon}</div>
            <div>${text}</div>
        `;
        
        recommendationsContainer.appendChild(recommendation);
    }
    
    // Обновление счетчика соответствия вакансии на основе навыков
    function updateMatchScore() {
        const scoreBadge = document.querySelector('.score-badge');
        const reqSkills = skillsInput.value.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
        
        // Имитация расчета соответствия (в реальном приложении это будет делать AI)
        const matchPercentage = Math.floor(Math.random() * 30) + 70; // 70-99%
        scoreBadge.textContent = `${matchPercentage}%`;
        
        // Изменяем цвет в зависимости от процента
        if (matchPercentage >= 90) {
            scoreBadge.style.background = 'linear-gradient(135deg, #34d399, #059669)';
        } else if (matchPercentage >= 80) {
            scoreBadge.style.background = 'linear-gradient(135deg, #4361ee, #3a0ca3)';
        } else if (matchPercentage >= 70) {
            scoreBadge.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
        } else {
            scoreBadge.style.background = 'linear-gradient(135deg, #f87171, #dc2626)';
        }
    }
    
    // Инициализация drag&drop зон
    resetDropArea(resumeUploadArea, resumeFileInput, 'Перетащите файл резюме или нажмите для выбора');
    resetDropArea(vacancyUploadArea, vacancyFileInput, 'Перетащите файл вакансии или нажмите для выбора');
    updateAnalyzeButtonState();

    // Вспомогательная функция для отображения результата анализа
    function showResult(results) {
        // TODO: реализовать красивую отрисовку результата анализа (скоринг, навыки, рекомендации)
        resultPanel.classList.remove('hidden');
        resultPanel.innerHTML = `<pre style="text-align:left;background:#f3f4f6;padding:1rem;border-radius:8px;">${JSON.stringify(results, null, 2)}</pre>`;
    }

    // Обработка ошибок и сброс состояния
    retryButton.addEventListener('click', () => {
        errorPanel.classList.add('hidden');
        analyzeButton.disabled = false;
        progressBar.classList.add('hidden');
        progressBarInner.style.width = '0%';
        progressBarText.textContent = '';
    });
});
