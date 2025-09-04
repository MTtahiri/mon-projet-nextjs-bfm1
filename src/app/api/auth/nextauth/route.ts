import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Extension du type Session pour inclure accessToken
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Ajout sécurisé de accessToken à la session
      return {
        ...session,
        accessToken: token.accessToken as string,
      };
    },
  },
});

export { handler as GET, handler as POST };