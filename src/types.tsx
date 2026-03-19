export interface WidgetConfig {
  botId: string;
  projectName: string;
  primaryColor: string;
  greeting: string;
  apiHost: string; // Where to send chat messages
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}