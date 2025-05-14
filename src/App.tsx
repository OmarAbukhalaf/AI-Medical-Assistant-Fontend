
import { ToastProvider } from './components/toast';
import Index from './pages/Index';

function App() {
  return (
    <ToastProvider>
      <Index />
    </ToastProvider>
  );
}

export default App;
