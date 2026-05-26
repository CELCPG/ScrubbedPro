import { Heading, Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './layout';

interface RemovalVerifiedEmailProps {
  userName: string;
  brokerName: string;
  fieldsExposed: string[];
  scanUrl: string;
}

export function RemovalVerifiedEmail({
  userName,
  brokerName,
  fieldsExposed,
  scanUrl,
}: RemovalVerifiedEmailProps) {
  return (
    <EmailLayout>
      {/* Checkmark Header */}
      <Section
        style={{
          textAlign: 'center' as const,
          marginBottom: '24px',
        }}
      >
        <Text
          style={{
            color: '#059669',
            fontSize: '48px',
            marginBottom: '0',
          }}
        >
          ✓
        </Text>
      </Section>

      <Heading
        style={{
          color: '#0B1C2D',
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          marginTop: '0',
          textAlign: 'center' as const,
        }}
      >
        Data Removed
      </Heading>

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
          textAlign: 'center' as const,
        }}
      >
        Hi {userName},
      </Text>

      <Text
        style={{
          color: '#059669',
          fontSize: '18px',
          fontWeight: '600',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        Your data has been removed from {brokerName}.
      </Text>

      {/* Fields that were exposed */}
      {fieldsExposed.length > 0 && (
        <Section
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <Text
            style={{
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '12px',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}
          >
            Fields that were exposed
          </Text>
          {fieldsExposed.map((field, index) => (
            <Text
              key={index}
              style={{
                color: '#1F2937',
                fontSize: '14px',
                lineHeight: '1.5',
                marginBottom: index < fieldsExposed.length - 1 ? '4px' : '0',
              }}
            >
              • {field}
            </Text>
          ))}
        </Section>
      )}

      <Text
        style={{
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        We successfully submitted an opt-out request on your behalf. {brokerName} is required to honor this request under their legal obligations.
      </Text>

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
          View your dashboard
        </Button>
      </Section>

      <Text
        style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        We'll continue monitoring {brokerName} to catch any re-listings. If your data appears again, we'll automatically submit another removal request.
      </Text>
    </EmailLayout>
  );
}