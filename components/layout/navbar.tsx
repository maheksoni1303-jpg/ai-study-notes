import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logoutUser } from "@/actions/auth.actions"
import ThemeToggle from "@/components/layout/theme-toggle"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

interface NavbarProps {
  userName?: string
  isLoggedIn: boolean
  pathname?: string
}

export default function Navbar({ userName, isLoggedIn, pathname = "/" }: NavbarProps) {
  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ]

  const privateLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/notes", label: "Notes" },
    { href: "/upload", label: "Upload" },
    { href: "/bookmarks", label: "Bookmarks" },
    { href: "/profile", label: "Profile" },
  ]

  const links = isLoggedIn ? privateLinks : publicLinks

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xl font-bold sm:text-2xl">StudyHub</span>
          <span className="text-lg font-bold sm:text-xl">AI</span>
        </Link>

        <div className="hidden items-center gap-4 lg:flex">
          <ThemeToggle />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={"text-sm font-medium transition-colors hover:text-primary " +
                (pathname === link.href ? "text-primary" : "text-muted-foreground")}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn && (
            <div className="flex items-center gap-4 border-l pl-4">
              <span className="text-sm text-muted-foreground">
                Hi, {userName}
              </span>
              <form action={logoutUser}>
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <details className="group relative">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background shadow-sm transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">
              <HamburgerMenuIcon className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border bg-background p-3 shadow-lg">
              <div className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={"block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent " +
                      (pathname === link.href ? "text-primary" : "text-muted-foreground")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {isLoggedIn && (
                <div className="mt-3 space-y-3 border-t pt-3">
                  <p className="truncate px-3 text-sm text-muted-foreground">
                    Hi, {userName}
                  </p>
                  <form action={logoutUser}>
                    <Button variant="outline" size="sm" type="submit" className="w-full">
                      Logout
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </details>
        </div>
      </div>
    </nav>
  )
}
