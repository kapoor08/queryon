import { testimonials } from "@/data";
import { TestimonialCards } from "@/shared/base";
import { TranslatableText } from "@/shared/elements";

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TranslatableText
            text="See what our customers are saying about their experience with
            ChatWidget"
            as="h2"
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCards key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
