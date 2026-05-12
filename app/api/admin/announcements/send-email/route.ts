import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/adapters/service-role";
import nodemailer from "nodemailer";

const TEST_EMAILS: string[] = [
  "adityasen561@gmail.com",
  "adityasen.student@gmail.com"
];
const USE_TEST_EMAILS = false;

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
  return [...new Set((data || []).map(user => user.email).filter(email => email && email.includes("@")))];
}

async function getAnnouncementById(announcementId: string): Promise<{ title: string; content: string } | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("title, content")
    .eq("id", announcementId)
    .single();

  if (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
  return data;
}

async function sendAnnouncementEmail(to: string[], title: string, content: string): Promise<{ success: boolean; error?: string; sentCount?: number }> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      tls: { ciphers: "SSLv3" },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: to.join(","),
      bcc: to,
      subject: `New Announcement: ${title}`,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3a3886 0%, #5a56c9 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📢 New Announcement</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0;">
          <h2 style="color: #3a3886; margin-top: 0;">${title}</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">${content}</div>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>This announcement was sent to all registered users.</p>
          <p>© ${new Date().getFullYear()} Alzato Overseas</p>
        </div>
      </div>`,
    });
    return { success: true, sentCount: to.length };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.announcementId) {
      return NextResponse.json({ success: false, message: "Missing announcementId" }, { status: 400 });
    }

    const announcement = await getAnnouncementById(body.announcementId);
    if (!announcement) {
      return NextResponse.json({ success: false, message: "Announcement not found" }, { status: 404 });
    }

    const emails = USE_TEST_EMAILS && TEST_EMAILS.length > 0 ? TEST_EMAILS : await getAllUserEmails();
    if (emails.length === 0) {
      return NextResponse.json({ success: false, message: "No users found" }, { status: 400 });
    }

    const result = await sendAnnouncementEmail(emails, announcement.title, announcement.content);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Sent to ${result.sentCount} users`, sentCount: result.sentCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
