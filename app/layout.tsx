import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorkNest - Home to every workforce',
  description: 'Enterprise Employee Management System for modern businesses. Manage employees, attendance, payroll, and more.',
  keywords: ['HR', 'Employee Management', 'Payroll', 'Attendance', 'Leave Management'],
  authors: [
    { name: 'TechOhns', url: 'https://techohns.com' },
    { name: 'Pumulo Mubiana' },
    { name: 'Samuel Wakumelo' },
  ],
  creator: 'TechOhns',
  publisher: 'TechOhns',
  robots: 'index, follow',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
