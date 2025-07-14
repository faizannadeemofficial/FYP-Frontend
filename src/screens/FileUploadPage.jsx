import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, X } from 'lucide-react';

const FileUploadPage = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedWords, setDetectedWords] = useState([]);
  const [maskCharacter, setMaskCharacter] = useState('🤐');
  const maxCharacters = 2000;

  const [customWordInput, setCustomWordInput] = useState('');
  const [customWords, setCustomWords] = useState([]);

  const [customMaskCharInput, setCustomMaskCharInput] = useState('');
  const [projectName, setProjectName] = useState('');
  const [imageSliderValue, setImageSliderValue] = useState(5);

  const customWordInputRef = useRef(null);

  const MAX_FILE_SIZE_MB = 100;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

  useEffect(() => {
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    tailwindScript.async = true;
    document.head.appendChild(tailwindScript);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(tailwindScript);
      document.head.removeChild(styleTag);
    };
  }, []);

  // New function to handle file selection and validation
  const handleFileChange = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
      setSelectedFile(null);
      setInputText('');
    } else if (
      file.type.startsWith('image/') ||
      file.type.startsWith('audio/') ||
      file.type.startsWith('video/') ||
      file.name.endsWith('.txt')
    ) {
      setSelectedFile(file);
      setInputText(file.name);
      setFileError('');
    } else {
      setFileError('Unsupported file type. Please upload an image, audio, video, or txt file.');
      setSelectedFile(null);
      setInputText('');
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setFileError('Please select a file to upload.');
      return;
    }

    setIsProcessing(true);
    try {
      let response, data;
      const authToken = localStorage.getItem('auth_token');
      if (selectedFile.type && selectedFile.type.startsWith('image/')) {
        // ...existing code...
        // Image Moderation
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('blur_radius', imageSliderValue.toString());
        formData.append('project_name', projectName || 'image_project_1');
        response = await fetch('http://localhost:5000/imgmoderation', {
          method: 'POST',
          headers: {
            'Authorization': authToken
          },
          body: formData
        });
        if (response.ok) {
          data = await response.json();
          navigate('/image-output', {
            state: {
              bluredImagePath: data.blured_image_path,
              harmfulDetected: data.harmful_detected,
              isFlagged: data.isFlagged,
              projectName: projectName || 'image_project_1',
              imageUrl: URL.createObjectURL(selectedFile),
              blurRadius: imageSliderValue,
              originalFileName: selectedFile.name
            }
          });
        } else {
          alert('Image moderation failed.');
        }
      } else if (selectedFile.type && selectedFile.type.startsWith('audio/')) {
        // ...existing code...
        // Audio Moderation
        const formData = new FormData();
        formData.append('audio', selectedFile);
        formData.append('mask_char', maskCharacter);
        customWords.forEach(word => formData.append('words', word));
        formData.append('project_name', projectName || 'audio_project_1');
        response = await fetch('http://localhost:5000/audiomoderation', {
          method: 'POST',
          headers: {
            'Authorization': authToken
          },
          body: formData
        });
        if (response.ok) {
          data = await response.json();
          navigate('/multimedia-output', {
            state: {
              outputPath: data.output_path,
              profanityData: data.profanity_data,
              projectName: projectName || 'audio_project_1',
              audioUrl: URL.createObjectURL(selectedFile)
            }
          });
        } else {
          alert('Audio moderation failed.');
        }
      } else if (selectedFile.type && selectedFile.type.startsWith('video/')) {
        // ...existing code...
        // Video Moderation
        const formData = new FormData();
        formData.append('video', selectedFile);
        formData.append('blur_radius', imageSliderValue.toString());
        formData.append('mask_char', maskCharacter);
        formData.append('project_name', projectName || 'video_project_1');
        response = await fetch('http://localhost:5000/videomoderation', {
          method: 'POST',
          headers: {
            'Authorization': authToken
          },
          body: formData
        });
        if (response.ok) {
          data = await response.json();
          navigate('/multimedia-output', {
            state: {
              moderatedVideoPath: data.moderated_video_path,
              imageDetections: data.image_detections,
              textModeratedData: data.text_moderated_data,
              projectName: projectName || 'video_project_1',
              videoUrl: URL.createObjectURL(selectedFile)
            }
          });
        } else {
          alert('Video moderation failed.');
        }
      } else if (selectedFile.name && selectedFile.name.endsWith('.txt')) {
        // TXT Moderation
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('mask_char', maskCharacter);
        customWords.forEach(word => formData.append('custom_words', word));
        formData.append('project_name', projectName || 'MyTextFileModerationProject');
        response = await fetch('http://localhost:5000/txtmoderation', {
          method: 'POST',
          headers: {
            'Authorization': authToken
          },
          body: formData
        });
        if (response.ok) {
          data = await response.json();
          navigate('/textfile-output', {
            state: {
              moderatedFilePath: data.moderated_file_path,
              report: data.report,
              projectName: projectName || 'MyTextFileModerationProject',
              originalFileName: selectedFile.name
            }
          });
        } else {
          alert('Text file moderation failed.');
        }
      } else {
        alert('Unsupported file type.');
      }
    } catch (err) {
      alert('Error connecting to moderation API.');
    }
    setIsProcessing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleAddCustomWord = () => {
    const word = customWordInput.trim();
    if (word && !customWords.includes(word.toLowerCase())) {
      setCustomWords([...customWords, word.toLowerCase()]);
      setCustomWordInput('');
      customWordInputRef.current.focus();
    }
  };

  const handleRemoveCustomWord = (wordToRemove) => {
    setCustomWords(customWords.filter(word => word !== wordToRemove));
  };

  const handleCustomWordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCustomWord();
    }
  };

  const handleCustomMaskCharChange = (e) => {
    const val = e.target.value;
    const chars = Array.from(val);
    setCustomMaskCharInput(chars[0] || '');
    if (chars[0]) {
      setMaskCharacter(chars[0]);
    } else {
      setMaskCharacter('🤐');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-950 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-white border-opacity-10">
        <div className="flex items-center gap-3 md:gap-4">
          <ArrowLeft
            size={24}
            className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => window.history.back()}
          />
          <h1 className="text-xl md:text-2xl font-medium m-0">
            Multimedia Moderation
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto w-full flex-grow">
        {/* Left Panel - File Input */}
        <div className="flex flex-col flex-1 gap-5">
          {/* Project Name Input */}
          <div className="bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg">
            <label htmlFor="projectName" className="block text-sm text-white text-opacity-70 mb-2">
              Project Name:
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full bg-white bg-opacity-10 rounded-lg px-3 py-2 text-white text-base outline-none border border-white border-opacity-20 focus:border-green-500 placeholder-white placeholder-opacity-40"
            />
          </div>

          <div
            className={`flex flex-col items-center justify-center bg-white bg-opacity-5 rounded-2xl border-2 border-dashed border-white border-opacity-20 p-10 backdrop-blur-md shadow-lg transition-all duration-200 ${isDragActive ? 'border-green-400 bg-opacity-10' : ''}`}
            style={{ minHeight: '320px' }}
            onDragOver={e => {
              e.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={e => {
              e.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={e => {
              e.preventDefault();
              setIsDragActive(false);
              handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            <div className="flex flex-col items-center justify-center w-full">
              <svg width="48" height="48" fill="none" stroke="#b0b0b0" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V6M12 6l-5 5M12 6l5 5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="19" width="18" height="2" rx="1" fill="#b0b0b0"/></svg>
              <p className="mt-4 text-white text-opacity-70 text-lg">Drop a file here or <label htmlFor="file-upload" className="underline cursor-pointer" tabIndex={0} role="button">choose file</label></p>
              <input
                id="file-upload"
                type="file"
                accept="image/*,audio/*,video/*"
                style={{ display: 'none' }}
                onChange={e => handleFileChange(e.target.files[0])}
              />
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isProcessing}
                className={`mt-8 px-8 py-2 rounded-full flex items-center justify-center transition-all duration-300 text-white text-lg font-medium bg-green-900 bg-opacity-30 hover:bg-opacity-50 ${(!selectedFile || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <span className="mr-2" style={{ display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 50 50" style={{ marginRight: 8 }}>
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" opacity="0.2" />
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="31.4 31.4" strokeDashoffset="0" style={{ animation: 'spin 1s linear infinite' }} />
                      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Send size={20} className="mr-2" /> Submit
                  </>
                )}
              </button>
              {selectedFile && (
                <span className="mt-4 text-sm text-white text-opacity-60">Selected: {selectedFile.name}</span>
              )}
              {fileError && (
                <span className="mt-4 text-sm text-red-400 text-opacity-80">{fileError}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Custom Words & Moderation Results */}
        <div className="w-full md:w-96 flex flex-col gap-5">
          {/* Image Quality Slider (only for images) */}
          {selectedFile && selectedFile.type.startsWith('image/') && (
            <div className="bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg flex flex-col items-center mb-2">
              <label htmlFor="image-quality-slider" className="block text-base text-white text-opacity-80 mb-2">
                Select value for image blur
              </label>
              <input
                id="image-quality-slider"
                type="range"
                min={1}
                max={10}
                value={imageSliderValue}
                onChange={e => setImageSliderValue(Number(e.target.value))}
                className="w-4/5 accent-green-500 mb-2"
              />
              <span className="text-lg font-semibold text-green-400">{imageSliderValue}</span>
            </div>
          )}
          {/* Mask Character Selector */}
          <div className={`bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg ${selectedFile && selectedFile.type.startsWith('image/') ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{maskCharacter}</div>
              <h3 className="text-lg font-medium m-0">Mask Character</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['🤐', '*', '#', '@', '•'].map((char) => (
                <button
                  key={char}
                  onClick={() => {
                    setMaskCharacter(char);
                    setCustomMaskCharInput('');
                  }}
                  className={`
                    rounded-lg px-3 py-2 text-white text-base cursor-pointer transition-all duration-200
                    ${maskCharacter === char && customMaskCharInput === '' ? 'bg-green-700 bg-opacity-30 border-2 border-green-600' : 'bg-white bg-opacity-10 border border-white border-opacity-20 hover:bg-opacity-20'}
                  `}
                  disabled={selectedFile && selectedFile.type.startsWith('image/')}
                >
                  {char}
                </button>
              ))}
            </div>
            {/* Custom Mask Character Input */}
            <div>
              <label htmlFor="customMask" className="block text-sm text-white text-opacity-70 mb-2">
                Or enter a custom character:
              </label>
              <input
                id="customMask"
                type="text"
                inputMode="text"
                maxLength={2}
                value={customMaskCharInput}
                onChange={e => handleCustomMaskCharChange(e)}
                placeholder="e.g., 🤐"
                className={`w-full bg-white bg-opacity-10 rounded-lg px-3 py-2 text-white text-base outline-none border placeholder-white placeholder-opacity-40 ${customMaskCharInput ? 'border-green-500' : 'border-white border-opacity-20 focus:border-green-500'}`}
                style={{ fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif', fontSize: 18, height: 48, borderWidth: 2, transition: 'border-color 0.2s' }}
              />
            </div>
          </div>

          {/* Custom Words Input & Display */}
          <div className={`bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg ${selectedFile && selectedFile.type.startsWith('image/') ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-lg font-medium m-0 mb-4">Custom Words (for moderation)</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                ref={customWordInputRef}
                type="text"
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                onKeyPress={handleCustomWordKeyPress}
                placeholder="Add a word..."
                className="w-full md:flex-1 bg-white bg-opacity-10 rounded-lg px-3 py-2 text-white text-base outline-none border border-white border-opacity-20 focus:border-green-500 placeholder-white placeholder-opacity-40"
                disabled={selectedFile && selectedFile.type.startsWith('image/')}
              />
              <button
                onClick={handleAddCustomWord}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg px-4 py-2 text-white text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!customWordInput.trim() || (selectedFile && selectedFile.type.startsWith('image/'))}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {customWords.length === 0 ? (
                <p className="text-white text-opacity-60 text-sm italic">
                  No custom words added yet.
                </p>
              ) : (
                customWords.map((word, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-30 rounded-full pl-3 pr-1 py-1 text-sm text-blue-300"
                  >
                    {word}
                    <button
                      onClick={() => handleRemoveCustomWord(word)}
                      className="ml-1 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                      disabled={selectedFile && selectedFile.type.startsWith('image/')}
                    >
                      <X size={14} className="text-blue-300" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default FileUploadPage;