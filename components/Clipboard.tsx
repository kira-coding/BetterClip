// src/components/ClipboardContent.jsx
import React from 'react';
import { FaFileAlt, FaImage, FaRegClipboard } from 'react-icons/fa'; // Example icons
import { CiTextAlignLeft } from "react-icons/ci";

const ClipboardContent = ({ content, type }) => {
  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <FaImage className="text-gray-400 text-6xl mb-4" />
            <img src={content} alt="Clipboard Image" className="max-w-full h-auto rounded-md shadow-md" />
            <p className="text-sm text-gray-500 mt-2">Image preview</p>
          </div>
        );
      case 'text':
        return (
          <div className="p-4">
            <FaRegClipboard className="text-gray-400 text-6xl mb-4 mx-auto" />
            <p className="text-gray-800 break-words whitespace-pre-wrap">{content}</p>
          </div>
        );
      case 'file':
        // For a file, 'content' could be an object with name, size, type, and a URL if you have one.
        // For simplicity, let's just show the file name and a generic icon.
        const fileName = content.value || 'Unknown File';
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <FaFileAlt className="text-gray-400 text-6xl mb-4" />
            <p className="text-gray-800 font-medium text-center">{fileName}</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 text-gray-500">
            <FaRegClipboard className="text-gray-400 text-6xl mb-4" />
            <p>No content on clipboard yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[150px] flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default ClipboardContent;