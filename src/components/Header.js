import React, { useState } from 'react';
import { Menu, X, WandSparklesIcon, MessageCircleHeartIcon, LucideBookText } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black bg-opacity-97 shadow-glass p-4 flex justify-between items-center backdrop-blur-md relative">
      <div className="flex items-center space-x-3">
        <img src="/image.png" alt="MoodMe Logo" className="h-12 w-14" />
      </div>
      <nav className="hidden md:flex space-x-4">
        <a href="https://github.com/HarshVardhanSinghThakur" className="hover:text-blue-400 flex items-center text-white">
          <WandSparklesIcon className="mr-2" size={20} /> Projects
        </a>
        <a href="#" className="hover:text-blue-400 flex items-center text-white">
          <LucideBookText className="mr-2" size={20} />Docs
        </a>
        <a href="https://www.linkedin.com/in/harsh-vardhan-singh-b6181a249/" className="hover:text-blue-400 flex items-center text-white">
          <MessageCircleHeartIcon className="mr-2" size={20} />Contact
        </a>
        
      </nav>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="focus:outline-none text-white">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 right-0 w-48 bg-black bg-opacity-97 shadow-glass backdrop-blur-md flex flex-col items-center space-y-4 p-4 rounded-lg z-10">
          <a href="https://github.com/HarshVardhanSinghThakur" className="hover:text-blue-400 flex items-center text-white">
            <WandSparklesIcon className="mr-2" size={20} />Projects
          </a>
          <a href="#" className="hover:text-blue-400 flex items-center text-white">
            <LucideBookText className="mr-2" size={20} />Docs
          </a>
          <a href="https://www.linkedin.com/in/harsh-vardhan-singh-b6181a249/" className="hover:text-blue-400 flex items-center text-white">
            <MessageCircleHeartIcon className="mr-2" size={20} />Contact
          </a>

        </div>
      )}
    </header>
  );
};

export default Header;
