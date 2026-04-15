import { useState, useEffect, useRef } from 'react';
import { PhoneOff, Send, Mic, MicOff, X } from 'lucide-react';
import { useLeadStore } from '../store/leadStore';
import { sendEmail } from '../services/emailService';
import './ChatbotWidget.css';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export const ChatbotWidget = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [customerDetailsSet, setCustomerDetailsSet] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateAIResponse = (input: string, historyLength: number) => {
    const lowerInput = input.toLowerCase();
    
    if (historyLength <= 2) {
      if (lowerInput.includes('app') || lowerInput.includes('mobile')) {
        return "Mobile applications are a fantastic avenue. As a solution architect, I'd suggest a robust cross-platform stack to maximize your reach while minimizing costs. Which platforms are your primary focus: iOS, Android, or both?";
      } else if (lowerInput.includes('web') || lowerInput.includes('portal')) {
        return "A scalable web portal can truly modernize your operations. We build secure, high-performance architectures using modern frameworks. Could you tell me more about the core functionalities and the user volume you anticipate?";
      } else if (lowerInput.includes('ai') || lowerInput.includes('automation') || lowerInput.includes('bot')) {
        return "AI automation is our specialty. Integrating cutting-edge models can dramatically reduce overhead and boost efficiency. Let's dig deeper—what specific bottlenecks or repetitive tasks are you hoping to eliminate with AI?";
      } else {
        return "That sounds like a fascinating opportunity. To help us pitch the most effective, high-ROI technical solution for your business, could you describe the main problem this project aims to solve?";
      }
    } else if (historyLength <= 4) {
      return "Excellent insight. At Kuvanta Tech, we specialize in translating complex requirements like these into elegant, enterprise-grade realities. To align our engineering team's approach, what is your ideal timeframe for launching a minimum viable product?";
    } else if (historyLength <= 6) {
      return "Understood. Speed to market combined with flawless execution is our promise. I have everything I need to prepare a comprehensive technical briefing for our senior directors. Would you like to share any budget constraints or compliance requirements before I close the file?";
    } else {
      return "Thank you for all this valuable information. I've documented our entire architectural discussion. Our executive team will review your needs and reach out via the email you provided to schedule a formal pitch. Whenever you're ready, simply click the red 'End call' button to securely finalize and distribute these minutes.";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (expanded) {
      scrollToBottom();
    }
  }, [messages, expanded]);

  // Handle auto-send after a 3 second pause
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
      recognitionRef.current.continuous = true; // Keep listening until explicitly stopped
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
             finalStr += event.results[i][0].transcript;
          }
        }
        if (finalStr) {
           setInputValue(prev => prev + ' ' + finalStr.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      // Load voices to prevent delay
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setTimeout(() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        
        // Prefer soft-spoken, female, professional voices
        const preferredVoices = ['Microsoft Zira', 'Google US English Female', 'Google UK English Female', 'Samantha', 'Karen', 'Victoria', 'Fiona', 'Female'];
        let targetVoice = voices.find(v => preferredVoices.some(name => v.name.includes(name)));
        
        // Fallback to any english voice if no specific female matched
        if (!targetVoice) {
           targetVoice = voices.find(v => v.name.includes('Female') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
        }

        if (targetVoice) utterance.voice = targetVoice;

        utterance.pitch = 1.15; // slightly higher pitch for sweetness
        utterance.rate = 0.95;  // slightly slower for softer pronunciation
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
           setIsSpeaking(false);
           // Auto-restart listening after bot speaks so user doesn't have to keep clicking mic
           if (!isListening && recognitionRef.current) {
             try {
               recognitionRef.current.start();
               setIsListening(true);
             } catch (e) {
               console.error("Could not auto-start mic", e);
             }
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

  const handleExpand = () => {
    setExpanded(true);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;
    setCustomerDetailsSet(true);
    if (messages.length === 0) {
      const welcomeText = "Welcome to Kuvanta e-support. I am here to assist you. What services are you looking for today?";
      setMessages([{ sender: 'bot', text: welcomeText }]);
      speak(welcomeText);
    }
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : inputValue;
    if (!textToSend.trim()) return;

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    setMessages(prev => [...prev, { sender: 'user' as const, text: textToSend }]);
    setInputValue('');
    if (isListening) {
       recognitionRef.current?.stop();
       setIsListening(false);
    }

    const currentLength = messages.length + 1;

    // Mock AI response
    setTimeout(() => {
      const replyText = generateAIResponse(textToSend, currentLength);
      setMessages(prev => [...prev, { sender: 'bot', text: replyText }]);
      speak(replyText);
    }, 1500);
  };

  const generateSummary = () => {
    const userMessages = messages.filter(m => m.sender === 'user').map(m => m.text).join(' ');
    if (userMessages.length === 0) return "The client initiated the chat but concluded without providing specific project details.";
    
    let keywords = [];
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
    
    let transcriptText = `Dear Kuvanta Tech Sales Support Team,\n\n`;
    transcriptText += `Please find the details of a new incoming business lead captured by the AI support agent on ${today}.\n\n`;
    
    transcriptText += `EXECUTIVE SUMMARY\n`;
    transcriptText += `-------------------------------------------------------\n`;
    transcriptText += `${summary}\n\n`;

    transcriptText += `CLIENT CONTACT DETAILS\n`;
    transcriptText += `-------------------------------------------------------\n`;
    transcriptText += `Name:          ${customerName || 'Not Provided'}\n`;
    transcriptText += `Email:         ${customerEmail}\n`;
    transcriptText += `Phone:         ${customerPhone || 'Not Provided'}\n`;
    transcriptText += `Date/Time:     ${today}\n\n`;

    transcriptText += `RECOMMENDED ACTION ITEMS\n`;
    transcriptText += `-------------------------------------------------------\n`;
    transcriptText += `1. Review the verbatim discussion log below to capture granular project technical constraints.\n`;
    transcriptText += `2. Formulate an initial technical proposal or consultation agenda.\n`;
    transcriptText += `3. Schedule follow-up outreach with ${customerName || 'the client'} within standard SLAs.\n\n`;

    transcriptText += `VERBATIM DISCUSSION LOG\n`;
    transcriptText += `-------------------------------------------------------\n\n`;
    
    messages.forEach(m => {
       const senderLabel = m.sender === 'user' ? (customerName || 'CLIENT') : 'KT SUPPORT';
       transcriptText += `${senderLabel.toUpperCase()}:\n${m.text}\n\n`;
    });

    const subject = `Business Lead & Discovery Minutes: ${customerName || customerEmail}`;
    
    // Send via EmailJS (falls back to mailto if not configured)
    sendEmail({
      toEmail: 'kuvanta.tech@gmail.com',
      ccEmail: customerEmail,
      subject,
      body: transcriptText
    });
    
    // Save to dashboard
    useLeadStore.getState().addLead({
        source: 'Chatbot',
        name: customerName || 'Not Provided',
        email: customerEmail,
        phone: customerPhone || 'Not Provided',
        serviceType: 'AI Chat Lead',
        summary: summary,
        fullTranscript: transcriptText
    });
    
    setExpanded(false);
    window.speechSynthesis.cancel();
    if (isListening) recognitionRef.current?.stop();
  };

  return (
    <div className={`chatbot-widget-container ${expanded ? 'expanded' : ''}`}>
      {!expanded ? (
        <button className="chatbot-fab" onClick={handleExpand} aria-label="Open support chat">
          <div className="chatbot-fab-orb" />
        </button>
      ) : (
         <div className="chatbot-expanded shadow-2xl">
            <button className="chatbot-close-btn" onClick={() => setExpanded(false)} aria-label="Close support chat">
              <X size={16} />
            </button>
            { !customerDetailsSet ? (
               <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>Please provide your details</h3>
                  <form onSubmit={handleDetailsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Name (Required)</label>
                     <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />

                     <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Email (Required)</label>
                     <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />
                     
                     <label style={{ fontSize: '14px', fontWeight: 500, color: '#ccc' }}>Phone (Optional)</label>
                     <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '14px', color: '#fff', background: 'rgba(255,255,255,0.05)' }} />

                     <button type="submit" style={{ marginTop: '20px', padding: '12px', background: 'linear-gradient(135deg, #a482ff, #6231ff)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'box-shadow 0.2s', border: 'none', boxShadow: '0 4px 15px rgba(164, 130, 255, 0.4)' }}>Start Chat</button>
                  </form>
               </div>
       ) : (
               <>
                  <div className="chatbot-orb-container">
                     <div className={`siri-orb-large ${isSpeaking ? 'speaking' : ''}`}></div>
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
                     <div ref={messagesEndRef} />
                  </div>

                  <div className="chatbot-input-area">
                     <button className={`chat-mic-btn ${isListening ? 'listening' : ''}`} onClick={toggleListen}>
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                     </button>
                     <input 
                       type="text" 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
    </div>
  );
};
