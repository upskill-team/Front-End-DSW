import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

interface DocumentViewerProps {
  url: string;
  onClose: () => void;
}

const DocumentViewer = ({ url, onClose }: DocumentViewerProps) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-11/12 h-5/6 max-w-5xl bg-white rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-3 border-b bg-slate-50 rounded-t-lg">
          <h3 className="font-semibold text-slate-700">Visor de Documento</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <iframe
          src={url}
          title="Visor de Documento"
          className="w-full h-full border-0 rounded-b-lg"
        />
      </div>
    </div>,
    document.getElementById('modal-portal')!
  );
};

export default DocumentViewer;