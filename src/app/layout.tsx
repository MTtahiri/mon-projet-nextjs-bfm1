import './globals.css'

export const metadata = {
  title: 'S.M. Consulting',
  description: 'Plateforme de consulting professionnelle',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}