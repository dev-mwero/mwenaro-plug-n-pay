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
            id: "dev-user-id",
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
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
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
