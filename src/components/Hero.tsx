import Image from "next/image";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="p-4 bg-gradient-to-b from-white to-[#f0eadb]">
      <div className="py-20 max-w-5xl mx-auto grid grid-cols-1 place-items-center  md:grid-cols-2 p-4">
        <div className="flex flex-col gap-6 p-4">
          <p className="text-2xl">Read and Listen to</p>
          <p className="text-5xl">Sanskrit Books</p>
          <div className="flex gap-4">
            <Button>Start</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <div>
          <Image
            src="/teaching.png"
            alt="hero img"
            width={400}
            height={400}
            // className="rounded "
          />
        </div>
      </div>
    </div>
  );
}
