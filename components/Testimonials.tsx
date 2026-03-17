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
    name: "Stefan Emecho",
    role: "Website Developer",
    image: "/assets/images/profile-img.jpg",
    quote:
      "Booking through Leadsage was surprisingly smooth. Everything from confirmation to check-in was well handled, and I didn’t have to worry about anything. It felt reliable from start to finish.",
  },
  {
    name: "Olaoluwa Akintomiwa",
    role: "Creative Entrepreneur",
    image: "/assets/images/profile-img.jpg",
    quote:
      "I’ve used a few platforms before, but this stood out. The communication was clear, the process was fast, and the apartment matched exactly what was promised. I’d definitely use it again.",
  },
];

const chunkArray = (
  array: Testimonial[],
  chunkSize: number,
): Testimonial[][] => {
  const result: Testimonial[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const testimonialChunks = chunkArray(
  testimonials,
  Math.ceil(testimonials.length / 3),
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
          <div className="flex w-max space-x-2 pb-4 pr-10">
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
