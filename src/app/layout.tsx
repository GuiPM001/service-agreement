'use client';

import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <ThemeProvider theme={theme}>
        <body className="my-8 mx-6 font-sans">{children}</body>
      </ThemeProvider>
    </html>
  );
}
