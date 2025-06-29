import React, { useState, useEffect } from 'react';
import { BASE_URL, GENERATE_AI_CONTENT_URL } from '../../utils/constants';

const AIContentGenerator = ({ 
  sectionHeading, 
  courseTitle,
  courseContext, 
  onContentGenerated, 
  onClose,
  isOpen 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('auto'); // 'auto' or 'custom'

  // Auto-select custom mode if section heading or course title is empty
  useEffect(() => {
    if (!sectionHeading.trim() || !courseTitle.trim()) {
      setMode('custom');
    }
  }, [sectionHeading, courseTitle]);

  const handleGenerateContent = async () => {
    if (mode === 'custom' && !prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (mode === 'auto' && (!sectionHeading.trim() || !courseTitle.trim())) {
      setError('Please enter both course title and section heading for auto generation');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedContent('');

    try {
      const admin = JSON.parse(localStorage.getItem('admin'));
      const requestBody = mode === 'auto' 
        ? { sectionHeading, courseTitle, courseContext }
        : { prompt };

      const response = await fetch(`${BASE_URL}${GENERATE_AI_CONTENT_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${admin?.token}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
      } else {
        setError(data.error || 'Failed to generate content');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseContent = () => {
    if (onContentGenerated) {
      onContentGenerated(generatedContent);
    }
    handleClose();
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedContent('');
    setError('');
    setMode('auto');
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">AI Content Generator</h2>
              <p className="text-blue-100 mt-1">Generate engaging course content with AI</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Mode Selection */}
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setMode('auto')}
                disabled={!sectionHeading.trim() || !courseTitle.trim()}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === 'auto'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 cursor-pointer'
                    : !sectionHeading.trim() || !courseTitle.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Auto Generate</span>
                </div>
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                  mode === 'custom'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Custom Prompt</span>
                </div>
              </button>
            </div>

            {mode === 'auto' && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2">Auto Generation</h3>
                <p className="text-blue-200 text-sm">
                  AI will automatically generate content based on:
                </p>
                <ul className="text-blue-200 text-sm mt-2 space-y-1">
                  <li>• Section heading: <span className="font-medium">"{sectionHeading}"</span></li>
                  <li>• Course title: <span className="font-medium">"{courseTitle}"</span></li>
                  {courseContext && (
                    <li>• Course context will be included for better relevance</li>
                  )}
                </ul>
              </div>
            )}

            {mode === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your custom prompt for content generation..."
                    className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-white placeholder-gray-400"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={handleGenerateContent}
              disabled={isGenerating || (mode === 'custom' && !prompt.trim()) || (mode === 'auto' && (!sectionHeading.trim() || !courseTitle.trim()))}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                isGenerating || (mode === 'custom' && !prompt.trim()) || (mode === 'auto' && (!sectionHeading.trim() || !courseTitle.trim()))
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-600 transform hover:scale-[1.02]'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating Content...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 cursor-pointer">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate Content</span>
                </div>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-300 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Generated Content</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setGeneratedContent('')}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleUseContent}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-medium"
                  >
                    Use This Content
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-200 font-sans leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator; 