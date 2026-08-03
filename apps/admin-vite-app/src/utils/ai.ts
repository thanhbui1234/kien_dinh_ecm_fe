import { ENV } from '@/config/env';

const cleanAndParseJSON = <T>(rawText: string): T => {
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (initialError) {
    const sanitized = cleaned.replace(/[\u0000-\u001F]+/g, (match) => {
      if (match === '\n') return '\\n';
      if (match === '\r') return '\\r';
      if (match === '\t') return '\\t';
      return '';
    });
    return JSON.parse(sanitized) as T;
  }
};

export interface AIProductGenerationResult {
  name: string;
  price?: number;
  specs: { key: string; value: string }[];
  features: { key: string; value: string }[];
  contentDetail: string;
  english?: {
    name: string;
    specs: { key: string; value: string }[];
    features: { key: string; value: string }[];
    contentDetail: string;
  };
}

export const generateProductContent = async (
  apiKey: string,
  prompt: string
): Promise<AIProductGenerationResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia tạo dữ liệu sản phẩm song ngữ (Việt - Anh) cho hệ thống Ecommerce.
Nhiệm vụ của bạn là dựa vào yêu cầu của người dùng để sinh ra thông tin sản phẩm bằng cả Tiếng Việt và Tiếng Anh.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC SAU:
{
  "name": "Tên sản phẩm bằng Tiếng Việt",
  "price": 10000000, // Giá tiền (số nguyên), nếu không rõ thì để null
  "specs": [
    { "key": "Tên thông số bằng Tiếng Việt", "value": "Giá trị thông số" }
  ],
  "features": [
    { "key": "Tên tính năng bằng Tiếng Việt", "value": "Mô tả tính năng nổi bật bằng Tiếng Việt" }
  ],
  "contentDetail": "Mã HTML chi tiết giới thiệu sản phẩm bằng Tiếng Việt (dùng h2, h3, p, ul, li, strong)",
  "english": {
    "name": "Product Name in English",
    "specs": [
      { "key": "Specification Key in English", "value": "Specification Value in English" }
    ],
    "features": [
      { "key": "Feature Name in English", "value": "Feature Description in English" }
    ],
    "contentDetail": "HTML Detailed Content in English (using h2, h3, p, ul, li, strong)"
  }
}`;

  const userPrompt = `
Yêu cầu từ người dùng: ${prompt}

Hãy sinh ra JSON cấu hình sản phẩm song ngữ Việt - Anh theo đúng chuẩn đã yêu cầu. Không được trả về gì ngoài JSON.
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
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AIProductGenerationResult>(text);
      
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
  english?: {
    name: string;
    description: string;
    contentDetail: string;
  };
}

export const generateProjectContent = async (
  apiKey: string,
  prompt: string
): Promise<AIProjectGenerationResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia lập kế hoạch và mô tả dự án song ngữ (Việt - Anh).
Nhiệm vụ của bạn là dựa vào yêu cầu của người dùng để sinh ra thông tin chi tiết cho một dự án bằng cả Tiếng Việt và Tiếng Anh.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC SAU:
{
  "name": "Tên dự án bằng Tiếng Việt",
  "description": "Mô tả ngắn gọn về dự án bằng Tiếng Việt (tối đa 2-3 câu)",
  "contentDetail": "Mã HTML trình bày chi tiết về dự án bằng Tiếng Việt (dùng h2, h3, p, ul, li, strong)",
  "english": {
    "name": "Project Title in English",
    "description": "Short project summary in English (max 2-3 sentences)",
    "contentDetail": "HTML Detailed Content in English (using h2, h3, p, ul, li, strong)"
  }
}`;

  const userPrompt = `
Yêu cầu từ người dùng: ${prompt}

Hãy sinh ra JSON thông tin dự án song ngữ Việt - Anh theo đúng chuẩn đã yêu cầu. Không được trả về gì ngoài JSON.
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
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AIProjectGenerationResult>(text);
      
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Tất cả các AI Models đều đang bận hoặc quá tải. Vui lòng thử lại sau.");
};

export interface AITranslateViToEnInput {
  name?: string;
  contentDetail?: string;
  specs?: { key: string; value: string }[];
  features?: { key: string; value: string }[];
}

export interface AITranslateViToEnResult {
  name: string;
  contentDetail: string;
  specs: { key: string; value: string }[];
  features: { key: string; value: string }[];
}

export const translateViToEnglish = async (
  apiKey: string,
  input: AITranslateViToEnInput
): Promise<AITranslateViToEnResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia dịch thuật công nghiệp & kỹ thuật Việt - Anh chuyên nghiệp.
Nhiệm vụ của bạn là dịch các thông tin sản phẩm từ Tiếng Việt sang Tiếng Anh.
QUY TẮC NGHIÊM NGẶT:
1. Dịch tên sản phẩm sang Tiếng Anh tự nhiên, chuẩn SEO.
2. Dịch các từ khóa thông số kỹ thuật (specs key) và giá trị (specs value) sang Tiếng Anh. Giữ nguyên đơn vị đo lường (kW, mm, kg, RPM...).
3. Dịch tên tính năng (features key) và mô tả tính năng (features value) sang Tiếng Anh.
4. Bài viết chi tiết (contentDetail): GIỮ NGUYÊN 100% CÁC THẺ HTML (h2, h3, p, ul, li, strong, img, a...), giữ nguyên đường dẫn src/href, chỉ dịch thuật phần văn bản hiển thị.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC:
{
  "name": "Product Name in English",
  "specs": [ { "key": "Spec Key EN", "value": "Spec Value EN" } ],
  "features": [ { "key": "Feature Key EN", "value": "Feature Value EN" } ],
  "contentDetail": "HTML Content in English"
}`;

  const userPrompt = `Hãy dịch toàn bộ dữ liệu sản phẩm Tiếng Việt sau đây sang Tiếng Anh:\n${JSON.stringify(input, null, 2)}`;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash'];

  const temperature = ENV.GEMINI_TEMPERATURE;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.3 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Lỗi AI Model ${model}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AITranslateViToEnResult>(text);
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model ${model} thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Không thể dịch bằng AI lúc này. Vui lòng thử lại sau.");
};

export interface AITranslateProjectViToEnInput {
  name?: string;
  description?: string;
  contentDetail?: string;
}

export interface AITranslateProjectViToEnResult {
  name: string;
  description: string;
  contentDetail: string;
}

export const translateProjectViToEnglish = async (
  apiKey: string,
  input: AITranslateProjectViToEnInput
): Promise<AITranslateProjectViToEnResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia dịch thuật bài viết dự án Việt - Anh chuyên nghiệp.
Nhiệm vụ của bạn là dịch các thông tin dự án từ Tiếng Việt sang Tiếng Anh.
QUY TẮC NGHIÊM NGẶT:
1. Dịch tên dự án sang Tiếng Anh tự nhiên, chuyên nghiệp.
2. Dịch mô tả ngắn (description) sang Tiếng Anh.
3. Bài viết chi tiết (contentDetail): GIỮ NGUYÊN 100% CÁC THẺ HTML (h2, h3, p, ul, li, strong, img, a...), giữ nguyên đường dẫn src/href, chỉ dịch thuật phần văn bản hiển thị.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC:
{
  "name": "Project Name in English",
  "description": "Short project description in English",
  "contentDetail": "HTML Content in English"
}`;

  const userPrompt = `Hãy dịch toàn bộ dữ liệu dự án Tiếng Việt sau đây sang Tiếng Anh:\n${JSON.stringify(input, null, 2)}`;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash'];

  const temperature = ENV.GEMINI_TEMPERATURE;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.3 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Lỗi AI Model ${model}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AITranslateProjectViToEnResult>(text);
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model ${model} thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Không thể dịch bằng AI lúc này. Vui lòng thử lại sau.");
};

export interface AITranslateCategoryViToEnInput {
  name?: string;
}

export interface AITranslateCategoryViToEnResult {
  name: string;
}

export const translateCategoryViToEnglish = async (
  apiKey: string,
  input: AITranslateCategoryViToEnInput
): Promise<AITranslateCategoryViToEnResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia dịch thuật chuyên nghiệp.
Nhiệm vụ của bạn là dịch thông tin danh mục từ Tiếng Việt sang Tiếng Anh.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC:
{
  "name": "Category Name in English"
}`;

  const userPrompt = `Hãy dịch toàn bộ dữ liệu danh mục Tiếng Việt sau đây sang Tiếng Anh:\n${JSON.stringify(input, null, 2)}`;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash'];

  const temperature = ENV.GEMINI_TEMPERATURE;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.3 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Lỗi AI Model ${model}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AITranslateCategoryViToEnResult>(text);
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model ${model} thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Không thể dịch bằng AI lúc này. Vui lòng thử lại sau.");
};

export interface AITranslateJobViToEnInput {
  title?: string;
  salary?: string;
  sections?: { title: string; content: string }[];
}

export interface AITranslateJobViToEnResult {
  title: string;
  salary: string;
  sections: { title: string; content: string }[];
}

export const translateJobViToEnglish = async (
  apiKey: string,
  input: AITranslateJobViToEnInput
): Promise<AITranslateJobViToEnResult> => {
  if (!apiKey) {
    throw new Error('Thiếu API Key của Google Gemini. Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
  }

  const systemInstruction = `Bạn là một chuyên gia dịch thuật chuyên nghiệp.
Nhiệm vụ của bạn là dịch các thông tin tuyển dụng từ Tiếng Việt sang Tiếng Anh.
QUY TẮC NGHIÊM NGẶT:
1. Đối với nội dung (content) của sections: GIỮ NGUYÊN 100% CÁC THẺ HTML (h2, h3, p, ul, li, strong, img, a...), giữ nguyên đường dẫn src/href, chỉ dịch thuật phần văn bản hiển thị.
KẾT QUẢ TRẢ VỀ PHẢI LÀ JSON CHUẨN (KHÔNG BỌC TRONG \`\`\`json), CÓ CẤU TRÚC:
{
  "title": "Job Title in English",
  "salary": "Salary in English",
  "sections": [ { "title": "Section Title EN", "content": "HTML Content EN" } ]
}`;

  const userPrompt = `Hãy dịch toàn bộ dữ liệu tuyển dụng Tiếng Việt sau đây sang Tiếng Anh:\n${JSON.stringify(input, null, 2)}`;

  const envModels = ENV.GEMINI_FALLBACK_MODELS;
  const modelsToTry = envModels 
    ? envModels.split(',').map((m: string) => m.trim()).filter(Boolean)
    : ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash'];

  const temperature = ENV.GEMINI_TEMPERATURE;
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: isNaN(temperature) ? 0.3 : temperature,
            response_mime_type: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Lỗi AI Model ${model}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return cleanAndParseJSON<AITranslateJobViToEnResult>(text);
    } catch (err: any) {
      console.warn(`[AI Fallback] Thử gọi model ${model} thất bại:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw new Error(lastError?.message || "Không thể dịch bằng AI lúc này. Vui lòng thử lại sau.");
};
