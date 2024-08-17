import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="p-4 bg-gradient-to-b from-white/80 to-[#f0eee2]">
      {/* bg-gradient-to-b from-white to-[#f0eadb] */}
      <div className="px-4 pt-2 pb-6 max-w-7xl mx-auto grid grid-cols-1 place-items-center  md:grid-cols-1 ">
        <div>
          <Image
            src="/rishi_pupils.png"
            alt="hero img"
            width={400}
            height={400}
            // className="rounded "
          />
        </div>
        <div className="flex flex-col items-center gap-2 p-4">
          <p className="text-lg md:text-xl">Read and Listen to</p>
          <p className="text-4xl md:text-5xl lg:text-7xl font-bold">
            Sanskrit Books
          </p>
          <div className="flex gap-4 py-6 md:py-8">
            <Button>Start</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
