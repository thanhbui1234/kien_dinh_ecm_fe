import { ENV } from '@/config/env';

export interface AIProductGenerationResult {
  name: string;
  price?: number;
  specs: { key: string; value: string }[];
  features: { key: string; value: string }[];
  contentDetail: string;
}

export const generateProductContent = async (
  apiKey: string,
  prompt: string
): Promise<AIProductGenerationResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia tạo dữ liệu sản phẩm cho hệ thống Ecommerce.
Nhiệm vụ của bạn là dựa vào yêu cầu của người dùng để sinh ra thông tin sản phẩm.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC SAU:
{
  "name": "Tên sản phẩm",
  "price": 10000000, // Giá tiền (số nguyên), nếu không rõ thì để null
  "specs": [
    { "key": "Tên thông số", "value": "Giá trị thông số" }
  ],
  "features": [
    { "key": "Tên tính năng", "value": "Mô tả tính năng nổi bật" }
  ],
  "contentDetail": "Mã HTML chi tiết giới thiệu sản phẩm (dùng h2, h3, p, ul, li, strong)"
}`;

  const userPrompt = `
Yêu cầu từ người dùng: ${prompt}

Hãy sinh ra JSON cấu hình sản phẩm theo đúng chuẩn đã yêu cầu. Không được trả về gì ngoài JSON.
  `;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

  const temperature = ENV.GEMINI_TEMPERATURE;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.7 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 503 || response.status === 429 || response.status === 404) {
          throw new Error(`Model ${model} bị lỗi ${response.status}: ${errData.error?.message || 'Unavailable'}`);
        }
        throw new Error(errData.error?.message || 'Có lỗi xảy ra khi kết nối tới AI');
      }

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();

      const parsed = JSON.parse(text);
      return parsed as AIProductGenerationResult;
      
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Tất cả các AI Models đều đang bận hoặc quá tải. Vui lòng thử lại sau.");
};

export interface AIProjectGenerationResult {
  name: string;
  description: string;
  contentDetail: string;
}

export const generateProjectContent = async (
  apiKey: string,
  prompt: string
): Promise<AIProjectGenerationResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia lập kế hoạch và mô tả dự án.
Nhiệm vụ của bạn là dựa vào yêu cầu của người dùng để sinh ra thông tin chi tiết cho một dự án.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC SAU:
{
  "name": "Tên dự án",
  "description": "Mô tả ngắn gọn về dự án (tối đa 2-3 câu)",
  "contentDetail": "Mã HTML trình bày chi tiết về dự án (dùng h2, h3, p, ul, li, strong, giới thiệu bối cảnh, mục tiêu, kết quả đạt được, ...)"
}`;

  const userPrompt = `
Yêu cầu từ người dùng: ${prompt}

Hãy sinh ra JSON thông tin dự án theo đúng chuẩn đã yêu cầu. Không được trả về gì ngoài JSON.
  `;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

  const temperature = ENV.GEMINI_TEMPERATURE;

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.7 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 503 || response.status === 429 || response.status === 404) {
          throw new Error(`Model ${model} bị lỗi ${response.status}: ${errData.error?.message || 'Unavailable'}`);
        }
        throw new Error(errData.error?.message || 'Có lỗi xảy ra khi kết nối tới AI');
      }

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '').trim();

      const parsed = JSON.parse(text);
      return parsed as AIProjectGenerationResult;
      
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Tất cả các AI Models đều đang bận hoặc quá tải. Vui lòng thử lại sau.");
};
