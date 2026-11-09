import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

// Las fuentes están en app/fonts (no se bajan de Google): así la app anda sin
// internet. Son variables (todos los pesos en un archivo), solo el subset latin.
const geistSans = localFont({
  src: './fonts/geist-latin-wght-normal.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/geist-mono-latin-wght-normal.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
})

// Solo para el nombre "TocaYJuga" (clase font-brand)
const bricolage = localFont({
  src: './fonts/bricolage-grotesque-latin-wght-normal.woff2',
  variable: '--font-bricolage',
  weight: '200 800',
})

export const metadata: Metadata = {
  title: 'TocaYJuga',
  description: 'Reservá canchas de fútbol de distintos complejos en un solo lugar.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
