import * as React from "react";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";
import BillingFailureEmail from "@/src/emails/BillingFailureEmail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const customerEmail =
      typeof body?.customerEmail === "string"
        ? body.customerEmail
        : "customer@example.com";

    //const to = process.env.RESEND_TO_EMAIL ?? "andrescasth@gmail.com";
    const to = customerEmail;
    const html = await render(
      React.createElement(BillingFailureEmail, { customerEmail })
    );

    const attachmentText = `Billing failure notice
Customer: ${customerEmail}
Timestamp: ${new Date().toISOString()}
`;

    const attachmentBase64 = Buffer.from(attachmentText, "utf-8").toString(
      "base64"
    );

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const data = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME ?? "Billing"} <${process.env.RESEND_FROM_EMAIL}>`,
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

    return NextResponse.json({ ok: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
