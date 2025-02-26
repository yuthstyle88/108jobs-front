
import React from 'react';

interface StepOneProps {
  formData: {
    sourceTypes: string[];
  };
  updateFormData: (data: { sourceTypes: string[] }) => void;
  nextStep: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ formData, updateFormData, nextStep }) => {
  const sources = [
    { id: 'google', name: 'Google', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032 s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2 C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
      </svg>
    ) },
    { id: 'instagram', name: 'Instagram', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.148-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ) },
    { id: 'tiktok', name: 'TikTok', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ) },
    { id: 'facebook', name: 'Facebook', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      </svg>
    ) },
    { id: 'twitter', name: 'X (Twitter)', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.543 7.104c.015.21.015.419.015.628 0 6.389-4.917 13.76-13.906 13.76-2.767 0-5.336-.803-7.5-2.18.391.045.782.06 1.188.06 2.316 0 4.447-.794 6.15-2.146-2.171-.045-4.001-1.479-4.632-3.445.3.045.601.075.917.075.435 0 .87-.06 1.274-.165-2.262-.465-3.954-2.444-3.954-4.829v-.06c.661.374 1.427.6 2.234.63-1.328-.886-2.201-2.402-2.201-4.113 0-.916.246-1.758.681-2.48 2.472 3.048 6.196 5.052 10.365 5.262-.075-.374-.12-.763-.12-1.153 0-2.777 2.262-5.03 5.056-5.03 1.454 0 2.767.615 3.688 1.598C18.83 4.223 19.8 3.874 20.7 3.374c-.391 1.203-1.214 2.207-2.292 2.853.959-.105 1.889-.39 2.738-.75-.645.945-1.453 1.784-2.395 2.453l.792-.826z" />
      </svg>
    ) },
    { id: 'linkedin', name: 'LinkedIn', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ) },
    { id: 'ck', name: 'CK', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.5 8c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm-3.499 4.501c-2.144 0-3.729 1.138-4.5 2.499h9c-.771-1.361-2.356-2.499-4.5-2.499z" />
      </svg>
    ) },
    { id: 'friend', name: 'มีคนแนะนำ', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" />
      </svg>
    ) },
  ];

  const toggleSource = (sourceId: string) => {
    if (formData.sourceTypes.includes(sourceId)) {
      updateFormData({
        sourceTypes: formData.sourceTypes.filter(id => id !== sourceId)
      });
    } else {
      updateFormData({
        sourceTypes: [...formData.sourceTypes, sourceId]
      });
    }
  };
  
  const isSelected = (sourceId: string) => formData.sourceTypes.includes(sourceId);
  
  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text_primary">ก่อนเริ่ม, บอกหน่อยคุณรู้จักเราจากที่ไหน? 😊</h2>
        <p className="text-text_secondary mt-2">สามารถเลือกได้หลายข้อ</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {sources.map((source) => (
          <div 
            key={source.id}
            onClick={() => toggleSource(source.id)} 
            className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
              isSelected(source.id) 
                ? 'bg-third text-white' 
                : 'bg-gray-100 text-text_primary hover:bg-gray-200'
            }`}
          >
            <div className="mb-3">{source.icon}</div>
            <span className="text-sm">{source.name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button 
          className="text-gray-400 px-6 py-2 rounded-lg"
          disabled
        >
          ข้าม
        </button>
        <button 
          onClick={nextStep}
          disabled={formData.sourceTypes.length === 0}
          className={`px-6 py-2 rounded-lg flex items-center ${
            formData.sourceTypes.length === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-third text-white'
          }`}
        >
          บันทึก และไปต่อ
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StepOne;
