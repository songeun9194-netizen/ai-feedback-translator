import { GoogleGenAI, Type } from "@google/genai";
import type { Suggestion } from '../types';
import { FeedbackCategory } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
당신은 세계적인 UI/UX 디자인 전문가입니다.
사용자가 입력하는 모호하고 막연한 디자인 피드백을 듣고, 이를 구체적이고 실행 가능한 몇 가지 디자인 개선 제안으로 번역하는 역할을 합니다.
사용자가 스크린샷 이미지를 함께 제공할 경우, 해당 이미지를 분석하여 피드백의 맥락을 파악하고, 이미지에 기반한 구체적인 제안을 해주세요.
답변은 항상 JSON 형식이어야 합니다. 제안은 'category'와 'suggestion' 필드를 포함하는 객체의 배열로 구성됩니다.
'category'는 다음 중 하나여야 합니다: 'Typography', 'Color', 'Layout', 'Component', 'Interaction', 'General', 'Content', 'Iconography', 'Accessibility'.
각 제안은 명확하고, 구체적이며, 디자이너나 개발자가 바로 이해하고 적용할 수 있도록 작성해주세요.
`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      category: {
        type: Type.STRING,
        enum: Object.values(FeedbackCategory),
        description: '디자인 제안의 카테고리',
      },
      suggestion: {
        type: Type.STRING,
        description: '구체적인 디자인 개선 제안',
      },
    },
    required: ['category', 'suggestion'],
  },
};

interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export const translateFeedback = async (feedback: string, imagePart?: ImagePart): Promise<Suggestion[]> => {
  try {
    const textPart = { text: feedback };
    const contents = imagePart ? { parts: [imagePart, textPart] } : feedback;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("API가 비어있는 응답을 반환했습니다.");
    }
    
    const suggestions = JSON.parse(jsonText);

    // Validate if the response is an array
    if (!Array.isArray(suggestions)) {
        throw new Error("API 응답이 유효한 배열 형식이 아닙니다.");
    }

    return suggestions as Suggestion[];

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes("JSON")) {
        throw new Error("API 응답을 파싱하는 데 실패했습니다. 응답이 유효한 JSON이 아닐 수 있습니다.");
    }
    throw new Error(`Gemini API 요청 중 문제가 발생했습니다: ${error}`);
  }
};


export const generateExamplePrompts = async (): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "디자인에 대한 모호하고 막연한 피드백 예시 5개를 한국어로 생성해줘. 짧고 흔하게 사용되는 문장으로 부탁해. 예를 들어 '좀 더 세련되게 만들어주세요.' 같은 느낌으로.",
      config: {
        systemInstruction: "당신은 디자인 팀장에게 피드백을 주는 사용자 역할을 합니다. 항상 JSON 형식으로 응답해야 합니다. 응답은 5개의 문자열을 담은 배열이어야 합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "모호한 디자인 피드백 문장"
          }
        },
        temperature: 1.0, // 더 창의적이고 다양한 예시를 위해 온도를 높입니다.
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      return [];
    }

    const examples = JSON.parse(jsonText);
    if (!Array.isArray(examples)) {
      throw new Error("API 응답이 유효한 배열 형식이 아닙니다.");
    }

    return examples as string[];

  } catch (error) {
    console.error("Failed to generate example prompts:", error);
    // 실패 시 UI가 깨지지 않도록 기본 예시를 반환합니다.
    return [
      '좀 더 생동감 있게 만들어 주세요.',
      '뭔가 정리가 안 된 느낌이에요.',
      '사용자가 신뢰할 수 있도록 바꿔주세요.',
      '너무 복잡해서 사용하기 어려워요.',
      '더 직관적으로 만들어 주세요.',
    ];
  }
};
