import { Html, Head, Body, Container, Section, Text, Link, Hr } from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
}

const styles = {
  primaryColor: '#0B1C2D',
  accentColor: '#2563EB',
  backgroundColor: '#FFFFFF',
  textColor: '#1F2937',
  mutedColor: '#6B7280',
  container: {
    padding: '40px 20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  header: {
    backgroundColor: '#0B1C2D',
    padding: '24px',
    borderRadius: '8px 8px 0 0',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: '24px',
    fontWeight: '700' as const,
    letterSpacing: '-0.5px',
  },
  logoAccent: {
    color: '#2563EB',
  },
  body: {
    backgroundColor: '#FFFFFF',
    padding: '32px 24px',
  },
  footer: {
    backgroundColor: '#F9FAFB',
    padding: '24px',
    borderRadius: '0 0 8px 8px',
  },
  footerText: {
    color: '#6B7280',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  footerLink: {
    color: '#2563EB',
    textDecoration: 'none',
  },
};

export function EmailLayout({ children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F3F4F6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logoText}>
              Scrubbed<span style={styles.logoAccent}>.Pro</span>
            </Text>
          </Section>

          {/* Body */}
          <Section style={styles.body}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Scrubbed.Pro — Data removal made simple.
            </Text>
            <Text style={{ ...styles.footerText, marginTop: '8px' }}>
              Need help? Contact us at{' '}
              <Link href="mailto:support@scrubbed.pro" style={styles.footerLink}>
                support@scrubbed.pro
              </Link>
            </Text>
            <Text style={{ ...styles.footerText, marginTop: '16px' }}>
              <Link href="#" style={styles.footerLink}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href="#" style={styles.footerLink}>
                Privacy Policy
              </Link>
              {' · '}
              <Link href="#" style={styles.footerLink}>
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}