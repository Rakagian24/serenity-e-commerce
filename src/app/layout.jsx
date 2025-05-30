import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Serenity",
  description: "Serenity, e-commerce yang menghadirkan ketenangan dalam setiap pengalaman belanja Anda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
