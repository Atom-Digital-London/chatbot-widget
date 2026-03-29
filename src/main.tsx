import { render } from 'preact';
import { App } from './app.tsx';
import type { WidgetConfig } from './types.tsx';

const scriptTag = document.currentScript as HTMLScriptElement;

const config: WidgetConfig = {
  botId: scriptTag?.dataset.botId || 'default-bot',
  projectName: scriptTag?.dataset.projectName || 'Support Chat',
  primaryColor: scriptTag?.dataset.primaryColor || '#007bff',
  greeting: scriptTag?.dataset.greeting || 'Hello!',
  // Change this to your local Ollama address for now!
  apiHost: 'http://localhost:11434' 
};

// 1. Create the Host Element
const host = document.createElement('div');
host.id = 'chameleon-widget-root';
document.body.appendChild(host);

// 2. Attach the Shadow Root (The "Shield")
const shadowRoot = host.attachShadow({ mode: 'open' });

// 3. Create a container inside the shadow
const container = document.createElement('div');
shadowRoot.appendChild(container);

// 4. Render into the shadow container
render(<App config={config} />, container);