import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Bot, Zap, Shield, Clock, ChevronRight, MessageSquare, Volume2, VolumeX, Upload, FileText, X, CircleCheck as CheckCircle } from 'lucide-react';
import './ChatbotDemoPage.css';

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  'What services does Kuvanta Tech offer?',
  'How does your development process work?',
  'Can you build a custom AI solution for my business?',
  'What is your pricing model?',
];

interface ConversationRule {
  patterns: RegExp[];
  responses: string[];
}

const RULES: ConversationRule[] = [
  {
    patterns: [/\b(hi|hello|hey|howdy|greetings|good (morning|afternoon|evening|day))\b/],
    responses: [
      "Hello! I'm the Kuvanta AI assistant. I can tell you about our mobile apps, web portals, AI automation, pricing, timelines — anything you'd like to know. What are you working on?",
      "Hey there! Great to have you here. Whether you're exploring a new app idea, need AI automation, or want a web portal, Kuvanta can help. What's on your mind?",
    ],
  },
  {
    patterns: [/\b(thank|thanks|appreciate|cheers|great|awesome|perfect|wonderful)\b/],
    responses: [
      "You're very welcome! Is there anything else you'd like to know? I'm happy to go deeper on services, timelines, tech stack, or pricing.",
      "Glad I could help! Feel free to ask anything else — or if you're ready to start a project, I can point you to our contact page.",
    ],
  },
  {
    patterns: [/\b(service|offer|what do you|what can you|provide|speciali[sz]e|capabilities|what does kuvanta)\b/],
    responses: [
      "Kuvanta Tech delivers four core services: Mobile App Development (React Native & Expo), Web Portals & Dashboards, AI Automation & Chatbots, and Tech Consultation. Every project is handled end-to-end — from architecture and design through deployment and support.",
      "We cover the full digital product spectrum: native mobile apps, responsive web platforms, custom AI integrations (chatbots, pipelines, LLMs), and strategic tech consulting. What type of solution are you exploring?",
    ],
  },
  {
    patterns: [/\b(mobile|app|ios|android|react native|expo|phone|smartphone)\b/],
    responses: [
      "Mobile is one of our core strengths. We build cross-platform apps using React Native and Expo, which means your app runs natively on both iOS and Android from a single codebase — cutting cost and time significantly. What kind of app are you envisioning?",
      "Our mobile team has shipped apps across e-commerce, healthcare, fintech, and more using React Native. We handle UI/UX design, backend integration, app store publishing, and post-launch support. What's your app idea?",
    ],
  },
  {
    patterns: [/\b(web|website|portal|dashboard|frontend|backend|full.?stack)\b/],
    responses: [
      "We build high-performance web portals and dashboards using modern stacks — React, Next.js, Node.js, and Supabase. From customer-facing platforms to internal admin tools, we design for scale and speed. What kind of web solution do you need?",
      "Web development at Kuvanta means clean architecture, fast load times, and intuitive interfaces. We handle everything from landing pages to complex multi-tenant portals. Can you tell me more about your project?",
    ],
  },
  {
    patterns: [/\b(ai|artificial intelligence|automation|bot|chatbot|llm|machine learning|smart|gpt|openai|nlp)\b/],
    responses: [
      "AI is at the heart of what we do. We've built chatbots like this one, automation pipelines, LLM integrations (OpenAI, Claude, custom models), smart recommendation engines, and document processing systems. What business problem are you looking to automate or enhance with AI?",
      "Our AI team specialises in practical, production-ready AI — not just experiments. That means chatbots trained on your brand, workflow automation that saves real hours, and smart analytics that surface actionable insights. What's the use case you have in mind?",
    ],
  },
  {
    patterns: [/\b(pric|cost|rate|fee|budget|invest|charge|quote|how much|afford|expensive|cheap)\b/],
    responses: [
      "Our pricing is scoped to your project. MVPs typically start from $5,000 and scale based on complexity and features. We also offer monthly retainers for teams that want ongoing development and support. Want me to point you to our team for a tailored quote?",
      "We offer both fixed-scope project pricing and flexible retainer models. A basic MVP starts around $5,000; full-scale products vary by scope. The best way to get an accurate number is a 30-minute discovery call — shall I help you set that up?",
    ],
  },
  {
    patterns: [/\b(time|timeline|long|week|month|fast|quick|duration|deliver|deadline|launch|how soon)\b/],
    responses: [
      "A typical MVP takes 6–10 weeks from kickoff to launch. We work in 2-week agile sprints with demos at the end of each sprint, so you see real progress continuously — not just at the end. Larger platforms can take 3–6 months. What's your target launch window?",
      "Speed depends on scope, but we're built to move fast without cutting corners. Simple apps ship in 6–8 weeks; complex platforms in 3–5 months. We can also phase the build so you get something live sooner while we continue building. What's your timeline looking like?",
    ],
  },
  {
    patterns: [/\b(process|how do you work|workflow|agile|sprint|methodology|approach|steps)\b/],
    responses: [
      "Our process has four phases: Discovery (understand your goals, users, and constraints), Design (wireframes, UI/UX prototypes), Build (agile sprints, bi-weekly demos), and Launch & Support (deployment, monitoring, iteration). You're involved at every stage — no black boxes.",
      "We kick off every project with a discovery session to align on goals and priorities. Then we move to design, development in sprints, and a staged launch. You get a dedicated point of contact and access to our project tracker throughout.",
    ],
  },
  {
    patterns: [/\b(tech|technology|stack|framework|language|tools|react|node|supabase|typescript)\b/],
    responses: [
      "Our core stack: React Native & Expo for mobile, React / Next.js for web, Node.js and Supabase for backends, TypeScript throughout, and a range of AI tools (OpenAI, LangChain, custom fine-tuned models). We choose the right tool for the job, not just what's trendy.",
      "We're technology-agnostic at the strategy level but opinionated at the execution level. We default to proven, maintainable stacks: TypeScript, React, Supabase, and cloud-native infrastructure. This keeps your codebase clean and easy to hand over or scale.",
    ],
  },
  {
    patterns: [/\b(support|maintain|maintenance|after|post.?launch|ongoing|update|bug|fix)\b/],
    responses: [
      "We don't disappear after launch. We offer post-launch support packages that cover bug fixes, performance monitoring, feature updates, and scaling. Many clients stay with us on retainer to keep their product evolving.",
      "Post-launch, you can choose a support retainer or request ad-hoc work. We monitor for issues, push updates, and are available for urgent fixes. Long-term product partnerships are something we genuinely value.",
    ],
  },
  {
    patterns: [/\b(team|who|people|developer|designer|founder|hire|staff|experience)\b/],
    responses: [
      "Kuvanta is a lean, senior-heavy team of engineers, designers, and AI specialists. We don't outsource work — every project is built in-house by people who care about quality. Our team has shipped products used by thousands of users across multiple industries.",
      "Our team blends product thinking with deep technical execution. Engineers, UX designers, and AI researchers work together on every project. You get direct access to the people building your product — no account managers in between.",
    ],
  },
  {
    patterns: [/\b(example|portfolio|case study|previous|past|work|project|client|built)\b/],
    responses: [
      "We've built e-commerce platforms, logistics dashboards, AI-powered customer support bots, healthcare appointment apps, and SaaS admin portals — across startups and established businesses. Check out our Portfolio section on the homepage for screenshots and details.",
      "Our portfolio spans mobile apps, web platforms, and AI tools across industries including retail, health, finance, and logistics. Head to the Portfolio section to see examples, or I can describe a specific type of project if you'd like.",
    ],
  },
  {
    patterns: [/\b(contact|reach|email|call|talk|meeting|consult|demo|appointment|schedule)\b/],
    responses: [
      "Ready to connect? You can reach us via the Contact section on our homepage, or just say the word and I'll point you there. We typically respond within a few hours and are happy to schedule a free 30-minute discovery call.",
      "The easiest way is through our Contact form — scroll to the bottom of the homepage. We respond quickly and usually suggest a short call to understand your project before anything else.",
    ],
  },
  {
    patterns: [/\b(why|choose|different|better|competitor|compare|unique|advantage|best)\b/],
    responses: [
      "A few things set Kuvanta apart: we're senior-only (no juniors learning on your dime), we're end-to-end (design through deployment), and we communicate like partners — not vendors. We push back when something won't work and suggest smarter paths when they exist.",
      "What makes Kuvanta different is the combination of technical depth and product thinking. We don't just write code — we help you make smart decisions about what to build and why. That's what gets products to market faster and keeps them growing.",
    ],
  },
  {
    patterns: [/\b(ecommerce|e-commerce|shop|store|checkout|payment|stripe|cart)\b/],
    responses: [
      "E-commerce is a strong area for us. We build full shopping experiences — product listings, smart search, cart, checkout with Stripe or other gateways, order management, and admin dashboards. Mobile-first, fast, and conversion-optimised. Tell me more about your store concept.",
    ],
  },
  {
    patterns: [/\b(startup|mvp|minimum viable|idea|prototype|early stage|launch idea)\b/],
    responses: [
      "Startups are our sweet spot. We've helped founders go from idea to working MVP in 6–10 weeks. We help you scope ruthlessly — build what validates your idea fastest, skip what doesn't. What's the core problem your startup is solving?",
      "If you're early-stage, we can help you figure out what to build first, then build it fast. We've taken many founders from napkin sketch to live product. What's your idea?",
    ],
  },
];

const FALLBACKS = [
  "That's a good question. To give you the most relevant answer, could you tell me a bit more about what you're trying to achieve? I want to make sure I point you in the right direction.",
  "I want to make sure I answer that properly. Are you asking about our services, a specific technology, timelines, or something else? Happy to go deep on any topic.",
  "Great — I'm here to help. Could you expand on that a little? Once I understand your context better, I can give you a much more specific answer.",
  "Kuvanta builds products that genuinely move the needle. To tailor my answer, could you share what industry or problem space you're working in?",
];

let fallbackIndex = 0;

const STOP_WORDS = new Set([
  'the','and','for','are','but','not','you','all','can','her','was','one',
  'our','out','had','have','has','with','this','that','from','they','will',
  'what','your','been','more','also','into','than','then','them','some',
  'its','when','who','how','about','which','their','there','would','could',
  'should','does','did','just','like','make','take','use','get','give',
  'know','think','see','look','come','want','tell','ask','seem','feel',
  'try','leave','call','keep','let','put','mean','become','show','hear',
]);

function searchKnowledgeBase(input: string, kb: string): string | null {
  if (!kb.trim()) return null;
  const rawWords = input.toLowerCase().split(/\s+/);
  const inputWords = rawWords.filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  if (inputWords.length === 0) return null;
  const sentences = kb
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15);
  const scored = sentences
    .map(s => {
      const sl = s.toLowerCase();
      const hits = inputWords.filter(w => sl.includes(w)).length;
      const ratio = hits / inputWords.length;
      return { s, hits, ratio };
    })
    .filter(x => x.hits > 0 && x.ratio >= 0.25)
    .sort((a, b) => b.ratio - a.ratio || b.hits - a.hits);
  if (scored.length === 0) return null;
  const top = scored.slice(0, 2).map(x => x.s).join(' ');
  return `Based on our knowledge base: ${top}`;
}

function generateResponse(input: string, turnCount: number, kb: string): string {
  if (turnCount === 0) {
    return "Hello! I'm the Kuvanta AI assistant. I can answer questions about our mobile apps, web portals, AI automation, pricing, timelines, and more. What are you working on?";
  }

  const kbAnswer = searchKnowledgeBase(input, kb);
  if (kbAnswer) return kbAnswer;

  const l = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.patterns.some(p => p.test(l))) {
      const idx = turnCount % rule.responses.length;
      return rule.responses[idx];
    }
  }
  const resp = FALLBACKS[fallbackIndex % FALLBACKS.length];
  fallbackIndex++;
  return resp;
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
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [turnCount, setTurnCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [kbInput, setKbInput] = useState('');
  const [kbFileName, setKbFileName] = useState('');
  const [kbSaved, setKbSaved] = useState(false);
  const [kbDragging, setKbDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (isListening || isSpeaking || isTyping) return;
    idleTimerRef.current = setTimeout(() => {
      if (!isListening && !isSpeaking && !isTyping && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch { }
      }
    }, 5000);
  };

  useEffect(() => {
    if (!hasStarted) return;
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [messages, isTyping, isSpeaking, isListening, hasStarted]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    const handler = () => resetIdleTimer();
    events.forEach(e => window.addEventListener(e, handler));
    return () => events.forEach(e => window.removeEventListener(e, handler));
  }, [isListening, isSpeaking, isTyping]);

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
      const response = generateResponse(text, turnCount + 1, knowledgeBase);
      setIsTyping(false);
      addBotMessage(response);
    }, delay);
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

  const handleKbFile = (file: File) => {
    if (!file || !file.name.match(/\.(txt|md)$/i)) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setKbInput(text);
      setKbFileName(file.name);
    };
    reader.readAsText(file);
  };

  const handleKbDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setKbDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleKbFile(file);
  };

  const handleKbSave = () => {
    setKnowledgeBase(kbInput);
    setKbSaved(true);
    setTimeout(() => setKbSaved(false), 2500);
  };

  const handleKbClear = () => {
    setKnowledgeBase('');
    setKbInput('');
    setKbFileName('');
    setKbSaved(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
                  {knowledgeBase ? 'Knowledge base active' : 'Online — ready to help'}
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
                <button key={i} className="demo-suggestion-btn" onClick={() => handleSend(p)}>
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
                  <strong>Knowledge base first</strong> — Searches your uploaded content before anything else
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

          <div className="demo-info-card demo-kb-card">
            <h3 className="demo-info-title">
              <FileText size={15} style={{ marginRight: 8, verticalAlign: 'middle', color: '#60a5fa' }} />
              Knowledge Base
            </h3>
            <p className="demo-info-body">
              Upload a <strong>.txt</strong> or <strong>.md</strong> file — or paste text — to teach the chatbot about your business. The bot will search this content first before using its built-in Kuvanta responses.
            </p>

            <div
              className={`demo-kb-dropzone${kbDragging ? ' dragging' : ''}${kbFileName ? ' has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setKbDragging(true); }}
              onDragLeave={() => setKbDragging(false)}
              onDrop={handleKbDrop}
              onClick={() => !kbFileName && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleKbFile(f); }}
              />
              {kbFileName ? (
                <div className="demo-kb-file-info">
                  <FileText size={16} />
                  <span className="demo-kb-filename">{kbFileName}</span>
                  <button
                    className="demo-kb-remove"
                    onClick={e => { e.stopPropagation(); handleKbClear(); }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="demo-kb-drop-hint">
                  <Upload size={18} />
                  <span>Drop a file or <u>browse</u></span>
                  <span className="demo-kb-drop-sub">.txt or .md files</span>
                </div>
              )}
            </div>

            <textarea
              className="demo-kb-textarea"
              placeholder="Or paste your knowledge base text here..."
              value={kbInput}
              onChange={e => setKbInput(e.target.value)}
              rows={5}
            />

            <div className="demo-kb-actions">
              {knowledgeBase && (
                <button className="demo-kb-clear-btn" onClick={handleKbClear}>
                  <X size={13} /> Clear
                </button>
              )}
              <button
                className={`demo-kb-save-btn${kbSaved ? ' saved' : ''}`}
                onClick={handleKbSave}
                disabled={!kbInput.trim()}
              >
                {kbSaved
                  ? <><CheckCircle size={14} /> Saved!</>
                  : <><Upload size={14} /> Apply to Bot</>
                }
              </button>
            </div>

            {knowledgeBase && (
              <div className="demo-kb-active-badge">
                <CheckCircle size={12} />
                <span>Knowledge base active — {knowledgeBase.split(/\s+/).length} words loaded</span>
              </div>
            )}
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
