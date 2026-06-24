import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';

const AIChatbot = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm Ashiq's virtual assistant. Ask me anything about his architecture, skills, or WIZZO CRM experience!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm still learning about that. Try asking about 'WIZZO CRM', 'Edge AI', or 'AWS'.";
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('wizzo')) {
        reply = "Ashiq architected the WIZZO CRM backend! He built real-time WebSocket connections (Socket.io) and integrated Google GenAI for instant email parsing, plus complex MySQL 9 triggers for attendance.";
      } else if (lowerInput.includes('edge') || lowerInput.includes('yolo') || lowerInput.includes('hardware') || lowerInput.includes('raspberry')) {
        reply = "He loves Edge AI! Ashiq deployed YOLO pipelines on a Raspberry Pi AI HAT+ boasting 26 TOPS of compute. Everything runs locally at 30FPS without relying on the cloud.";
      } else if (lowerInput.includes('aws') || lowerInput.includes('devops')) {
        reply = "For DevOps, Ashiq orchestrated AWS EC2 instances, built deep auditing scripts to hunt 'Ghost Drives' (unmounted EBS volumes), and created multi-cloud threshold daemons.";
      } else if (lowerInput.includes('hire') || lowerInput.includes('contact')) {
        reply = "You can contact him directly at Ashiqam75@gmail.com or scroll to the bottom of the page to send a secure message!";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        reply = "Hello! How can I help you understand Ashiq's technical portfolio?";
      }

      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  if (isMobile) return null; // Hide on mobile for better UX

  return (
    <div style={{ position: 'fixed', bottom: '2rem', left: '2rem', zIndex: 10000 }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="btn btn-pill" 
            style={{ background: 'var(--accent-glow-strong)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{ 
              width: '350px', height: '500px', 
              background: 'rgba(15, 15, 20, 0.98)', 
              border: '1px solid var(--accent-glow)', 
              borderRadius: '24px', 
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#fff', fontWeight: 700 }}>
                <Cpu size={20} color="var(--accent-glow-strong)" />
                Ask Ashiq AI
              </div>
              <X size={20} style={{ cursor: 'pointer', color: '#aaa' }} onClick={() => setIsOpen(false)} />
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    background: m.role === 'user' ? 'var(--accent-glow-strong)' : 'rgba(255,255,255,0.1)', 
                    color: '#fff', padding: '0.8rem 1rem', borderRadius: '16px', 
                    borderBottomRightRadius: m.role === 'user' ? 0 : '16px',
                    borderBottomLeftRadius: m.role === 'ai' ? 0 : '16px',
                    maxWidth: '85%', fontSize: '0.9rem', lineHeight: 1.5
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.8rem 1rem', borderRadius: '16px', borderBottomLeftRadius: 0 }}>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-block' }}>...</motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my projects..." 
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.8rem', color: '#fff', outline: 'none' }} 
              />
              <button 
                onClick={handleSend}
                style={{ background: 'var(--accent-glow-strong)', color: '#fff', border: 'none', borderRadius: '12px', width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot;
