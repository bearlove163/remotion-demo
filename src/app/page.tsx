"use client";

import { useState, useEffect, useRef } from "react";

// 类型定义
interface Sentence {
  id: number;
  text: string;
  audioUrl?: string;
  duration?: number;
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
  // 状态管理
  const [inputText, setInputText] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 示例文本
  const sampleText = "Iranian President Masoud Pezeshkian says the country will not bow to external pressure as it continues nuclear negotiations with the United States.";

  // 处理文本
  const processText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // 调用AI处理文本
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

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!processedData) return;
      
      if (e.key === "ArrowLeft") {
        // 上一句
        setCurrentIndex((prev) => Math.max(0, prev - 1));
        setIsPlaying(false);
      } else if (e.key === "ArrowRight") {
        // 下一句
        setCurrentIndex((prev) => 
          Math.min(processedData.sentences.length - 1, prev + 1)
        );
        setIsPlaying(false);
      } else if (e.key === " ") {
        // 播放/暂停
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [processedData, isPlaying]);

  // 加载示例
  const loadSample = () => {
    setInputText(sampleText);
  };

  // 当前句子
  const currentSentence = processedData?.sentences[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">TTS Reader 📖</h1>
          <p className="text-sm text-gray-500">智能配音阅读器 - 就像课文一样学习</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 输入区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入英文文章或句子..."
            className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={processText}
              disabled={!inputText.trim() || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "处理中..." : "开始处理"}
            </button>
            <button
              onClick={loadSample}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              加载示例
            </button>
          </div>
        </div>

        {/* 结果展示 */}
        {processedData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：原文与播放 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">📝 原文与朗读</h2>
              
              {/* 总结 */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">📋 总结</h3>
                <p className="text-blue-700">{processedData.summary}</p>
              </div>

              {/* 进度指示 */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  句子 {currentIndex + 1} / {processedData.sentences.length}
                </span>
                <div className="flex gap-1">
                  {processedData.sentences.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentIndex ? "bg-blue-600" : 
                        idx < currentIndex ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* 当前句子 */}
              <div className="mb-6">
                <p className="text-xl text-gray-800 leading-relaxed min-h-[80px]">
                  {currentSentence?.text}
                </p>
              </div>

              {/* 播放控制 */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  ⏮️ 上一句
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-xl"
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <button
                  onClick={() => setCurrentIndex(Math.min(processedData.sentences.length - 1, currentIndex + 1))}
                  disabled={currentIndex === processedData.sentences.length - 1}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  下一句 ⏭️
                </button>
                
                {/* 速度控制 */}
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-500">速度:</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="p-1 border border-gray-200 rounded"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>

              {/* 快捷键提示 */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
                <span className="font-medium">快捷键：</span>
                ← 上一句 | → 下一句 | 空格 播放/暂停
              </div>
            </div>

            {/* 右侧：单词表 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">📚 单词表（生单词）</h2>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {processedData.words.map((word, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      idx === currentIndex 
                        ? "bg-blue-50 border-blue-500" 
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <span className="font-semibold text-gray-800">{word.word}</span>
                    <span className="text-gray-500 mx-2">-</span>
                    <span className="text-gray-600">{word.translation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
