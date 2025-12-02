"use client";

import Link from "next/link";
import { ourTeamMembers } from "@/constants";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
} from "@tabler/icons-react";
import { Globe } from "lucide-react";

export function OurTeam() {
  // Default social media icons if not specified
  const getSocialIcon = (type: string, url: string) => {
    switch (type) {
      case "facebook":
        return (
          <Link
            prefetch={false}
            href={url}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <IconBrandFacebook size={18} />
          </Link>
        );
      case "instagram":
        return (
          <Link
            prefetch={false}
            href={url}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <IconBrandInstagram size={18} />
          </Link>
        );
      case "twitter":
        return (
          <Link
            prefetch={false}
            href={url}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <IconBrandX size={18} />
          </Link>
        );
      case "website":
        return (
          <Link
            prefetch={false}
            href={url}
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Globe size={18} />
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <section className="pt-16 container">
      <div>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-medium">
            Meet the Team Behind Leadsage
          </h2>
          <p className="text-muted-foreground text-base mt-2.5">
            We’re a passionate group of creators, developers, and real estate
            professionals working to make housing simple and secure for everyone
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ourTeamMembers.map((member) => (
            <div key={member.id} className="group">
              <div className="mb-4 aspect-square overflow-hidden rounded-md">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-medium">{member.name}</h3>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="mb-2 text-sm text-primary hover:underline"
                >
                  {member.email}
                </a>
              )}
              {member.bio && (
                <p className="mb-4 text-sm text-muted-foreground">
                  {member.bio}
                </p>
              )}
              <div className="mt-2 flex space-x-4">
                {member.socialMedia &&
                  Object.entries(member.socialMedia).map(
                    ([key, value]) =>
                      value && (
                        <span key={key}>{getSocialIcon(key, value)}</span>
                      )
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
