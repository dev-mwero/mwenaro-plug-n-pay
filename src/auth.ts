import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) return null;

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.otp || !user.otpExpiry) return null;

        // Check if OTP is valid and not expired
        if (user.otp === credentials.otp && user.otpExpiry > new Date()) {
          // Clear OTP after successful login
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
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
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
  pages: {
    signIn: "/login",
  },
});
