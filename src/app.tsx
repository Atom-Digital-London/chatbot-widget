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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue;
    setInputValue(''); 

    // 1. Add User Message to UI
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userContent,
      role: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Call your Hetzner Middleware 
      // config.apiHost should now be "https://your-api-domain.com"
      const response = await fetch(`${config.apiHost}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          customerId: config.botId // Tells backend which PDF to search
        }),
      });

      if (!response.ok) throw new Error("Backend unreachable");

      const data = await response.json();
      
      // 3. Add AI Message from PDF Context
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: data.text, // The field returned by your new Node.js server
        role: 'assistant',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'error',
        content: "Sorry, I'm having trouble connecting to my knowledge base.",
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
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about our services..." 
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