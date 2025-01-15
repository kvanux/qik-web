import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/((?!privacy|api|auth|public|_next/static|_next/image|favicon.ico).*)",
  ],
}