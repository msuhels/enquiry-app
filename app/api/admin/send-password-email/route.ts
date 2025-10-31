import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject:
        "Welcome to India’s First Free Education in Italy Course Finder by Alzato Overseas",
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    
    <h2 style="color:#1a73e8;">Welcome to India’s First Free Education in Italy Course Finder by Alzato Overseas</h2>

    <p>Dear Partner,</p>

    <p>
      We’re thrilled to welcome you to the <b>Alzato Overseas Partner Network!</b><br/>
      You’ve now received access to India’s first-ever 
      <b>“Free Education in Italy” Course Finder</b>, designed exclusively for Alzato partners.
    </p>

    <p>This platform empowers you to:</p>
    <ul>
      <li>✅ Instantly explore tentative course options during student counselling</li>
      <li>✅ Simplify discussions and enhance student engagement</li>
      <li>✅ Boost enrolments with faster, data-backed course recommendations</li>
    </ul>

    <p>
      It’s easy to use, efficient, and created to make your counselling sessions smoother and more impactful.
    </p>

    <p><b>Please note:</b></p>
    <ul>
      <li>The course options displayed will be <b>“Tentative”</b> and meant for counselling purposes only.</li>
      <li>
        Final course recommendations will be provided by our 
        <b>Subject Matter Experts</b> after a complete analysis of the student’s profile.
      </li>
    </ul>

    <h3>Your Login Credentials</h3>
    <p><b>Username:</b> ${email}</p>
    <p><b>Password:</b> ${password}</p>

    <p>
      You can log in here: 
      <a href="[Login Link]" style="color:#1a73e8;">Click here to login</a>
    </p>

    <p>
      For any assistance or technical support, please feel free to reach out to our team.
    </p>

    <p>
      Thank you for being a valued partner in shaping global education dreams.<br/>
      Let’s work together to help more students achieve <b>Free Education in Italy!</b>
    </p>

    <p>Warm regards,<br/>
      <b>Team Alzato Overseas</b><br/>
      Empowering Education Beyond Borders
    </p>

    <p>
      <a href="https://www.alzatooverseas.com" style="color:#1a73e8;">
      www.alzatooverseas.com
      </a>
    </p>

  </div>
  `,
    });

    console.log("Email sent:", info.messageId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
