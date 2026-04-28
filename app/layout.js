export const metadata = {
  title: "Quarantine App",
  description: "Virus tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
