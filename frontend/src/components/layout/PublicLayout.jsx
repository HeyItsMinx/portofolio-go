import Navbar from '../nav/Navbar';

export default function PublicLayout({ children }) {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}