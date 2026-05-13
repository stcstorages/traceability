import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Axle Assembly Traceability',
  description: 'Production traceability system for front and rear axle assembly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
            success: {
              style: {
                background: '#f0fdf4',
                border: '1px solid #86efac',
                color: '#166534',
              },
            },
            error: {
              style: {
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
