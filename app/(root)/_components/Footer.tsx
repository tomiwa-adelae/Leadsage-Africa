import { Logo } from "@/components/Logo";
import { footerLinks, smallFooterLinks, socialLinks } from "@/constants";
import { IconBrandX } from "@tabler/icons-react";
import Link from "next/link";

export function Footer() {
  return (
    <section className="bg-primary text-white">
      <footer className="border-t md:hidden py-16 md:py-32">
        <div>
          <Link
            href="/"
            aria-label="go home"
            className="mx-auto block size-fit"
          >
            <Logo white />
          </Link>

          <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            {smallFooterLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="hover:underline block"
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
                  className="hover:text-muted-foreground block transition-all"
                >
                  <Icon />
                </a>
              );
            })}
          </div>
          <span className="block text-center text-sm">
            {" "}
            © {new Date().getFullYear()} Leadsage Africa. All rights reserved
          </span>
        </div>
      </footer>
      <footer className="hidden md:block border-t">
        <div className="container">
          {/* <div className="grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <Link href="/" aria-label="go home" className="block size-fit">
                <Logo white />
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
                      className="hover:text-muted-foreground block duration-150"
                    >
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div> */}
          <div className="flex flex-wrap items-end justify-between gap-6 py-6">
            <span className="order-last block text-center text-sm md:order-first">
              © {new Date().getFullYear()} Leadsage Africa. All rights reserved
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
                    className="hover:text-muted-foreground block transition-all"
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
