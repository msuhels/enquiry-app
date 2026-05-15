import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/adapters/server";
import nodemailer from "nodemailer";

// Level to email mapping from environment variables
// Configure these in .env.local:
// ESCALATION_LEVEL_1_EMAIL=email1@example.com
// ESCALATION_LEVEL_2_EMAIL=email2@example.com
// ESCALATION_LEVEL_3_EMAIL=email3@example.com
// ESCALATION_LEVEL_4_EMAIL=email4@example.com


const escalationEmails: Record<string, Record<string, string>> = {
    central: {
        "1": "italy.app20@alzatooverseas.com",
        "2": "italy.app1@alzatooverseas.com",
        "3": "application18@alzatooverseas.com",
        "4": "italy.ops@alzatooverseas.com",
        "5": "director.escalation@alzatooverseas.com",
        "6": "ro@alzatooverseas.com"
    },
    east: {
        "1": "italy.app20@alzatooverseas.com",
        "2": "italy.app1@alzatooverseas.com",
        "3": "application18@alzatooverseas.com",
        "4": "italy.ops@alzatooverseas.com",
        "5": "director.escalation@alzatooverseas.com",
        "6": "ro@alzatooverseas.com"
    },
    west: {
        "1": "italy.app20@alzatooverseas.com",
        "2": "italy.app1@alzatooverseas.com",
        "3": "application18@alzatooverseas.com",
        "4": "italy.ops@alzatooverseas.com",
        "5": "director.escalation@alzatooverseas.com",
        "6": "ro@alzatooverseas.com"
    },
    north: {
        "1": "italy.app20@alzatooverseas.com",
        "2": "italy.app1@alzatooverseas.com",
        "3": "ro@alzatooverseas.com",
        "4": "italy.ops@alzatooverseas.com",
        "5": "director.escalation@alzatooverseas.com",
        "6": "ro@alzatooverseas.com"
    },
    south: {
        "1": "italy.app20@alzatooverseas.com",
        "2": "italy.app1@alzatooverseas.com",
        "3": "ro4@alzatooverseas.com",
        "4": "italy.ops@alzatooverseas.com",
        "5": "director.escalation@alzatooverseas.com",
        "6": "ro@alzatooverseas.com"
    },
};


function getZoneLevelEmail(zone: string, level: string): string | null {
    return escalationEmails[zone]?.[level] || null;
}



async function sendEscalationEmail(
    to: string,
    zone: string,
    message: string,
    level: string,
    organizationName: string
) {
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

    const levelLabels: Record<string, string> = {
        "1": "Level 1",
        "2": "Level 1",
        "3": "Level 2",
        "4": "Level 3",
        "5": "Level 4",
        "6": "Sales and Marketing",
    };

    const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: to,
        subject: `New Escalation Request - ${zone.toUpperCase()} - ${levelLabels[level] || level}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color:#F97316;">New Escalation Request</h2>
                
                <p>A new escalation has been submitted and requires your attention.</p>
                
                <h3>Escalation Details:</h3>
                <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Zone:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${zone.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Level:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${levelLabels[level] || level}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted By:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${organizationName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
                    </tr>
                </table>
                
                <p style="margin-top: 20px;">
                    Please login to the admin dashboard to view and address this escalation.
                </p>
                
                <p>
                    <a href="https://italycoursefinder.com/admin/escalations" style="color:#1a73e8;">Click here to view escalations</a>
                </p>
                
                <p style="margin-top: 30px; color: #666; font-size: 12px;">
                    This is an automated notification from Alzato Overseas Escalation System.
                </p>
            </div>
        `,
    });

    console.log("Escalation email sent:", info.messageId);
    return info;
}

export async function POST(request: Request) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await request.json();
        const { zone, user_message, level } = body;

        // Get user details for email and notification
        const { data: userData } = await supabase
            .from("users")
            .select("organization")
            .eq("id", user.id)
            .single();

        const organizationName = userData?.organization || "Unknown User";

        // Insert escalation
        const { data: escalation, error: escalationError } = await supabase
            .from("escalations")
            .insert({
                zone,
                user_message,
                level,
                user_id: user.id,
            })
            .select()
            .single();

        if (escalationError) {
            console.error("Error creating escalation:", escalationError);
            return new NextResponse("Error creating escalation", { status: 500 });
        }

        // Insert admin notification with correct field names
        const { error: notificationError } = await supabase
            .from("admin_notifications")
            .insert({
                created_by: user.id,
                notification_type: "escalation",
                reference_id: escalation.id,
                title: `${organizationName} has sent an escalation request`,
                message: `New escalation from ${organizationName} - ${zone} zone, Level ${level}. Click here to view.`,
                is_read: false,
            });

        if (notificationError) {
            console.error("Error creating notification:", notificationError);
            // Don't fail the whole request if notification fails
        }

        // Send email based on level
        const levelEmail = getZoneLevelEmail(zone, level);
        if (levelEmail) {
            try {
                await sendEscalationEmail(levelEmail, zone, user_message, level, organizationName);
            } catch (emailError) {
                console.error("Error sending escalation email:", emailError);
            }
        } else {
            console.warn(`No email configured for zone ${zone} level ${level}`);
        }

        return NextResponse.json({
            success: true,
            data: escalation,
        });
    } catch (error) {
        console.error("Error in escalations create:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
