import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import nodemailer from "nodemailer";

interface AnnouncementEmailPayload {
  announcementId: string;
  title: string;
  content: string;
}

// ============================================================
// TEST EMAILS - Add your test email(s) for development
// Then set USE_TEST_EMAILS = true to use them
// ============================================================
const TEST_EMAILS: string[] = [
  "adityasen561@gmail.com",
  "adityasen.student@gmail.com"
];

// Set to true to use TEST_EMAILS instead of fetching all user emails
const USE_TEST_EMAILS = true;
// ============================================================

async function getAllUserEmails(): Promise<string[]> {
  const supabase = createServiceRoleClient();
  
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .not("email", "is", null);

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  const emails = (data || [])
    .map(user => user.email)
    .filter(email => email && email.includes("@"));
  
  return [...new Set(emails)]; // Remove duplicates
}

async function sendAnnouncementEmail(
  to: string[],
  title: string,
  content: string
): Promise<{ success: boolean; error?: string; sentCount?: number }> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: to.join(","),
      bcc: to,
      subject: `New Announcement: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3a3886 0%, #5a56c9 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">📢 New Announcement</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0;">
            <h2 style="color: #3a3886; margin-top: 0;">${title}</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
              ${content}
            </div>
          </div>
          <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>This announcement was sent to all registered users.</p>
            <p>© ${new Date().getFullYear()} Alzato Overseas - Empowering Education Beyond Borders</p>
          </div>
        </div>
      `,
    });

    console.log("Announcement email sent:", info.messageId);
    return { success: true, sentCount: to.length };
  } catch (error: any) {
    console.error("Error sending announcement email:", error);
    return { success: false, error: error.message };
  }
}

// POST: Send announcement email to all users
export async function POST(request: NextRequest) {
  try {
    const body: AnnouncementEmailPayload = await request.json();

    if (!body.announcementId || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get emails - either test array or all users from database
    let emails: string[];
    
    if (USE_TEST_EMAILS && TEST_EMAILS.length > 0) {
      console.log("Using TEST_EMAILS:", TEST_EMAILS);
      emails = TEST_EMAILS;
      console.log("Emails fetched from DB:", emails);
    } else {
      console.log("Fetching emails from database...");
      emails = TEST_EMAILS;
       // Log the list of emails from DB
    }
    
    if (emails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No users found to send emails" },
        { status: 400 }
      );
    }

    console.log(`Sending announcement to ${emails.length} users...`);

    // Send email to all users
    const result = await sendAnnouncementEmail(emails, body.title, body.content);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "Failed to send emails" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Announcement sent to ${result.sentCount} users`,
      sentCount: result.sentCount,
    });
  } catch (error: any) {
    console.error("Error sending announcement emails:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
