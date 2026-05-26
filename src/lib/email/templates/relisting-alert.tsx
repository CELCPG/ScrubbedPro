import { Heading, Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './layout';

interface RelistingAlertEmailProps {
  userName: string;
  brokerName: string;
  scanUrl: string;
}

export function RelistingAlertEmail({ userName, brokerName, scanUrl }: RelistingAlertEmailProps) {
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
        Data Re-detected
      </Heading>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        Hi {userName},
      </Text>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '16px',
        }}
      >
        We caught your data back on <strong>{brokerName}</strong>.
      </Text>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        Don't worry — we've already re-submitted the opt-out request. Some brokers re-list data even after you've opted out. It's frustrating, but it's exactly why we keep scanning.
      </Text>

      {/* Alert Box */}
      <Section
        style={{
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          borderLeft: '4px solid #D97706',
        }}
      >
        <Text
          style={{
            color: '#92400E',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '0',
            lineHeight: '1.5',
          }}
        >
          We've automatically initiated a new removal request. Most brokers honor opt-outs within 14-30 days. We'll notify you once the removal is confirmed.
        </Text>
      </Section>

      {/* CTA */}
      <Section style={{ marginBottom: '24px' }}>
        <Button
          href={scanUrl}
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
          View details
        </Button>
      </Section>

      <Text
        style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        Your data removal is our top priority. We're watching {brokerName} — and every other broker in our network.
      </Text>
    </EmailLayout>
  );
}