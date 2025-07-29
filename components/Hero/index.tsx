import React from 'react'

const Hero = () => {
  return (
    <main className="flex flex-col items-center text-center gap-10 row-start-2">
      <h1 className="text-4xl sm:text-6xl font-semibold max-w-3xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        The Next-Gen ERP Platform for Efficient Inventory Management
      </h1>
      <p className="text-gray-400 max-w-xl text-lg">
        Streamline your warehouse operations, purchases, and reporting — all from one powerful dashboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/auth/login"
          className="bg-gradient-to-br from-green-400 to-blue-500 text-black font-semibold py-3 px-6 rounded-xl shadow-md hover:opacity-90 transition"
        >
          Get Started
        </a>
        <a
          href="#demo"
          className="border border-gray-700 text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition"
        >
          Watch Demo
        </a>
      </div>
    </main>
  )
}

export default Hero