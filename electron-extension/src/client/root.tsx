
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './root_dist.css';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<App />);