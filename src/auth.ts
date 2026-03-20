import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        // Development bypass for verification
        if (
          process.env.NODE_ENV === "development" && 
          credentials.email === "test@example.com" && 
          credentials.otp === "123456"
        ) {
          return {
            id: "507f1f77bcf86cd799439011", // Valid mock ObjectId
            email: "test@example.com",
            name: "Dev Test User",
          };
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.otp || !user.otpExpiry) return null;

        if (user.otp === credentials.otp && user.otpExpiry > new Date()) {
          user.otp = undefined;
          user.otpExpiry = undefined;
          await user.save();
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      if (user) {
        // For Google, we need to map to our DB's ObjectId
        if (account?.provider === "google") {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.sub = dbUser._id.toString();
          }
        } else {
          // For Credentials/OTP, the 'id' returned is already the DB _id (or our valid mock)
          token.sub = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        let userId = token.sub;

        // EMERGENCY SANITIZATION: If somehow the old legacy ID is still in the token,
        // we force it to the new valid mock ID so that it doesn't crash the database.
        if (userId === "dev-user-id") {
          userId = "507f1f77bcf86cd799439011";
        }

        session.user.id = userId;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          });
        }
      }
      return true;
    },
  },
});
