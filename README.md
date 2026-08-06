# Take Home Assesment Andres Castillo

## Sending Your First Email with Next.js, React Email, and Resend

This project demonstrates how to send transactional emails using **Next.js**, **React Email**, and **Resend**.

---

## Prerequisites

Before getting started, make sure you have:

- Node.js 18+
- npm
- A Resend account
  

---


## 1. Install dependencies

```bash
npm install
```

The project uses:

```json
{
  "dependencies": {
    "@react-email/components": "...",
    "@react-email/render": "...",
    "next": "...",
    "react": "...",
    "react-dom": "...",
    "resend": "..."
  }
}
```

---

## 2. Create your environment variables

Create a file named:

```text
.env.local
```

Add:

```env
RESEND_API_KEY=Your Resend API Token

RESEND_FROM_EMAIL= onboarding@resend.dev

RESEND_FROM_NAME=Resend Billing Team
```

---

## 3. Create the React Email template

Create:

```
src/emails/BillingFailureEmail.tsx
```

Example:

```tsx
import * as React from "react";
import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Link,
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
      <Body>
        <Container>

          <Heading>Billing failed</Heading>

          <Text>
            Hi! We couldn't process your latest payment.
          </Text>

          <Section>

            <Text>
              Customer: <strong>{customerEmail}</strong>
            </Text>

            <Button href="https://example.com/billing">
              Update billing
            </Button>

            <Text>
              <Link href="https://github.com/andrescasth/HomeChallengeAndresCastillo">
                Repository
              </Link>
            </Text>

          </Section>

        </Container>
      </Body>
    </Html>
  );
}
```

This component is converted into HTML before being sent.

---

## 4. Create the API Route

Create:

```
app/api/send-email/route.ts
```

Start by importing the required packages.

```tsx
import * as React from "react";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import BillingFailureEmail from "@/src/emails/BillingFailureEmail";
```

Since the Resend SDK requires Node.js, force the runtime:

```tsx
export const runtime = "nodejs";
```

Create the POST handler:

```tsx
export async function POST(req: Request) {
  try {
```

Parse the request body:

```tsx
const body = await req.json().catch(() => ({}));

const customerEmail =
  typeof body.customerEmail === "string"
    ? body.customerEmail
    : "customer@example.com";
```

Use the submitted email as the recipient:
Note: In this case it will only be able to send emails to andrescasth@gmail.com

```tsx
const to = customerEmail;
```

Render the React Email template into HTML:

```tsx
const html = await render(
  React.createElement(BillingFailureEmail, {
    customerEmail,
  })
);
```

Create a text attachment:

```tsx
const attachmentText = `Billing failure notice

Customer: ${customerEmail}

Timestamp:
${new Date().toISOString()}
`;
```

Convert it to Base64:

```tsx
const attachmentBase64 =
  Buffer.from(
    attachmentText,
    "utf-8"
  ).toString("base64");
```

Initialize Resend:

```tsx
const resend = new Resend(
  process.env.RESEND_API_KEY!
);
```

Send the email:

```tsx
const data = await resend.emails.send({
  from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
  to,
  subject: "Billing failed — action required",
  html,
  attachments: [
    {
      filename: "billing-failure.txt",
      content: attachmentBase64,
      contentType: "text/plain",
    },
  ],
});
```

Return a successful response:

```tsx
return NextResponse.json({
  ok: true,
  data,
});
```

Handle errors:

```tsx
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    {
      status: 500,
    }
  );
}
```

---

## 5. Create the frontend

Edit:

```
app/page.tsx
```

Create the state variables:

```tsx
const [name, setName] = React.useState("");
const [email, setEmail] = React.useState("");
const [status, setStatus] = React.useState("idle");
```

Create the submit handler:

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const res = await fetch("/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerName: name,
      customerEmail: email,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.error);
  }

  setStatus("success");
}
```

Create the form:

```tsx
<form onSubmit={handleSubmit}>

  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Customer name"
  />

  <input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="customer@example.com"
  />

  <button type="submit">
    Send
  </button>

</form>
```

---

## 6. Run the application

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 7. Test the application

Enter:

- Customer name
- andrescasth@gmail.com

Click **Send**.


# Project Structure

```
app/
├── api/send-email
│       └── route.ts
│       
├── page.tsx

src/
└── emails/
    └── BillingFailureEmail.tsx

.env.local
package.json
README.md
```

---

# Technologies Used

- Next.js
- React
- TypeScript
- React Email
- Resend

---
