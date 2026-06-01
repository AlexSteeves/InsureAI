import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-brand-secondary">
      <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-8">

        {/* Top row — brand + nav */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <Image src="/logo.svg" alt="InsureAI logo" width={22} height={22} />
              <span className="text-base font-semibold tracking-tight text-brand-text font-serif">
                InsureAI
              </span>
            </Link>
            <p className="type-sm text-brand-text/55 leading-relaxed">
              A technical demo exploring AI-powered insurance decisions.
              Built by Alex Steeves.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <p className="type-label text-brand-text/40 mb-1">Explore</p>
            <Link href="/demo" className="type-sm text-brand-text/60 hover:text-brand-text transition-colors">
              Demo
            </Link>
            <Link href="/architecture" className="type-sm text-brand-text/60 hover:text-brand-text transition-colors">
              Architecture
            </Link>
            <a
              href="https://github.com/alexsteeves"
              target="_blank"
              rel="noopener noreferrer"
              className="type-sm text-brand-text/60 hover:text-brand-text transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bottom row — copyright + disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="type-sm text-brand-text/40">
            © {year} Alex Steeves. All rights reserved.
          </p>
          <p className="type-sm text-brand-text/40 sm:text-right max-w-sm">
            InsureAI is a technical demo only. Not a licensed insurance product.
            No coverage is provided or implied.
          </p>
        </div>

      </div>
    </footer>
  )
}
