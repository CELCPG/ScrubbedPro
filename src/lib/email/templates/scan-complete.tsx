import { Heading, Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './layout';

interface ScanCompleteEmailProps {
  userName: string;
  exposureScore: number;
  riskTier: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  listingsFound: number;
  scanUrl: string;
}

const riskColors = {
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  MEDIUM: '#D97706',
  LOW: '#059669',
};

const riskDescriptions = {
  CRITICAL: 'Your data is exposed across many sites. Immediate action is critical.',
  HIGH: 'Significant exposure detected. We recommend acting soon.',
  MEDIUM: 'Moderate exposure found. Basic protective measures in place.',
  LOW: 'Minimal exposure. Keep monitoring to stay protected.',
};

export function ScanCompleteEmail({
  userName,
  exposureScore,
  riskTier,
  listingsFound,
  scanUrl,
}: ScanCompleteEmailProps) {
  const isUrgent = riskTier === 'CRITICAL' || riskTier === 'HIGH';

  return (
    <EmailLayout>
      <Heading
        style={{
          color: '#0B1C2D',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          marginTop: '0',
        }}
      >
        Scan Complete
      </Heading>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        Hi {userName}, your scan results are in.
      </Text>

      {/* Score Section */}
      <Section
        style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
          textAlign: 'center' as const,
        }}
      >
        <Text
          style={{
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          Exposure Score
        </Text>
        <Text
          style={{
            color: riskColors[riskTier],
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '8px',
          }}
        >
          {exposureScore}
        </Text>
        <Text
          style={{
            color: riskColors[riskTier],
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '8px',
          }}
        >
          {riskTier} RISK
        </Text>
        <Text
          style={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
        >
          {listingsFound} listing{listingsFound !== 1 ? 's' : ''} found across data broker sites
        </Text>
      </Section>

      {/* Risk Description */}
      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        {riskDescriptions[riskTier]}
      </Text>

      {/* Urgency Copy for Critical/High */}
      {isUrgent && (
        <Text
          style={{
            color: riskColors[riskTier],
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.6',
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#FEF2F2',
            borderRadius: '6px',
            borderLeft: `4px solid ${riskColors[riskTier]}`,
          }}
        >
          We found your data exposed on {listingsFound} site{listingsFound !== 1 ? 's' : ''}. Every moment it's there, it can be bought and sold. Let's get it removed — click below to see your results.
        </Text>
      )}

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
          View your results
        </Button>
      </Section>

      <Text
        style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        We'll automatically submit removal requests to the broker sites where your data was found. You can track progress in your dashboard.
      </Text>
    </EmailLayout>
  );
}