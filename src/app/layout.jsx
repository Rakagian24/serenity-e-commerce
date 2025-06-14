import "./globals.css";
import Providers from "./providers";
import LiveChatProvider from "./components/LiveChatProvider";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const metadata = {
  title: "Serenity",
  description: "Serenity, e-commerce yang menghadirkan ketenangan dalam setiap pengalaman belanja Anda.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <LiveChatProvider user={user}>
            {children}
          </LiveChatProvider>
        </Providers>
      </body>
    </html>
  );
}
