import { Open_Sans } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans',
})

export const metadata = {
  title: 'Everything Starts as a Square - Get lost in the world of icon design',
  description:
    'A book and video course that teaches you how to design your own icons from scratch.',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        openSans.variable,
      )}
    >
      <head>
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
