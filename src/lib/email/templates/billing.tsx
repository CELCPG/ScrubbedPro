import { Heading, Text, Button, Section, Hr } from '@react-email/components';
import { EmailLayout } from './layout';

type BillingEventType =
  | 'subscription_created'
  | 'subscription_canceled'
  | 'payment_failed'
  | 'payment_succeeded';

interface BillingEmailProps {
  userName: string;
  eventType: BillingEventType;
  amount?: number;
  nextBillingDate?: string;
  planName?: string;
}

const eventConfig = {
  subscription_created: {
    headline: 'Subscription Activated',
    color: '#059669',
    icon: '✓',
    description: 'Your Scrubbed.Pro subscription is now active.',
  },
  subscription_canceled: {
    headline: 'Subscription Canceled',
    color: '#DC2626',
    icon: '✕',
    description: 'Your Scrubbed.Pro subscription has been canceled.',
  },
  payment_failed: {
    headline: 'Payment Failed',
    color: '#DC2626',
    icon: '!',
    description: 'We were unable to process your payment.',
  },
  payment_succeeded: {
    headline: 'Payment Confirmed',
    color: '#059669',
    icon: '✓',
    description: 'Your payment has been successfully processed.',
  },
};

export function BillingEmail({
  userName,
  eventType,
  amount,
  nextBillingDate,
  planName,
}: BillingEmailProps) {
  const config = eventConfig[eventType];

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <EmailLayout>
      {/* Icon Header */}
      <Section
        style={{
          textAlign: 'center' as const,
          marginBottom: '16px',
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            backgroundColor: config.color,
            fontSize: '32px',
            fontWeight: '700',
            width: '56px',
            height: '56px',
            lineHeight: '56px',
            borderRadius: '28px',
            marginBottom: '0',
            display: 'inline-block',
          }}
        >
          {config.icon}
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
        {config.headline}
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
          color: '#1F2937',
          fontSize: '16px',
          lineHeight: '1.6',
          marginBottom: '24px',
        }}
      >
        {config.description}
      </Text>

      {/* Details Card */}
      <Section
        style={{
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        {planName && (
          <Text
            style={{
              color: '#6B7280',
              fontSize: '14px',
              marginBottom: '4px',
            }}
          >
            Plan
          </Text>
        )}
        {planName && (
          <Text
            style={{
              color: '#1F2937',
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            {planName}
          </Text>
        )}

        {amount !== undefined && (
          <>
            <Text
              style={{
                color: '#6B7280',
                fontSize: '14px',
                marginBottom: '4px',
              }}
            >
              Amount
            </Text>
            <Text
              style={{
                color: '#1F2937',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              {formatAmount(amount)}
            </Text>
          </>
        )}

        {nextBillingDate && (
          <>
            <Text
              style={{
                color: '#6B7280',
                fontSize: '14px',
                marginBottom: '4px',
              }}
            >
              Next billing date
            </Text>
            <Text
              style={{
                color: '#1F2937',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '0',
              }}
            >
              {formatDate(nextBillingDate)}
            </Text>
          </>
        )}
      </Section>

      {/* Payment Failed CTA */}
      {eventType === 'payment_failed' && (
        <Section style={{ marginBottom: '24px' }}>
          <Button
            href="#"
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
            Update payment method
          </Button>
        </Section>
      )}

      {/* Subscription Canceled Message */}
      {eventType === 'subscription_canceled' && (
        <Text
          style={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          We're sorry to see you go. Your data removal coverage has ended. You can reactivate your subscription at any time.
        </Text>
      )}

      {/* Subscription Created Message */}
      {eventType === 'subscription_created' && (
        <Text
          style={{
            color: '#6B7280',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          Thank you for your trust. We're actively monitoring and removing your data from broker sites. Check your dashboard for real-time updates.
        </Text>
      )}

      <Hr style={{ borderColor: '#E5E7EB', marginBottom: '24px' }} />

      <Text
        style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        Questions about your billing? Contact us at{' '}
        <Text
          style={{
            color: '#2563EB',
            textDecoration: 'none',
          }}
        >
          support@scrubbed.pro
        </Text>
      </Text>
    </EmailLayout>
  );
}