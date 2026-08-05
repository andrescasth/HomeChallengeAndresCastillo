import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type BillingFailureEmailProps = {
  customerEmail: string;
};

export default function BillingFailureEmail({
  customerEmail,
}: BillingFailureEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We couldn’t process your billing payment.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://react.email/images/logo.png"
            width="40"
            height="40"
            alt="Company"
          />

          <Heading style={h1}>Billing failed</Heading>

          <Text style={text}>
            Hi! We couldn’t process your latest payment. If you think this is an
            error, please update your billing information.
          </Text>

          <Section style={box}>
            <Text style={muted}>
              Customer: <strong>{customerEmail}</strong>
            </Text>

            <Button href="https://example.com/billing" style={button}>
              Update billing
            </Button>

            <Text style={muted}>
              Or view details in the repo:
              <br />
              <Link href="https://github.com/your-username/your-repo">
                https://github.com/your-username/your-repo
              </Link>
            </Text>
          </Section>

          <Text style={text}>
            Thanks,
            <br />
            <Link href="https://resend.com">Resend</Link> team
          </Text>

          <Text style={footer}>This is an automated email.</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#f6f6f6",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "24px",
  backgroundColor: "#ffffff",
};

const h1: React.CSSProperties = {
  fontSize: "28px",
  margin: "16px 0",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#111827",
};

const muted: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "8px 0 16px",
};

const box: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "16px",
};

const button: React.CSSProperties = {
  backgroundColor: "#000000",
  color: "#ffffff",
  padding: "12px 16px",
  borderRadius: "6px",
  display: "inline-block",
  textDecoration: "none",
  fontWeight: 600,
};

const footer: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "12px",
  color: "#9ca3af",
};
