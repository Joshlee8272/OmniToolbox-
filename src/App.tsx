import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Code, 
  Hash, 
  Settings, 
  Menu, 
  X, 
  Copy, 
  Check, 
  Trash2,
  FileJson,
  Binary,
  Type,
  MessageSquare,
  Send,
  User,
  Bot,
  ExternalLink,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

type Tool = 'keyword-search' | 'json-formatter' | 'base64' | 'text-stats' | 'sms-bomber' | 'support-ai';

// AdSense Component
const AdSenseUnit = ({ slot }: { slot: string }) => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense Error:', e);
    }
  }, []);

  return (
    <div className="ad-container overflow-hidden flex justify-center my-4">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool>('keyword-search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAdOverlay, setShowAdOverlay] = useState(false);

  // Random Ad Trigger
  useEffect(() => {
    const triggerAd = () => {
      // 10% chance to show an ad every 2 minutes
      if (Math.random() < 0.1) {
        setShowAdOverlay(true);
      }
    };

    const interval = setInterval(triggerAd, 120000); // Check every 2 minutes
    return () => clearInterval(interval);
  }, []);

  // Also trigger ad on tool switch (20% chance)
  const handleToolSwitch = (tool: Tool) => {
    setActiveTool(tool);
    if (Math.random() < 0.2) {
      setShowAdOverlay(true);
    }
  };

  const tools = [
    { id: 'keyword-search', name: 'Keyword Searcher', icon: Search },
    { id: 'sms-bomber', name: 'SMS Bomber', icon: Hash },
    { id: 'support-ai', name: 'Support AI', icon: MessageSquare },
    { id: 'json-formatter', name: 'JSON Formatter', icon: FileJson },
    { id: 'base64', name: 'Base64 Tool', icon: Binary },
    { id: 'text-stats', name: 'Text Stats', icon: Type },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-zinc-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-zinc-800"
            >
              OmniToolbox
            </motion.h1>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolSwitch(tool.id as Tool)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTool === tool.id 
                  ? 'bg-zinc-900 text-white shadow-lg' 
                  : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <tool.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{tool.name}</span>}
            </button>
          ))}
          
          {isSidebarOpen && (
            <div className="mt-8 p-4 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                <Megaphone size={12} />
                Sponsored
              </div>
              <div className="bg-zinc-200 h-32 rounded-lg flex items-center justify-center text-[10px] text-zinc-400 font-mono text-center px-4">
                {/* Sidebar Ad Unit */}
                <AdSenseUnit slot="XXXXXXXXXX" />
              </div>
            </div>
          )}
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <div className={`flex flex-col gap-4 ${!isSidebarOpen && 'items-center'}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                OT
              </div>
              {isSidebarOpen && (
                <div className="text-xs">
                  <p className="font-semibold">OmniToolbox v1.1</p>
                  <p className="text-zinc-400">Ready for work</p>
                </div>
              )}
            </div>
            
            {isSidebarOpen && (
              <a 
                href="https://t.me/ItsMeJeff" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg border border-zinc-100 hover:bg-zinc-100 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <ExternalLink size={12} />
                </div>
                <div className="text-[10px]">
                  <p className="text-zinc-400 font-bold uppercase tracking-wider">Owner</p>
                  <p className="text-zinc-900 font-bold">@ItsMeJeff</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 relative">
        <div className="max-w-5xl mx-auto p-8 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTool === 'keyword-search' && <KeywordSearcher />}
              {activeTool === 'sms-bomber' && <SMSBomber />}
              {activeTool === 'support-ai' && <SupportAI />}
              {activeTool === 'json-formatter' && <JsonFormatter />}
              {activeTool === 'base64' && <Base64Tool />}
              {activeTool === 'text-stats' && <TextStats />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Random Ad Overlay */}
      <AnimatePresence>
        {showAdOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative"
            >
              <button 
                onClick={() => setShowAdOverlay(false)}
                className="absolute top-4 right-4 p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-all z-10"
              >
                <X size={20} />
              </button>
              
              <div className="p-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Megaphone size={12} />
                  Sponsored Content
                </div>
                
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Support OmniToolbox</h3>
                <p className="text-sm text-zinc-500 mb-8">This tool is free thanks to our sponsors. Please consider checking them out!</p>
                
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 min-h-[250px] flex items-center justify-center">
                  {/* Interstitial Ad Unit */}
                  <AdSenseUnit slot="YYYYYYYYYY" />
                </div>
                
                <button 
                  onClick={() => setShowAdOverlay(false)}
                  className="mt-8 w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
                >
                  Continue to App
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function KeywordSearcher() {
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [lineNum, setLineNum] = useState('');
  const [results, setResults] = useState<{ line: number; text: string }[]>([]);
  const [fileName, setFileName] = useState('document.txt');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSearch = () => {
    if (!content) return;
    const lines = content.split('\n');
    const found: { line: number; text: string }[] = [];

    lines.forEach((text, index) => {
      const currentLineNum = index + 1;
      
      // If line number is specified, only check that line
      if (lineNum && currentLineNum !== parseInt(lineNum)) return;

      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        found.push({ line: currentLineNum, text });
      }
    });

    setResults(found);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900">Keyword Searcher</h2>
        <p className="text-zinc-500 mt-1">Search and filter text content with precision.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Text Content
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.js,.ts,.tsx,.json,.html,.css"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50 transition-all"
                >
                  <FileText size={14} />
                  UPLOAD FILE
                </button>
                <button 
                  onClick={() => setContent('')}
                  className="text-xs font-bold text-zinc-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-all"
                >
                  <Trash2 size={14} />
                  CLEAR
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your file content here or upload a file..."
              className="w-full h-64 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all font-mono text-sm resize-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                File Name
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Keyword
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword..."
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Line Number (Optional)
              </label>
              <input
                type="number"
                value={lineNum}
                onChange={(e) => setLineNum(e.target.value)}
                placeholder="Specific line..."
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Search
            </button>
            <button
              onClick={handleDownload}
              className="w-full py-3 border border-zinc-200 text-zinc-700 rounded-xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Hash size={20} className="text-zinc-400" />
            Search Results ({results.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {results.map((res, i) => (
              <div key={i} className="flex gap-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100 hover:border-zinc-300 transition-all group">
                <span className="text-xs font-mono font-bold text-zinc-400 w-8 pt-1">
                  {res.line}
                </span>
                <p className="text-sm font-mono text-zinc-700 break-all">
                  {res.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatJson = (minify = false) => {
    try {
      setError('');
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
    } catch (e) {
      setError('Invalid JSON format');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900">JSON Formatter</h2>
        <p className="text-zinc-500 mt-1">Clean up or compress your JSON data instantly.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Input</label>
              <button onClick={() => setInput('')} className="text-zinc-400 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JSON here..."
              className="flex-1 w-full min-h-[400px] p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => formatJson(false)}
                className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
              >
                Beautify
              </button>
              <button
                onClick={() => formatJson(true)}
                className="flex-1 py-3 border border-zinc-200 text-zinc-700 rounded-xl font-bold hover:bg-zinc-50 transition-all"
              >
                Minify
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Output</label>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
                className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-1 text-xs font-bold"
              >
                <Copy size={16} />
                COPY
              </button>
            </div>
            <div className={`flex-1 w-full min-h-[400px] p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre ${
              error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-900 text-zinc-300'
            }`}>
              {error || output || 'Formatted output will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => {
    try {
      setOutput(btoa(input));
    } catch (e) {
      setOutput('Error: Could not encode to Base64');
    }
  };

  const decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput('Error: Invalid Base64 string');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900">Base64 Tool</h2>
        <p className="text-zinc-500 mt-1">Encode or decode text to and from Base64 format.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-zinc-900 outline-none"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={encode}
            className="flex-1 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            Encode to Base64
          </button>
          <button
            onClick={decode}
            className="flex-1 py-4 border border-zinc-900 text-zinc-900 rounded-xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
          >
            Decode from Base64
          </button>
        </div>

        <div className="space-y-2 pt-4 border-t border-zinc-100">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Result</label>
            <button 
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="w-full min-h-[100px] p-4 bg-zinc-100 rounded-xl font-mono text-sm break-all">
            {output || 'Result will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextStats() {
  const [text, setText] = useState('');

  const stats = {
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    sentences: text ? text.split(/[.!?]+/).filter(Boolean).length : 0,
    readingTime: Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200)
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900">Text Stats</h2>
        <p className="text-zinc-500 mt-1">Analyze your text for length, complexity, and reading time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Characters', value: stats.chars },
          { label: 'Words', value: stats.words },
          { label: 'Lines', value: stats.lines },
          { label: 'Reading Time', value: `${stats.readingTime} min` },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Paste Text to Analyze
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-80 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
          placeholder="Start typing or paste text here..."
        />
      </div>
    </div>
  );
}

function SupportAI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your OmniToolbox assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are the Support AI for OmniToolbox, a developer utility suite. You help users understand how to use the Keyword Searcher, SMS Bomber, JSON Formatter, and other tools. You are friendly, concise, and technical. The owner of this app is @ItsMeJeff on Telegram."
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', text: "Error: I'm having trouble connecting to the brain. Please try again later." }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
          <MessageSquare className="text-blue-500" />
          Support AI
        </h2>
        <p className="text-zinc-500 mt-1">Chat with our intelligent assistant for help with any tool.</p>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-zinc-900 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-white rounded-tr-none' 
                    : 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <Bot size={16} />
                </div>
                <div className="flex gap-1">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-zinc-50 border-t border-zinc-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about OmniToolbox..."
              className="flex-1 p-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SMSBomber() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('10');
  const [isBombing, setIsBombing] = useState(false);
  const [logs, setLogs] = useState<{ service: string; status: 'success' | 'error'; code?: number; message?: string }[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });
  const stopRef = useRef(false);

  const validatePhone = (num: string) => {
    const pattern = /^(09\d{9}|9\d{9})$/;
    return pattern.test(num);
  };

  const addLog = (service: string, status: 'success' | 'error', code?: number, message?: string) => {
    setLogs(prev => [{ service, status, code, message }, ...prev].slice(0, 50));
    setStats(prev => ({
      total: prev.total + 1,
      success: status === 'success' ? prev.success + 1 : prev.success,
      failed: status === 'error' ? prev.failed + 1 : prev.failed
    }));
  };

  const startBombing = async () => {
    if (!validatePhone(phoneNumber)) {
      alert('Please enter a valid Philippine phone number (e.g., 09123456789)');
      return;
    }

    setIsBombing(true);
    stopRef.current = false;
    setLogs([]);
    setStats({ total: 0, success: 0, failed: 0 });

    const targetAmount = parseInt(amount);
    let sentCount = 0;

    const services = [
      'S5.com', 'Xpress PH', 'Abenson', 'Excellente Lending', 
      'FortunePay', 'WeMove', 'LBC', 'Pickup Coffee', 'HoneyLoan', 'Komo'
    ];

    while (sentCount < targetAmount && !stopRef.current) {
      const service = services[Math.floor(Math.random() * services.length)];
      
      try {
        // We call our backend proxy to avoid CORS
        const response = await fetch('/api/sms/bomb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber, service })
        });

        const data = await response.json();
        if (data.success) {
          addLog(service, 'success', data.statusCode);
        } else {
          addLog(service, 'error', data.statusCode, data.error);
        }
      } catch (err) {
        addLog(service, 'error', undefined, 'Network Error');
      }

      sentCount++;
      // Small delay to simulate real bombing and avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsBombing(false);
  };

  const stopBombing = () => {
    stopRef.current = true;
    setIsBombing(false);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
          <Hash className="text-emerald-500" />
          JOSH SMS BOMB PREMIUM
        </h2>
        <p className="text-zinc-500 mt-1">Professional SMS Testing Tool with Multiple Service Integration.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Target Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="09xxxxxxxxx"
                disabled={isBombing}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Amount of SMS
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"
                disabled={isBombing}
                className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            
            {!isBombing ? (
              <button
                onClick={startBombing}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                START BOMBARDMENT
              </button>
            ) : (
              <button
                onClick={stopBombing}
                className="w-full py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                <X size={18} />
                STOP BOMBING
              </button>
            )}
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl text-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Analytics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-emerald-400">{stats.success}</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Successful</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Failed</p>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Progress</span>
                <span className="text-[10px] font-bold text-emerald-400">{Math.round((stats.total / parseInt(amount || '1')) * 100)}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-emerald-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.total / parseInt(amount || '1')) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-700 uppercase tracking-tight">Bombing Logs</h3>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-zinc-950 text-zinc-400">
              {logs.length === 0 && (
                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                  Waiting for initiation...
                </div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 py-0.5 border-b border-zinc-900/50">
                  <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.status === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                    {log.status === 'success' ? '✓' : '✗'}
                  </span>
                  <span className="text-zinc-300 font-bold w-24">{log.service}</span>
                  <span className="flex-1">
                    {log.status === 'success' 
                      ? `Request successful (Code: ${log.code})` 
                      : `Request failed: ${log.message || 'Unknown error'}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
