const Footer = () => {
  return (
      <footer className="w-full bg-black text-gray-300 text-sm py-6 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-2">
        <p>© {new Date().getFullYear()} <span className="font-medium text-white">Vipreshana</span>. All rights reserved.</p>
        <p>
          Made with <span className="text-red-500">❤️</span> and trust
        </p>
      </div>
    </footer>
  );
};

export default Footer;
