import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Button } from '../../../components/common/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import '../styles/pestDetection.css';

export const ImageUploader = ({ onAnalyze, loading }) => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !loading) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      onAnalyze(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="uploader-card">
      <div className="upload-dropzone" onClick={() => document.getElementById('pest-file-input').click()}>
        <input
          type="file"
          id="pest-file-input"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Crop Preview" className="image-preview" />
            <span className="file-name">{selectedFile?.name}</span>
          </div>
        ) : (
          <div className="dropzone-content">
            <UploadCloud size={48} className="upload-icon" />
            <p>{t('pest.uploadPrompt')}</p>
            <span className="file-hint">Supports JPEG, PNG, WEBP (Max 5MB)</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="medium"
        disabled={!selectedFile}
        loading={loading}
        className="full-btn"
      >
        <Sparkles size={18} /> {t('pest.analyzeBtn')}
      </Button>
    </form>
  );
};
