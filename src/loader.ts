import { render, h } from 'preact';
import { App } from './app';
import type { WidgetConfig } from './types';

const initWidget = () => {
  // 1. Find the script tag and its data attributes
  const script = document.currentScript as HTMLScriptElement;
  const config: WidgetConfig = {
    botId: script?.dataset.botId || 'default',
    projectName: script?.dataset.projectName || 'AI Assistant',
    primaryColor: script?.dataset.primaryColor || '#007bff',
    greeting: script?.dataset.greeting || 'How can I help you?',
    apiHost: 'https://api.yourdomain.com'
  };

  // 2. Create the Shadow DOM container
  const host = document.createElement('div');
  host.id = 'my-chatbot-container';
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: 'open' });
  const rootElement = document.createElement('div');
  shadowRoot.appendChild(rootElement);

  // 3. Render the Preact App into the Shadow DOM
  render(h(App, { config }), rootElement);
};

// Initialize when the DOM is ready
if (document.readyState === 'complete') {
  initWidget();
} else {
  window.addEventListener('load', initWidget);
}