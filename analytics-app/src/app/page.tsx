import Image from "next/image";
import Analytics from "./components/Analytics";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-3">
      <div>
        <div style={{float:'right'}}>
          <a href="/">X</a>
        </div>
        <Analytics />
      </div>
    </div>
  );
}
