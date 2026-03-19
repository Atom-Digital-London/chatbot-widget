import { useState } from 'preact/hooks';

import './index.css';
import type { Message, WidgetConfig } from './types';

export function App({ config }: { config: WidgetConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages] = useState<Message[]>([
    { id: '1', content: config.greeting, role: 'assistant', timestamp: Date.now() }
  ]);

  // Apply dynamic theme via CSS variables
  const themeStyles = {
    '--primary-color': config.primaryColor,
  } as any;

  return (
    <div className="widget-scope" style={themeStyles}>
      {isOpen ? (
        <div className="chat-window">
          <div className="header">
            <h3>{config.projectName}</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="messages">
            {messages.map(m => (
              <div key={m.id} className={`msg ${m.role}`}>{m.content}</div>
            ))}
          </div>
          <div className="input-area">
            <input type="text" placeholder="Type here..." />
          </div>
        </div>
      ) : (
        <button className="launcher" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
}