import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useHelpStore } from '../../stores/helpStore';
import type { HelpSection } from '../../types/help';
import RichTextEditor from './RichTextEditor';

interface HelpEditorProps {
  section?: HelpSection;
  onClose: () => void;
}

const HelpEditor: React.FC<HelpEditorProps> = ({ section, onClose }) => {
  const { addSection, updateSection } = useHelpStore();
  const [title, setTitle] = useState(section?.title || '');
  const [content, setContent] = useState(section?.content || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sectionData = {
      title,
      content,
      parentId: section?.parentId,
      order: section?.order || 0,
    };

    if (section) {
      updateSection(section.id, sectionData);
    } else {
      addSection(sectionData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {section ? 'Editar' : 'Nueva'} Sección
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Save className="w-5 h-5" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpEditor;