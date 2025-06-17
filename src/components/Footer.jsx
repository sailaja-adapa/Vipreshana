const Footer = () => {
  return (
      <footer className="bg-gray-800 text-gray-300 text-sm py-4 px-4">
      <div className="max-w-md mx-auto flex flex-wrap justify-center items-center gap-x-2 text-center">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="font-medium text-white">Vipreshana</span>. All rights reserved.
        </p>
        <span>|</span>
        <p>
          Made with <span className="text-red-500">❤️</span> and trust
          <span className="ml-1">✨</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
