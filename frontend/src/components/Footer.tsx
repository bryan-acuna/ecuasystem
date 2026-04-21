import { Text } from '@radix-ui/themes';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{
      textAlign: 'center',
      background: '#0f172a',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '16px 24px',
    }}>
      <Text size="2" style={{ color: '#94a3b8' }}>
        Ecuasystems &copy; {currentYear}
      </Text>
    </footer>
  );
};

export default Footer;
