import { render } from 'preact';
import { App } from './app.tsx';
import type { WidgetConfig } from './types.tsx';
 // Make sure you imported your interface

// 1. Get the script tag that loaded this file
const scriptTag = document.currentScript as HTMLScriptElement;

// 2. Build the config object from the data-attributes
// If they aren't provided, we set defaults
const config: WidgetConfig = {
  botId: scriptTag?.dataset.botId || 'default-bot',
  projectName: scriptTag?.dataset.projectName || 'Support Chat',
  primaryColor: scriptTag?.dataset.primaryColor || '#007bff',
  greeting: scriptTag?.dataset.greeting || 'Hello!',
  apiHost: 'https://api.yourdomain.com'
};

const container = document.createElement('div');
document.body.appendChild(container);

// 3. FIX: Pass the 'config' prop here!
render(<App config={config} />, container);