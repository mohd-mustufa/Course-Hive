import React, { useState } from 'react';

const Accordion = ({ sections, title = "Course Content" }) => {
  const [openSections, setOpenSections] = useState(new Set([0])); // First section open by default

  const toggleSection = (index) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  const toggleAll = () => {
    if (openSections.size === sections.length) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(sections.map((_, index) => index)));
    }
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <p className="text-gray-400 text-center">No content sections available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button
          onClick={toggleAll}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          {openSections.size === sections.length ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Accordion Items */}
      <div className="divide-y divide-gray-700">
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-800">
            {/* Accordion Header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <span className="text-blue-400 font-medium">Section {index + 1}</span>
                <h4 className="text-white font-medium">{section.heading}</h4>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform cursor-pointer ${
                  openSections.has(index) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Accordion Content */}
            {openSections.has(index) && (
              <div className="px-6 pb-4">
                <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                  <MarkdownContent content={section.content} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Markdown Content Component
const MarkdownContent = ({ content }) => {
  if (!content) {
    return <p className="text-gray-400">No content available</p>;
  }

  // Simple markdown rendering for common elements
  const renderMarkdown = (text) => {
    if (!text) return '';

    // Headers
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>');

    // Bold and Italic
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Code blocks
    html = html
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 p-3 rounded-lg overflow-x-auto mb-3"><code class="text-green-400">$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-900 px-1 py-0.5 rounded text-green-400 text-sm">$1</code>');

    // Lists
    html = html
      .replace(/^\* (.*$)/gim, '<li class="text-gray-300 mb-1">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="text-gray-300 mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="text-gray-300 mb-1">$1</li>');

    // Wrap lists in ul/ol tags
    html = html.replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-3 space-y-1">$1</ul>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline cursor-pointer" target="_blank" rel="noopener noreferrer">$1</a>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // Paragraphs
    html = html.replace(/^(?!<[h|u|p|d|b|i|c|a])(.*)$/gm, '<p class="text-gray-300 mb-3">$1</p>');

    return html;
  };

  return (
    <div 
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default Accordion; 