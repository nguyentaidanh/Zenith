
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Zenith. All rights reserved.</p>
            <div className="flex space-x-6">
                <a href="#" className="text-sm text-gray-500 hover:text-primary">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-500 hover:text-primary">Terms of Service</a>
            </div>
        </div>
      </div>
    </footer>
  );
};
