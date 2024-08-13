import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";



const inter = Inter({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
  });

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    
  return (
    <div >
      {/*  bg-gradient-to-br from-gray-700 from-40% via-purple-200 via-80% to-gray-00 to-100%" 
      bg-cover bg-[url('/carlos-torres-MHNjEBeLTgw-unsplash.jpg')]    */}
      <Navbar />
      {children}
    </div>
  );
}
