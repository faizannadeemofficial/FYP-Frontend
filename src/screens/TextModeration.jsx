import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, X } from 'lucide-react';

const TextModeration = () => {
  const navigate = useNavigate();
  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedWords, setDetectedWords] = useState([]);
  const [maskCharacter, setMaskCharacter] = useState('🤐');
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 2000;
  const emojis = ['🤐', '*', '#', '@', '•']; // Mask characters

  const [customWordInput, setCustomWordInput] = useState('');
  const [customWords, setCustomWords] = useState([]);

  const [customMaskCharInput, setCustomMaskCharInput] = useState('');
  const [projectName, setProjectName] = useState(''); // New state for project name

  const customWordInputRef = useRef(null);

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

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setInputText(text);
      setCharacterCount(text.length);
    }
  };

  const processText = () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setDetectedWords([]);

    const wordsToModerate = customWords.map(word => word.toLowerCase());

    setTimeout(() => {
      const wordsInInput = inputText.toLowerCase().split(/\s+/);
      const found = wordsInInput.filter(wordInInput =>
        wordsToModerate.some(moderateWord => wordInInput.includes(moderateWord))
      );

      setDetectedWords([...new Set(found)]);
      setIsProcessing(false);
    }, 1000);
  };


  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/textmoderation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? token : ''
        },
        body: JSON.stringify({
          project_name: projectName || 'untitled_project01',
          sentence: inputText,
          mask_character: maskCharacter,
          custom_words: customWords
        })
      });
      if (response.status === 200) {
        const data = await response.json();
        // Calculate stats
        const totalWords = data.length;
        const profaneWords = data.filter(w => w.IsProfane).length;
        navigate('/text-output', {
          state: {
            totalWords,
            profaneWords,
            moderationData: data,
            projectName: projectName || 'untitled_project01'
          }
        });
      } else {
        alert('Moderation failed.');
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

  const applyMask = () => {
    if (inputText && detectedWords.length > 0) {
      let cleanText = inputText;
      detectedWords.forEach(word => {
        const regex = new RegExp(word, 'gi');
        cleanText = cleanText.replace(regex, maskCharacter.repeat(word.length));
      });
      setInputText(cleanText);
      setDetectedWords([]);
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
    const char = e.target.value;
    setCustomMaskCharInput(char.slice(0, 1));
    if (char.length > 0) {
      setMaskCharacter(char.slice(0, 1));
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
            Text Moderation
          </h1>
        </div>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-700 to-green-600 flex items-center justify-center text-lg">
          👤
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto w-full flex-grow">
        {/* Left Panel - Text Input */}
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

          <div className="bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 flex flex-col backdrop-blur-md shadow-lg">
            <textarea
              value={inputText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter text here..."
              className="bg-transparent border-none outline-none text-white text-base leading-relaxed resize-none font-inherit placeholder-white placeholder-opacity-40 h-64 md:h-80"
            />

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-white border-opacity-10">
              <span className="text-sm text-white text-opacity-60 mb-3 sm:mb-0">
                {characterCount}/{maxCharacters} characters
              </span>

              <button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isProcessing}
                className={`
                  rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300
                  ${isProcessing ? 'bg-green-700 bg-opacity-50 cursor-not-allowed' : 'bg-gradient-to-br from-green-600 to-emerald-700 cursor-pointer hover:scale-105 hover:shadow-xl'}
                  ${!inputText.trim() && 'opacity-50 cursor-not-allowed'}
                `}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={20} color="white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Custom Words & Moderation Results */}
        <div className="w-full md:w-96 flex flex-col gap-5">
          {/* Mask Character Selector */}
          <div className="bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{maskCharacter}</div>
              <h3 className="text-lg font-medium m-0">Mask Character</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {emojis.map((char) => (
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
                maxLength={2} // allow for emoji (which can be 2 code units)
                value={customMaskCharInput}
                onChange={e => {
                  // Accept only a single grapheme (emoji or char)
                  const val = e.target.value;
                  // Use Array.from to handle emoji/unicode properly
                  const chars = Array.from(val);
                  setCustomMaskCharInput(chars[0] || '');
                  setMaskCharacter(chars[0] || '🤐');
                }}
                placeholder="e.g., 🤐"
                className={`w-full bg-white bg-opacity-10 rounded-lg px-3 py-2 text-white text-base outline-none border placeholder-white placeholder-opacity-40 ${customMaskCharInput ? 'border-green-500' : 'border-white border-opacity-20 focus:border-green-500'}`}
                style={{ fontFamily: 'Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif', fontSize: 24, height: 48, borderWidth: 2, transition: 'border-color 0.2s' }}
              />
            </div>
          </div>

          {/* Custom Words Input & Display */}
          <div className="bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 p-5 backdrop-blur-md shadow-lg">
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
              />
              <button
                onClick={handleAddCustomWord}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg px-4 py-2 text-white text-sm cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!customWordInput.trim()}
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

export default TextModeration;
