import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="p-4 bg-gradient-to-b from-white to-[#f0eadb]">
      {/* bg-gradient-to-b from-white to-[#f0eadb] */}
      <div className="px-4 py-6 max-w-7xl mx-auto grid grid-cols-1 place-items-center  md:grid-cols-1 ">
        <div>
          <Image
            src="/teaching.png"
            alt="hero img"
            width={500}
            height={500}
            // className="rounded "
          />
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <p className="text-lg md:text-xl">Read and Listen to</p>
          <p className="text-5xl md:text-7xl">Sanskrit Books</p>
          <div className="flex gap-4 py-6 md:py-8">
            <Button>Start</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
