import { Scale } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="container mx-auto">

        <div className="pt-8 border-t border-black text-center text-sm text-black">
          © {new Date().getFullYear()} LegalFlow. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
export default Footer;