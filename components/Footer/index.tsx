import React from 'react'

const Footer = () => {
  return (
    <footer className="row-start-3 flex flex-wrap justify-center gap-8 text-gray-500 text-sm max-w-4xl mx-auto">
      <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
        Next.js
      </a>
      <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
        Tailwind CSS
      </a>
      <a href="#privacy" className="hover:text-white transition">
        Privacy
      </a>
      <a href="#terms" className="hover:text-white transition">
        Terms
      </a>
    </footer>
  )
}

export default Footer