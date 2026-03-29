import { useState, useRef, useEffect } from 'preact/hooks';
import './index.css';
import type { Message, WidgetConfig } from './types';

export function App({ config }: { config: WidgetConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: config.greeting, role: 'assistant', timestamp: Date.now() }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue;
    setInputValue(''); // Clear input immediately

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userContent,
      role: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call local Ollama (Phi-3)
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "phi3:mini",
          messages: [
            { 
              role: "system", 
              content: `You are a helpful assistant for ${config.projectName}. Keep answers short.` 
            },
            { role: "user", content: userContent }
          ],
          stream: false,
        }),
      });

      const data = await response.json();
      
      // 3. Add AI Message
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message.content,
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error',
        content: "I can't reach my brain. Is Ollama running?",
        role: 'assistant',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="widget-scope" style={{ '--primary-color': config.primaryColor } as any}>
      {isOpen ? (
        <div className="chat-window">
          <div className="header" style={{ background: 'var(--primary-color)' }}>
            <h3>{config.projectName}</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="messages">
            {messages.map(m => (
              <div key={m.id} className={`msg ${m.role}`}>
                <div className="msg-content">{m.content}</div>
              </div>
            ))}
            {isLoading && <div className="msg assistant">...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input 
              type="text" 
              value={inputValue}
              onInput={(e) => setInputValue((e.target as HTMLInputElement).value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type here..." 
            />
            <button onClick={handleSend} disabled={isLoading}>Send</button>
          </div>
        </div>
      ) : (
        <button 
          className="launcher" 
          onClick={() => setIsOpen(true)}
          style={{ background: 'var(--primary-color)' }}
        >
          💬
        </button>
      )}
    </div>
  );
}