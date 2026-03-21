import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const userSchema = new mongoose.Schema({
  email: String,
  otp: String,
  otpExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const users = await User.find({ otp: { $exists: true } }).sort({ otpExpiry: -1 }).limit(5);
    console.log("=== RECENT OTPS ===");
    for (const u of users) {
      console.log(`Email: ${u.email} | OTP: ${u.otp} | Expires: ${u.otpExpiry}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
