import './globals.css'

export const metadata = {
  title: 'IA PDF Assistant',
  description: 'Posez des questions sur vos documents PDF'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}