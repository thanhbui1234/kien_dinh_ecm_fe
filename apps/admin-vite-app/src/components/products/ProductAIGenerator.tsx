import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { generateProductContent, AIProductGenerationResult } from '@/utils/ai';

interface ProductAIGeneratorProps {
  onGenerateSuccess: (data: AIProductGenerationResult) => void;
  onClose: () => void;
}

export function ProductAIGenerator({ onGenerateSuccess, onClose }: ProductAIGeneratorProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState('');

  const handleGenerateAI = async () => {
    try {
      setIsGeneratingAI(true);
      setAiError('');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chưa cấu hình VITE_GEMINI_API_KEY trong file .env.local');
      }

      const result = await generateProductContent(apiKey, aiPrompt);
      onGenerateSuccess(result);
      onClose();
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-indigo-900">Sinh dữ liệu sản phẩm tự động bằng AI</h3>
      </div>
      <p className="text-xs font-medium text-indigo-800">
        Nhập yêu cầu chi tiết để AI phân tích và tự điền Tên, Giá bán, Thông số kỹ thuật và Nội dung mô tả.
      </p>
      <textarea 
        value={aiPrompt} 
        onChange={e => setAiPrompt(e.target.value)} 
        rows={3} 
        className="w-full px-3 py-2 rounded-md bg-white border border-indigo-200 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" 
        placeholder="Ví dụ: Tạo cho tôi sản phẩm Máy phay CNC 3 trục giá 500 triệu. Gồm thông số điện áp 220V, hành trình X Y Z. Viết mô tả thật chuyên nghiệp..." 
      />
      {aiError && <p className="text-xs text-red-500 font-medium">{aiError}</p>}
      <div className="flex justify-end gap-2">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-4 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Đóng
        </button>
        <button 
          type="button" 
          onClick={handleGenerateAI} 
          disabled={isGeneratingAI || !aiPrompt.trim()} 
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded shadow-sm transition-colors">
          {isGeneratingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGeneratingAI ? 'Đang phân tích...' : 'Bắt đầu tạo'}
        </button>
      </div>
    </div>
  );
}
