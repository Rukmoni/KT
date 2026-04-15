import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Bot, Zap, Shield, Clock, ChevronRight, MessageSquare, Volume2, VolumeX } from 'lucide-react';
import './ChatbotDemoPage.css';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'What services does Kuvanta Tech offer?',
  'How long does app development take?',
  'Can you build a custom AI solution for my business?',
  'What is your pricing model?',
];

const CONVERSATION_FLOWS: Record<string, string> = {
  services:
    'Kuvanta Tech specializes in Mobile App Development (React Native & Expo), Web Portals, AI Automation, and strategic Tech Consultation. Each solution is crafted end-to-end — from architecture through deployment.',
  timeline:
    'A typical MVP takes 6–12 weeks depending on complexity. We follow agile sprints with bi-weekly demos, so you see progress early and often. Want me to walk you through our delivery process?',
  ai:
    'Absolutely. Our AI team has built chatbots, automation pipelines, smart recommendation engines, and custom LLM integrations. We design systems that reduce overhead and scale effortlessly. What specific business problem are you looking to solve?',
  pricing:
    'We offer project-based and retainer pricing. Projects start from $5,000 for MVPs and scale based on scope. Retainers are popular for ongoing product evolution. Shall I connect you with our team for a tailored quote?',
  hello:
    'Hello! I\'m the Kuvanta AI assistant — here to answer any questions about our services and help you explore how we can build something great together. What are you working on?',
  thanks:
    'You\'re very welcome! Is there anything else you\'d like to know? I\'m happy to go deeper on any topic — services, timelines, technical approach, or past work.',
  default:
    'Great question. Kuvanta Tech combines engineering excellence with creative problem-solving to deliver products that genuinely move the needle. Could you tell me more about what you\'re building so I can point you in the right direction?',
};

function classifyInput(input: string): string {
  const l = input.toLowerCase();
  if (/\b(hi|hello|hey|greetings|good (morning|afternoon|evening))\b/.test(l)) return 'hello';
  if (/\b(thank|thanks|appreciate|cheers)\b/.test(l)) return 'thanks';
  if (/\b(service|offer|do you|provide|speciali[sz]e|build|develop|create)\b/.test(l)) return 'services';
  if (/\b(time|timeline|long|week|month|fast|quick|duration|deliver)\b/.test(l)) return 'timeline';
  if (/\b(ai|artificial|automation|bot|chatbot|llm|machine learning|smart)\b/.test(l)) return 'ai';
  if (/\b(pric|cost|rate|fee|budget|invest|charge|quote)\b/.test(l)) return 'pricing';
  return 'default';
}

function generateResponse(input: string, turnCount: number): string {
  if (turnCount === 0) return CONVERSATION_FLOWS['hello'];
  const key = classifyInput(input);
  if (key !== 'default') return CONVERSATION_FLOWS[key];

  const fallbacks = [
    'That\'s a great point to explore. Our team at Kuvanta specializes in tailoring solutions to unique challenges like this. Can you share a bit more context?',
    'Interesting! We love projects that push boundaries. To give you the most relevant answer, could you tell me what industry or use case you have in mind?',
    'I want to make sure I give you the most accurate information. Could you rephrase or expand on that? I\'m here to help.',
    CONVERSATION_FLOWS['default'],
  ];
  return fallbacks[turnCount % fallbacks.length];
}

const FEATURES = [
  { icon: <Zap size={20} />, label: 'Instant Responses', desc: 'Real-time answers with zero latency' },
  { icon: <Shield size={20} />, label: 'Zero Cost', desc: 'Runs entirely in your browser — no API fees' },
  { icon: <MessageSquare size={20} />, label: 'Voice Enabled', desc: 'Speak and listen with Web Speech API' },
  { icon: <Clock size={20} />, label: '24/7 Available', desc: 'Always on, never misses a lead' },
];

let msgIdCounter = 0;

export const ChatbotDemoPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage("Hi there! I'm the Kuvanta AI demo assistant. Ask me anything about our services, timelines, pricing, or capabilities. You can also use voice — just click the mic!");
      setHasStarted(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SR();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };
    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);
    window.speechSynthesis.getVoices();
  }, []);

  const speak = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      ['Samantha', 'Google US English', 'Microsoft Zira', 'Karen'].some(n => v.name.includes(n))
    ) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { id: ++msgIdCounter, sender: 'bot', text, timestamp: new Date() }]);
    speak(text);
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim();
    if (!text || isTyping) return;
    setInputValue('');
    const userMsg: Message = { id: ++msgIdCounter, sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTurnCount(n => n + 1);
    setIsTyping(true);
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      const response = generateResponse(text, turnCount);
      setIsTyping(false);
      addBotMessage(response);
    }, delay);
  };

  const handleSuggest = (prompt: string) => {
    handleSend(prompt);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      setInputValue('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(v => !v);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      className="demo-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="demo-hero">
        <motion.div
          className="demo-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="demo-badge">
            <Bot size={14} />
            <span>Live AI Demo</span>
          </div>
          <h1 className="demo-title">
            Experience Our <span className="demo-title-accent">AI Chatbot</span>
          </h1>
          <p className="demo-subtitle">
            A zero-cost, browser-native AI assistant — voice-enabled, instant, and deployable for any business.
          </p>
        </motion.div>

        <motion.div
          className="demo-features-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {FEATURES.map((f, i) => (
            <div className="demo-feature-chip" key={i}>
              <span className="demo-feature-icon">{f.icon}</span>
              <div>
                <div className="demo-feature-label">{f.label}</div>
                <div className="demo-feature-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="demo-body">
        <motion.div
          className="demo-chat-wrapper"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="demo-chat-header">
            <div className="demo-chat-header-left">
              <div className={`demo-orb ${isSpeaking ? 'speaking' : ''}`} />
              <div>
                <div className="demo-chat-name">Kuvanta AI</div>
                <div className="demo-chat-status">
                  <span className="demo-status-dot" />
                  Online — ready to help
                </div>
              </div>
            </div>
            <button
              className={`demo-voice-toggle ${voiceEnabled ? 'active' : ''}`}
              onClick={toggleVoice}
              title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
            </button>
          </div>

          <div className="demo-messages">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  className={`demo-msg ${msg.sender}`}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28 }}
                >
                  {msg.sender === 'bot' && (
                    <div className="demo-msg-avatar">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className="demo-msg-body">
                    <div className="demo-bubble">{msg.text}</div>
                    <div className="demo-msg-time">{formatTime(msg.timestamp)}</div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="demo-msg bot"
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="demo-msg-avatar">
                    <Bot size={14} />
                  </div>
                  <div className="demo-msg-body">
                    <div className="demo-bubble demo-typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {hasStarted && messages.length <= 2 && !isTyping && (
            <div className="demo-suggestions">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button key={i} className="demo-suggestion-btn" onClick={() => handleSuggest(p)}>
                  {p}
                  <ChevronRight size={13} />
                </button>
              ))}
            </div>
          )}

          <div className="demo-input-row">
            <button
              className={`demo-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListen}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              className="demo-input"
              placeholder={isListening ? 'Listening...' : 'Ask anything about Kuvanta Tech...'}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button
              className="demo-send-btn"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>

        <motion.div
          className="demo-info-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="demo-info-card">
            <h3 className="demo-info-title">How it works</h3>
            <ul className="demo-info-list">
              <li>
                <span className="demo-info-num">01</span>
                <div>
                  <strong>Natural language processing</strong> — Understands intent without any external ML APIs
                </div>
              </li>
              <li>
                <span className="demo-info-num">02</span>
                <div>
                  <strong>Web Speech API</strong> — Voice input and output using only native browser APIs
                </div>
              </li>
              <li>
                <span className="demo-info-num">03</span>
                <div>
                  <strong>Lead capture ready</strong> — Designed to collect and forward qualified leads automatically
                </div>
              </li>
              <li>
                <span className="demo-info-num">04</span>
                <div>
                  <strong>Fully customisable</strong> — Tone, knowledge base, flows all tailored to your brand
                </div>
              </li>
            </ul>
          </div>

          <div className="demo-info-card demo-info-card--highlight">
            <h3 className="demo-info-title">Want this for your business?</h3>
            <p className="demo-info-body">
              We build and deploy custom AI chatbots tailored to your product, brand voice, and workflows — with optional integrations to CRM, Slack, email, and more.
            </p>
            <a href="/#contact" className="demo-cta-btn">
              Talk to us <ChevronRight size={16} />
            </a>
          </div>

          <div className="demo-tech-note">
            <Shield size={14} />
            <span>Zero API cost demo — runs entirely in your browser using Web APIs</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
