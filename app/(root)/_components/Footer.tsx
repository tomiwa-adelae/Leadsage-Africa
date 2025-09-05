import { Logo } from "@/components/Logo";
import { footerLinks, smallFooterLinks, socialLinks } from "@/constants";
import { IconBrandX } from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <section>
      <footer className="border-t md:hidden py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/"
            aria-label="go home"
            className="mx-auto block size-fit"
          >
            <Logo invert />
          </Link>

          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            {smallFooterLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            {socialLinks.map(({ icon, url, name }, index) => {
              const Icon = icon;
              return (
                <a
                  href={url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="text-muted-foreground hover:text-primary block transition-all"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <span className="text-muted-foreground block text-center text-sm">
            {" "}
            © {new Date().getFullYear()} Tailark, All rights reserved
          </span>
        </div>
      </footer>
      <footer className="hidden md:block border-t bg-white pt-20 dark:bg-transparent">
        <div className="container px-6">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <Link href="/" aria-label="go home" className="block size-fit">
                <Logo invert />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
              {footerLinks.map((link, index) => (
                <div key={index} className="space-y-4 text-sm">
                  <span className="block font-medium">{link.group}</span>
                  {link.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary block duration-150"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
            <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
              © {new Date().getFullYear()} Leadsage Africa, All rights reserved
            </span>
            <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
              {socialLinks.map(({ icon, name, url }, index) => {
                const Icon = icon;
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-muted-foreground hover:text-primary block transition-all"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
