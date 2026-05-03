import { useState, useEffect, useRef } from 'react';
import { PhoneOff, Send, Mic, MicOff, X, Phone } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { sendEmail, ENQUIRY_RECIPIENT } from '../services/emailService';
import { fetchKnowledgeBase } from '../services/knowledgeBaseService';
import './ChatbotWidget.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

type WidgetState = 'collapsed' | 'popup' | 'chat';

export const ChatbotWidget = () => {
  const [widgetState, setWidgetState] = useState<WidgetState>('collapsed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [customerDetailsSet, setCustomerDetailsSet] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conversationHistoryRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);

  useEffect(() => {
    fetchKnowledgeBase().then(record => {
      if (record && record.content) setKnowledgeBase(record.content);
    });
  }, []);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    conversationHistoryRef.current = [
      ...conversationHistoryRef.current,
      { role: 'user', content: userMessage },
    ];

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistoryRef.current, knowledgeBase }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const reply: string = data.reply ?? "I'm having trouble responding right now. Please try again.";

      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { role: 'assistant', content: reply },
      ];

      return reply;
    } catch {
      return "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (widgetState === 'chat') scrollToBottom();
  }, [messages, widgetState]);

  useEffect(() => {
    if (isListening && inputValue.trim()) {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => {
        handleSend(inputValue);
      }, 3000);
    }
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [inputValue, isListening]);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalStr += event.results[i][0].transcript;
        }
        if (finalStr) setInputValue(prev => prev + ' ' + finalStr.trim());
      };
      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = ['Microsoft Zira', 'Google US English Female', 'Google UK English Female', 'Samantha', 'Karen', 'Victoria', 'Fiona', 'Female'];
        let targetVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));
        if (!targetVoice) targetVoice = voices.find(v => v.name.includes('Female') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
        if (targetVoice) utterance.voice = targetVoice;
        utterance.pitch = 1.15;
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (!isListening && recognitionRef.current) {
            try { recognitionRef.current.start(); setIsListening(true); } catch (e) {}
          }
        };
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue('');
      window.speechSynthesis.cancel();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;
    setCustomerDetailsSet(true);
    if (messages.length === 0) {
      const welcomeText = "Welcome to Kuvanta e-support! I'm here to help. What can I assist you with today?";
      setMessages([{ sender: 'bot', text: welcomeText }]);
      conversationHistoryRef.current = [{ role: 'assistant', content: welcomeText }];
      speak(welcomeText);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputValue;
    if (!textToSend.trim() || isThinking) return;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setMessages(prev => [...prev, { sender: 'user' as const, text: textToSend }]);
    setInputValue('');
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
    setIsThinking(true);
    const replyText = await generateAIResponse(textToSend);
    setIsThinking(false);
    setMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
    speak(replyText);
  };

  const generateSummary = () => {
    const userMessages = messages.filter(m => m.sender === 'user').map(m => m.text).join(' ');
    if (userMessages.length === 0) return "The client initiated the chat but concluded without providing specific project details.";
    const keywords: string[] = [];
    const lower = userMessages.toLowerCase();
    if (lower.includes('app') || lower.includes('mobile') || lower.includes('ios')) keywords.push("Mobile App Development");
    if (lower.includes('web') || lower.includes('portal')) keywords.push("Web Architecture");
    if (lower.includes('ai') || lower.includes('automation') || lower.includes('bot')) keywords.push("AI Integration");
    if (lower.includes('cloud') || lower.includes('deploy')) keywords.push("Cloud Infrastructure");
    return `Client ${customerName || ''} engaged our AI architect regarding ${keywords.length > 0 ? keywords.join(", ") : "digital solutions"}. They shared the following core requirement: "${userMessages.substring(0, 150)}${userMessages.length > 150 ? '...' : ''}".`;
  };

  const endConversation = () => {
    const today = new Date().toLocaleString();
    const summary = generateSummary();
    let transcriptText = `Dear Kuvanta Tech Sales Support Team,\n\nPlease find the details of a new incoming business lead captured by the AI support agent on ${today}.\n\nEXECUTIVE SUMMARY\n-------------------------------------------------------\n${summary}\n\nCLIENT CONTACT DETAILS\n-------------------------------------------------------\nName:          ${customerName || 'Not Provided'}\nEmail:         ${customerEmail}\nPhone:         ${customerPhone || 'Not Provided'}\nDate/Time:     ${today}\n\nRECOMMENDED ACTION ITEMS\n-------------------------------------------------------\n1. Review the verbatim discussion log below to capture granular project technical constraints.\n2. Formulate an initial technical proposal or consultation agenda.\n3. Schedule follow-up outreach with ${customerName || 'the client'} within standard SLAs.\n\nVERBATIM DISCUSSION LOG\n-------------------------------------------------------\n\n`;
    messages.forEach(m => {
      const senderLabel = m.sender === 'user' ? (customerName || 'CLIENT') : 'KT SUPPORT';
      transcriptText += `${senderLabel.toUpperCase()}:\n${m.text}\n\n`;
    });
    const subject = `KT_ENQUIRY: Chatbot Lead - ${customerName || customerEmail}`;
    sendEmail({ toEmail: ENQUIRY_RECIPIENT, ccEmail: customerEmail, subject, body: transcriptText });
    useLeadStore.getState().addLead({ source: 'Chatbot', name: customerName || 'Not Provided', email: customerEmail, phone: customerPhone || 'Not Provided', serviceType: 'AI Chat Lead', summary, fullTranscript: transcriptText });
    setWidgetState('collapsed');
    window.speechSynthesis.cancel();
    if (isListening) recognitionRef.current?.stop();
  };

  const handleClose = () => {
    setWidgetState('collapsed');
    window.speechSynthesis.cancel();
    if (isListening) recognitionRef.current?.stop();
  };

  const handleFabClick = () => {
    setWidgetState(prev => prev === 'popup' ? 'collapsed' : 'popup');
  };

  return (
    <div className="chatbot-widget-container">
      {widgetState === 'popup' && (
        <div className="chatbot-popup">
          <button className="chatbot-close-btn" onClick={handleClose} aria-label="Close">
            <X size={15} />
          </button>
          <div className="chatbot-popup-header">
            <div className="chatbot-popup-avatar">
              <div className="chatbot-fab-orb-small" />
            </div>
            <span className="chatbot-popup-text">Need help from kuvanta e-support?</span>
          </div>
          <button className="chatbot-popup-cta" onClick={() => setWidgetState('chat')}>
            <Phone size={16} />
            Get support
          </button>
        </div>
      )}

      {widgetState === 'chat' && (
        <div className="chatbot-expanded shadow-2xl">
          <button className="chatbot-close-btn" onClick={handleClose} aria-label="Close support chat">
            <X size={16} />
          </button>
          {!customerDetailsSet ? (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Please provide your details</h3>
              <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Name (Required)</label>
                <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Email (Required)</label>
                <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />
                <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Phone (Optional)</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />
                <button type="submit" style={{ marginTop: '20px', padding: '12px', background: 'linear-gradient(135deg, #7b5fff, #4f46e5)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'box-shadow 0.2s', border: 'none', boxShadow: '0 4px 15px rgba(123,95,255,0.4)' }}>Start Chat</button>
              </form>
            </div>
          ) : (
            <>
              <div className="chatbot-orb-container">
                <div className={`siri-orb-large ${isSpeaking ? 'speaking' : ''}`} />
              </div>
              <div className="chatbot-actions-center">
                <button className="chatbot-end-call" onClick={endConversation} title="End chat & send minutes">
                  <PhoneOff size={22} />
                </button>
              </div>
              <div className="chatbot-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.sender}`}>
                    <span className="msg-sender-label">
                      {msg.sender === 'bot' ? 'KT Support' : (customerName || 'Customer')}
                    </span>
                    <div className="msg-bubble">{msg.text}</div>
                  </div>
                ))}
                {isThinking && (
                  <div className="chat-message bot">
                    <span className="msg-sender-label">KT Support</span>
                    <div className="msg-bubble msg-thinking">
                      <span className="thinking-dot" />
                      <span className="thinking-dot" />
                      <span className="thinking-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="chatbot-input-area">
                <button className={`chat-mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleListen}>
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                  placeholder="Type or speak a message..."
                  className="chat-input"
                />
                <button className="chat-send-btn" onClick={() => handleSend()}>
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {widgetState !== 'chat' && (
        <button
          className={`chatbot-fab ${widgetState === 'popup' ? 'chatbot-fab--active' : ''}`}
          onClick={handleFabClick}
          aria-label="Open support chat"
        >
          <Phone size={22} color="#fff" strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
