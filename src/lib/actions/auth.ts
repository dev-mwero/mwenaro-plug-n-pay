"use server";

import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

// SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function requestOTP(email: string) {
  try {
    await dbConnect();
    
    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    let user = await User.findOne({ email });
    
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        email,
        otp,
        otpExpiry,
      });
    }

    // Determine if we should actually send email or just log
    const isTestAccount = email === "test@example.com";

    if (process.env.SMTP_HOST && !isTestAccount) {
        try {
            await Promise.race([
                transporter.sendMail({
                    from: `"Mwenaro PlugPay" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
                    to: email,
                    subject: `Your Verification Code: ${otp}`,
                    text: `Your Mwenaro PlugPay verification code is ${otp}. It expires in 10 minutes.`,
                    html: `
                      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; color: #333;">
                        <h2 style="color: #4f46e5;">PlugPay Verification</h2>
                        <p>Use the code below to sign in to your developer dashboard:</p>
                        <div style="background: #e0e7ff; padding: 24px; border-radius: 12px; text-align: center; border: 1px solid #c7d2fe; margin: 24px 0;">
                          <span style="font-size: 32px; font-weight: bold; letter-spacing: 0.25em; color: #3730a3;">${otp}</span>
                        </div>
                        <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
                        <p style="font-size: 10px; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
                      </div>
                    `
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), 10000))
            ]);
            console.log(`[AUTH] OTP sent to ${email}`);
        } catch (mailError) {
            console.error("[AUTH] Mail Sending Failed (Falling back to log):", mailError);
            console.log(`[AUTH] OTP for ${email}: ${otp}`);
        }
    } else {
        console.log(`[AUTH] ${isTestAccount ? "Test account detected" : "No SMTP configured"}. OTP for ${email}: ${otp}`);
    }
    
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP Request Error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
}
