import { NextRequest, NextResponse } from "next/server";

// 模拟断句函数
function splitSentences(text: string): string[] {
  // 简单按句号、问号、感叹号断句
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// 模拟单词提取和翻译（实际项目中应该调用翻译API）
function extractWords(sentences: string[]): { word: string; translation: string }[] {
  // 常见单词映射（实际项目中应该调用AI翻译）
  const wordMap: Record<string, string> = {
    "Iranian": "伊朗的",
    "President": "总统",
    "Masoud Pezeshkian": "马苏德·佩泽什基安（人名）",
    "country": "国家",
    "bow": "屈服，弯腰",
    "external": "外部的",
    "pressure": "压力",
    "continues": "继续",
    "nuclear": "核能的",
    "negotiations": "谈判",
    "United States": "美国",
  };
  
  const words: { word: string; translation: string }[] = [];
  const seen = new Set<string>();
  
  // 遍历句子提取单词
  for (const sentence of sentences) {
    const tokens = sentence.split(/\s+/);
    for (const token of tokens) {
      const cleanWord = token.replace(/[^a-zA-Z]/g, "");
      if (cleanWord && !seen.has(cleanWord.toLowerCase())) {
        // 检查是否是常见词汇
        for (const [key, value] of Object.entries(wordMap)) {
          if (sentence.toLowerCase().includes(key.toLowerCase())) {
            words.push({ word: key, translation: value });
            seen.add(key.toLowerCase());
            break;
          }
        }
      }
    }
  }
  
  return words.slice(0, 10); // 最多返回10个单词
}

// 模拟总结功能
function generateSummary(text: string): string {
  return `本文报道了伊朗总统马苏德·佩泽什基安表示，伊朗将继续与美国进行核谈判，但不会屈服于外部压力。`;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: "缺少文本内容" }, { status: 400 });
    }
    
    // 断句
    const sentences = splitSentences(text);
    
    // 生成总结
    const summary = generateSummary(text);
    
    // 提取单词
    const words = extractWords(sentences);
    
    // 构建返回数据
    const data = {
      summary,
      sentences: sentences.map((text, id) => ({
        id,
        text,
      })),
      words,
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("处理错误:", error);
    return NextResponse.json({ error: "处理失败" }, { status: 500 });
  }
}
