import React from 'react';
import { useHelpStore } from '../../stores/helpStore';

interface HelpViewerProps {
  sectionId: string;
}

const HelpViewer: React.FC<HelpViewerProps> = ({ sectionId }) => {
  const { getSection } = useHelpStore();
  const section = getSection(sectionId);

  if (!section) {
    return (
      <div className="text-center py-12 text-gray-500">
        Sección no encontrada
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {section.title}
      </h1>

      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
};

export default HelpViewer;