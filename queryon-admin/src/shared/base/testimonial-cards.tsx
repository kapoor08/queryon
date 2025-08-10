import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ITestimonials } from "@/types/base";

interface ITestimonialCards {
  testimonial: ITestimonials;
}

const TestimonialCards = ({ testimonial }: ITestimonialCards) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 hover:bg-slate-900/70 transition-all duration-300">
      <CardContent className="p-8">
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-slate-300 mb-6 leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center">
          <Image
            src={testimonial.avatar || "/placeholder.svg"}
            alt={testimonial.author}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <div className="font-semibold text-white">{testimonial.author}</div>
            <div className="text-sm text-slate-400">{testimonial.role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCards;
