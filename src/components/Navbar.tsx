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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Menu } from "lucide-react";
import Image from "next/image";

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
      title: "Dhvanipustakāni",
      url: "/audiobooks",
    },

    {
      title: "Anveṣiṇī",
      url: "/search",
    },
    {
      title: "Saṃvādinī",
      url: "/samvadini",
    },
    {
      title: "Swam",
      url: "/about",
    },
  ];

  const session = await auth();

  return (
    <header className="bg-[#891F10] shadow-sm sticky top-0 left-0 right-0 z-10 text-gray-100 ">
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 py-3">
        <Link href="/" className="flex gap-2 items-center">
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
          <h3
            className={`text-2xl font-bold tracking-wide  ${shobhikaBold.className} `}
          >
            संस्कृतवाङ्मयवाचिनी
          </h3>
        </Link>

        <ul className="hidden lg:flex gap-4 px-4 font-serif text-sm tracking-wide ">
          {navitems.map((item, index) => (
            <li key={index}>
              <Button
                asChild
                variant="link"
                className="font-serif text-gray-100 text-sm tracking-wide "
              >
                <Link className="" href={item.url}>
                  {item.title}
                </Link>
              </Button>
            </li>
          ))}
          <li>
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
                  {/* <DropdownMenuItem>Dashboard</DropdownMenuItem> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem>
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="link"
                className="font-serif text-sm tracking-wide text-gray-200 "
              >
                <Link href="/api/auth/signin">Sign in</Link>
              </Button>
            )}
          </li>
          {/* <li>
            <Tabs defaultValue="english" className="max-w-fit">
              <TabsList>
                <TabsTrigger value="english">En</TabsTrigger>
                <TabsTrigger value="sanskrit">San</TabsTrigger>
              </TabsList>
            </Tabs>
          </li> */}
        </ul>

        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden" asChild>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
                    {/* <DropdownMenuItem>Dashboard</DropdownMenuItem> */}
                    {/* <DropdownMenuSeparator /> */}
                    <DropdownMenuItem>
                      <SignOut />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  variant="link"
                  className="font-serif text-sm tracking-wide  "
                >
                  <Link href="/api/auth/signin">Sign in</Link>
                </Button>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tabs defaultValue="english" className="max-w-fit">
                <TabsList>
                  <TabsTrigger value="english">En</TabsTrigger>
                  <TabsTrigger value="sanskrit">San</TabsTrigger>
                </TabsList>
              </Tabs>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}

export default Navbar;
