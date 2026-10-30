import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.errors[0].message }, { status: 400 });
    }

    // In a production app, this sends an email via Resend / SendGrid or logs to CRM
    console.log("Customer inquiry received:", validated.data);

    return NextResponse.json({
      message: "Thank you for reaching out! Our literary curators will respond within 24 hours.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send inquiry" }, { status: 500 });
  }
}
