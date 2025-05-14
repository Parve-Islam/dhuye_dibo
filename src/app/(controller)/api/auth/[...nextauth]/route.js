// File: app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/dbConnect";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        // Find the user by email
        const user = await User.findOne({ 
          email: credentials.email,
          deleted: false,
          isVerified: true
        });

        // Check if user exists and password is correct
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.profilePicture
          };
        }
        
        // Authentication failed
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error',
    verifyRequest: '/verify-request',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };