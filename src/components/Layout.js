<html lang="en">
  <body className="flex flex-col min-h-screen">
    
    {/* Main Content */}
    <main className="flex-grow">
      {children}
    </main>

    {/* Footer */}
    <footer className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center py-6 bg-gray-900 text-white">
      {/* Left Section */}
      <div className="text-center md:text-left">
        <h3 className="text-lg font-semibold">SmartShop</h3>
        <p className="text-sm text-gray-400">Find what you need, where you need it.</p>
      </div>

      {/* Center Section - Navigation */}
      <nav className="my-4 md:my-0">
        <ul className="flex gap-6 text-sm">
          <li><a href="/" className="hover:text-gray-300">Home</a></li>
          <li><a href="/about" className="hover:text-gray-300">About</a></li>
          <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
        </ul>
      </nav>

      {/* Right Section - Social Media */}
      <div className="flex gap-4">
        <a href="#" className="hover:text-gray-300">🔗 Facebook</a>
        <a href="#" className="hover:text-gray-300">🔗 Twitter</a>
        <a href="#" className="hover:text-gray-300">🔗 Instagram</a>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-4">
        &copy; {new Date().getFullYear()} SmartShop. All rights reserved.
      </div>
    </footer>

  </body>
</html>
