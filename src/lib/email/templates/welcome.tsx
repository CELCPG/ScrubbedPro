import { Heading, Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './layout';

interface WelcomeEmailProps {
  userName: string;
  profileUrl: string;
}

export function WelcomeEmail({ userName, profileUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout>
      <Heading
        style={{
          color: '#0B1C2D',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '16px',
          marginTop: '0',
        }}
      >
        You're in. Your data isn't.
      </Heading>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        Welcome to Scrubbed.Pro, {userName}.
      </Text>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '16px',
        }}
      >
        Your personal data is scattered across hundreds of data broker sites — sites you've probably never heard of, selling details about you to anyone willing to pay.
      </Text>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        <strong>Here's what we do:</strong> We scan, identify, and remove your data from these brokers — and we keep scanning to catch re-listings. You sit back. We handle the rest.
      </Text>

      <Section style={{ marginBottom: '32px' }}>
        <Button
          href={profileUrl}
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            padding: '14px 28px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          Set up your profile
        </Button>
      </Section>

      <Text
        style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '0',
        }}
      >
        Your profile helps us know exactly what to look for and where. The more complete your profile, the more brokers we can cover.
      </Text>
    </EmailLayout>
  );
}