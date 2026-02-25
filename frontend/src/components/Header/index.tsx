import Link from "next/link";
import LoginSection from "@/src/components/Header/LoginSection";
import SideNavigation from "@/src/components/Header/SideNavigation";
import LogoLink from "@/src/components/Header/LogoLink";
import LoginPromptBar from "@/src/components/Header/LoginPromptBar";
import { cookies } from "next/headers";

export default async function Header() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");
    const isLoggedIn = !!accessToken;

    return (
      <div>
        <header className="z-45 fixed top-0 inset-x-0 shadow-md">
          <nav className="bg-primary h-16 relative flex items-center">
            <div className="max-w-5xl mx-auto">
              <div className="flex md:justify-between justify-center w-[70vw] mx-auto items-center">
                <LogoLink isLoggedIn={isLoggedIn} />

                <ul>
                  <div className="hidden md:flex items-center">
                    <li>
                      <Link href="/what-to-discard-problems">
                        <div className="flex items-center gap-1">
                          <button className="py-2 px-4 rounded-sm hover:bg-secondary">
                            何切る問題
                          </button>
                        </div>
                      </Link>
                    </li>

                    <LoginSection isLoggedIn={isLoggedIn} />
                  </div>
                </ul>
              </div>
            </div>
          </nav>

          <SideNavigation />
          <LoginPromptBar />
        </header>
      </div>
    );
  } catch (error) {
    console.error("Error fetching cookies:", error);

    return (
      <div>
        <header className="z-45 fixed top-0 inset-x-0 shadow-md">
          <nav className="bg-primary h-16 relative flex items-center">
            <div className="max-w-5xl mx-auto">
              <div className="flex md:justify-between justify-center w-[70vw] mx-auto items-center">
                <LogoLink isLoggedIn={false} />

                <ul>
                  <div className="hidden md:flex items-center">
                    <li>
                      <Link href="/what-to-discard-problems">
                        <div className="flex items-center gap-1">
                          <button className="py-2 px-4 rounded-sm hover:bg-secondary">
                            何切る問題
                          </button>
                        </div>
                      </Link>
                    </li>

                    <LoginSection isLoggedIn={false} />
                  </div>
                </ul>
              </div>
            </div>
          </nav>

          <SideNavigation />
          <LoginPromptBar />
        </header>
      </div>
    );
  }
}
