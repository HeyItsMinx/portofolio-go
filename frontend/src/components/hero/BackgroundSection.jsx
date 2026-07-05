import DotField from "./DotField";

export default function BackgroundSection({ children }) {
  return (
    <div className="relative bg-black overflow-hidden">
      <DotField />
      <div className="relative z-10">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-b from-transparent to-black pointer-events-none z-20" />
    </div>
  );
}