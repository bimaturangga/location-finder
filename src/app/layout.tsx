import type { Metadata } from 'next'
import { Inter, Funnel_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const funnelDisplay = Funnel_Display({
  subsets: ['latin'],
  variable: '--font-funnel-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Location Finder Pro',
  description: 'Advanced tool for location tracking and phone number lookup',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${funnelDisplay.variable}`}>
      <body>{children}</body>
    </html>
  )
}
