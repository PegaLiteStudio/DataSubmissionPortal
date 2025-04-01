export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-4">
      <div className="container mx-auto flex justify-between items-center">
        <svg viewBox="0 0 100 30" className="h-6">
          <rect width="100" height="30" fill="#333333" />
          <text x="50" y="20" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">SECURITY</text>
        </svg>
        <div className="text-xs">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}
