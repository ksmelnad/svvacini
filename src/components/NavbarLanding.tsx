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
import { buttonVariants } from "./ui/button";

import { Menu } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";

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

async function NavbarLanding() {
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
      title: "Peaks",
      url: "/peaks",
    },
  ];

  const session = await auth();

  return (
    <header className="sticky top-0 z-60 py-2 bg-[#f0eee2] shadow-sm backdrop-blur-xl h-16">
      <nav className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-4 px-4 py-1">
        <Link href="/" className="w-1/3 flex gap-2 items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <h3
            className={`text-xl md:text-3xl lg:text-3xl mt-2  ${shobhikaBold.className} `}
          >
            संस्कृतवाचिनी
          </h3>
        </Link>
        <ul className="hidden lg:flex gap-2 ">
          {navitems.map((item, index) => (
            <li key={index}>
              <Link className={`px-4 py-2 hover:underline `} href={item.url}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="hidden lg:flex">
          {/* <li>
            <Tabs defaultValue="english" className="max-w-fit">
              <TabsList>
                <TabsTrigger value="english">En</TabsTrigger>
                <TabsTrigger value="sanskrit">San</TabsTrigger>
              </TabsList>
            </Tabs>
          </li> */}
          <li className="">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={session.user.image!} />
                    {/* <AvatarFallback>CN</AvatarFallback> */}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/api/auth/signin"
                className={`px-4 py-2 hover:underline `}
              >
                Sign in
              </Link>
            )}
          </li>
        </ul>
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>
                <SheetClose asChild className="flex justify-center">
                  <Link href="/" className="flex flex-col gap-2 items-center">
                    <Image
                      src="/logo.svg"
                      alt="logo"
                      width={10}
                      height={10}
                      className="w-8 h-8"
                    />
                    <h3 className={`text-lg  ${shobhikaBold.className} `}>
                      संस्कृतवाचिनी
                    </h3>
                  </Link>
                </SheetClose>
              </SheetTitle>
            </SheetHeader>
            <Separator />

            <div className="flex flex-col justify-center py-4">
              {navitems.map((item, index) => (
                <SheetClose key={index} asChild>
                  <Link
                    className="text-center hover:bg-gray-100 transition-colors px-2 py-2 rounded-md"
                    href={item.url}
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              ))}
            </div>
            <Separator />

            {session?.user ? (
              <div className="flex flex-col items-center gap-4 pt-6">
                <Avatar>
                  <AvatarImage src={session.user.image!} />
                  {/* <AvatarFallback>CN</AvatarFallback> */}
                </Avatar>

                <SheetClose asChild>
                  <SignOut />
                </SheetClose>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 pt-6">
                <Link href="/api/auth/signin">Sign in</Link>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

export default NavbarLanding;
