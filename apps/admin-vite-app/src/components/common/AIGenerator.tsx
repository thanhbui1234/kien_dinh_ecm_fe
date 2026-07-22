import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { ENV } from '@/config/env';

interface AIGeneratorProps {
  title?: string;
  description?: string;
  placeholder?: string;
  generateContent: (apiKey: string, prompt: string) => Promise<any>;
  onGenerateSuccess: (data: any) => void;
  onClose: () => void;
}

export function AIGenerator({ 
  title = 'Sinh dữ liệu tự động bằng AI',
  description = 'Nhập yêu cầu chi tiết để AI phân tích và tự điền dữ liệu.',
  placeholder = 'Nhập yêu cầu của bạn...',
  generateContent,
  onGenerateSuccess, 
  onClose 
}: AIGeneratorProps) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState('');

  const handleGenerateAI = async () => {
    try {
      setIsGeneratingAI(true);
      setAiError('');
      
      const apiKey = ENV.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Chưa cấu hình GEMINI_API_KEY trong file .env');
      }

      const result = await generateContent(apiKey, aiPrompt);
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
        <h3 className="text-sm font-bold text-indigo-900">{title}</h3>
      </div>
      <p className="text-xs font-medium text-indigo-800">
        {description}
      </p>
      <textarea 
        value={aiPrompt} 
        onChange={e => setAiPrompt(e.target.value)} 
        rows={3} 
        className="w-full px-3 py-2 rounded-md bg-white border border-indigo-200 text-sm font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" 
        placeholder={placeholder} 
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
          {isGeneratingAI ? 'Đang xử lý...' : 'Bắt đầu tạo'}
        </button>
      </div>
    </div>
  );
}
