"use server";

import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import crypto from "crypto";

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

    // TODO: Send OTP via Email/SMS provider
    console.log(`[AUTH] OTP for ${email}: ${otp}`);
    
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("OTP Request Error:", error);
    return { success: false, message: "Failed to send OTP" };
  }
}
