import React, { useState } from 'react';
import '../assets/css/FileUpload.css';

const FileUpload = ({ type, onFileChange }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const fileTypes = type === 'resume' 
    ? 'Принимаются форматы .pdf, .docx' 
    : 'Загрузите описание вакансии (.pdf, .docx, .txt)';

  const placeholderText = type === 'resume' 
    ? 'Перетащите резюме сюда или нажмите для выбора файла' 
    : 'Перетащите описание вакансии сюда или нажмите для выбора файла';

  return (
    <div
      className={`upload-zone${isDragging ? ' drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="file-info">
          <span className="file-name">{file.name}</span>
        </div>
      ) : (
        <>
          <div className="upload-zone-icon">📎</div>
          <div className="upload-zone-text">{placeholderText}</div>
          <div className="file-types">{fileTypes}</div>
        </>
      )}
      <input 
        type="file" 
        accept={type === 'resume' ? '.pdf,.docx' : '.pdf,.docx,.txt'} 
        onChange={handleFileChange}
        className="file-input"
      />
      {file && (
        <button 
          className="change-file-btn"
          onClick={() => {
            setFile(null);
            onFileChange(null);
          }}
        >
          Изменить файл
        </button>
      )}
    </div>
  );
};

export default FileUpload;
