import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { SearchForm } from "@/components/search-form"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </Button>
        {
          // <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        }
      </div>
    </header>
  )
}
