import Link from "next/link";
import { auth, signIn, signOut } from "@/app/api/auth/[...nextauth]/auth";
import { Button } from "./ui/button";
import { shobhika, shobhikaBold } from "@/utils/shobhika";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">Sign out</button>
    </form>
  );
}

async function Navbar() {
  const navitems = [
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Audio Books",
      url: "/audiobooks",
    },
    {
      title: "TTS",
      url: "/tts",
    },
    {
      title: "ASR",
      url: "/asr",
    },
    {
      title: "Search",
      url: "/search",
    },
  ];

  const session = await auth();

  return (
    <header className="bg-[#efe7d6] shadow-sm sticky top-0 left-0 right-0">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 py-3">
        <Link href="/">
          <h3
            className={`text-2xl font-bold tracking-wide text-red-700 ${shobhikaBold.className} `}
          >
            संस्कृतवाङ्मयवाचिनी
          </h3>
        </Link>

        <ul className="hidden md:flex gap-8 px-6 font-serif text-sm tracking-wide text-gray-600 ">
          {navitems.map((item, index) => (
            <li key={index}>
              <Link className="hover:text-gray-900" href={item.url}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={session.user.image!} />
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>Dashboard</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/api/auth/signin">
              <Button
                variant="link"
                className="font-serif text-sm tracking-wide text-gray-600"
              >
                {" "}
                Sign in{" "}
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden" asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navitems.map((item, index) => (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.url}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
