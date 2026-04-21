import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import { useTheme } from './context/ThemeContext';

function App() {
  const { theme } = useTheme();

  return (
    <Theme
      appearance={theme}
      accentColor="violet"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '16px 0 32px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px' }}>
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <WhatsAppWidget />
      <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
    </Theme>
  );
}

export default App;
