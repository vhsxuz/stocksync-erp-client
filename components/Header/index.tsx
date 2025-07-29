import React from 'react'
import LogoIcon from '../LogoIcon'

const Header = () => {
  return (

    <header className="flex justify-between items-center w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        {/* Embedded SVG Logo */}
        <LogoIcon width={24} height={24} />
        <span className="text-xl font-bold tracking-tight">StockSync ERP</span>

      </div>
      <nav className="hidden sm:flex gap-6 text-sm text-gray-400">
        <a href="#features" className="hover:text-white transition">Features</a>
        <a href="#pricing" className="hover:text-white transition">Pricing</a>
        <a href="#docs" className="hover:text-white transition">Docs</a>
      </nav>
    </header>
  )
}

export default Header