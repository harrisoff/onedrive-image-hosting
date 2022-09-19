import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import 'antd/dist/antd.css';

import App from './App'

Sentry.init({
  dsn: "https://7c8198a0238d44ab99b3d185e6c87e01@o552602.ingest.sentry.io/6755290",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 0.5,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
