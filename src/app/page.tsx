"use client";

import { useState } from "react";

// 类型定义
interface Sentence {
  id: number;
  text: string;
}

interface Word {
  word: string;
  translation: string;
}

interface ProcessedData {
  summary: string;
  sentences: Sentence[];
  words: Word[];
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 示例文本
  const sampleText = "Iranian President Masoud Pezeshkian says the country will not bow to external pressure as it continues nuclear negotiations with the United States.";

  // 处理文本
  const processText = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setProcessedData(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error("处理失败:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSample = () => {
    setInputText(sampleText);
  };

  const currentSentence = processedData?.sentences[currentIndex];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* 博客顶部导航 */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-stone-800">
            📖 TTS Reader
          </h1>
          <nav className="text-sm text-stone-500">
            <span className="hover:text-stone-800 cursor-pointer">关于</span>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* 文章输入区域 */}
        <article className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 mb-8">
          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-4">
            智能英语阅读器
          </h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            输入英文文章，自动提取关键单词、生成总结，就像课文后的生单词表一样学习英语。
          </p>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="在这里粘贴英文文章..."
            className="w-full h-40 p-4 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent resize-none font-mono text-sm"
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={processText}
              disabled={!inputText.trim() || isProcessing}
              className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? "处理中..." : "开始阅读"}
            </button>
            <button
              onClick={loadSample}
              className="px-6 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              加载示例
            </button>
          </div>
        </article>

        {/* 结果展示 */}
        {processedData && (
          <>
            {/* 总结 */}
            <section className="bg-amber-50 rounded-lg border border-amber-100 p-6 mb-8">
              <h3 className="text-lg font-serif font-bold text-amber-800 mb-2">
                📋 文章总结
              </h3>
              <p className="text-amber-900 leading-relaxed">
                {processedData.summary}
              </p>
            </section>

            {/* 进度条 */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-stone-500">
                句子 {currentIndex + 1} / {processedData.sentences.length}
              </span>
              <div className="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-stone-600 transition-all"
                  style={{ width: `${((currentIndex + 1) / processedData.sentences.length) * 100}%` }}
                />
              </div>
            </div>

            {/* 当前句子 */}
            <section className="bg-white rounded-lg shadow-sm border border-stone-200 p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl text-stone-300">{currentIndex + 1}</span>
                <p className="text-2xl font-serif text-stone-800 leading-relaxed flex-1">
                  {currentSentence?.text}
                </p>
              </div>
              
              {/* 导航按钮 */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-stone-100">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg rounded-lg hover:bg-stone-200 disabled:opacity--stone-10050 disabled:cursor-not-allowed transition-colors"
                >
                  ← 上一句
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(processedData.sentences.length - 1, currentIndex + 1))}
                  disabled={currentIndex === processedData.sentences.length - 1}
                  className="px-4 py-2 bg-stone-100 rounded-lg hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一句 →
                </button>
              </div>
            </section>

            {/* 单词表 */}
            <section className="bg-white rounded-lg shadow-sm border border-stone-200 p-8">
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-6 pb-4 border-b border-stone-100">
                📚 单词表
              </h3>
              <div className="grid gap-3">
                {processedData.words.map((word, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                  >
                    <span className="font-mono font-bold text-stone-800 min-w-[120px]">
                      {word.word}
                    </span>
                    <span className="text-stone-600">
                      {word.translation}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 页脚 */}
        <footer className="mt-12 pt-8 border-t border-stone-200 text-center text-stone-500 text-sm">
          <p>Built with TTS Reader · 让学习更有趣</p>
        </footer>
      </main>
    </div>
  );
}
