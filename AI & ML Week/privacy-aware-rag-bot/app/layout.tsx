import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "Privacy-Aware RAG Bot",
  description: "HR Knowledge Assistant with Fine-Grained Authorization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
