import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

function ToasterWithTheme() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#1a1f2e' : '#ffffff',
          color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
          border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#2a9df4', secondary: '#fff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
          <ToasterWithTheme />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
