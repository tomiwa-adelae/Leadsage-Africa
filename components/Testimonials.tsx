import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Tomiwa Adeniran",
    role: "Product Designer, Lagos",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "This platform has completely changed how I manage my digital products. Clean interface, fast onboarding, and everything just works. It has saved me hours every week.",
  },
  {
    name: "Sarah Mwangi",
    role: "Creative Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "I launched my first online offering in less than an hour. The simplicity and speed are unmatched. This is exactly what creators in Africa have been waiting for.",
  },
  {
    name: "Michael Johnson",
    role: "Full-Stack Developer",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    quote:
      "The developer experience is solid. Integrations are straightforward, documentation is clean, and the system is extremely reliable. I recommend it to any team shipping fast.",
  },
  {
    name: "Aisha Bello",
    role: "Community Manager",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "Managing my members has never been easier. The built-in tools helped me organize, monetize, and grow my community without needing any extra plugins or heavy setup.",
  },
  {
    name: "Kevin Mutiso",
    role: "Startup Founder",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    quote:
      "We moved our workflow here and instantly saw improvements in onboarding, customer communication, and payment handling. I honestly wish we switched sooner.",
  },
  {
    name: "Olivia Thompson",
    role: "Digital Marketing Strategist",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    quote:
      "Everything feels thoughtfully designed. It’s intuitive, fast, and gives me the analytics I need to make smarter decisions. A must-have platform for modern creators.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3)
);

export function Testimonials() {
  return (
    <div className="pt-16 pb-8">
      <div className="container">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-medium">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-base mt-2.5">
            Thousands of renters, landlords, and agents trust Leadsage.
          </p>
        </div>

        {/* Horizontal Scroll */}
        <ScrollArea className="w-full mt-8">
          <div className="flex w-max space-x-4 pb-4 pr-10">
            {testimonials.map(({ name, role, quote, image }, i) => (
              <Card key={i} className="w-80 flex-shrink-0">
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={image} alt={name} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="font-medium">{name}</h3>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                  </div>

                  <blockquote>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {quote}
                    </p>
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
