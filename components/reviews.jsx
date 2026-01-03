"use client";

import { Star, User } from "lucide-react";

const reviews = [
    {
        name: "Anjali Sharma",
        location: "Mumbai",
        review: "Vinnay ji's prediction changed my career path completely. I was lost, but his guidance gave me clarity and confidence. Highly recommended!",
        rating: 5,
    },
    {
        name: "Rahul Verma",
        location: "Indore",
        review: "The Vastu remedies for my home brought immediate peace and prosperity. He is truly a gem in the field of astrology.",
        rating: 5,
    },
    {
        name: "Priya Singh",
        location: "Jabalpur",
        review: "I consulted him for marriage compatibility. His detailed analysis was spot on, and we are happily married now. Thank you, Guruji!",
        rating: 5,
    },
    {
        name: "Amit Patel",
        location: "London, UK",
        review: "Even over a video call, his energy and accuracy are unmatched. Best astrologer I have ever consulted.",
        rating: 5,
    }
];

export function Reviews() {
    return (
        <section className="w-full py-12 md:py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                Trusted by <span className="text-primary-gold">Thousands</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto px-6">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-default">
                        <div className="flex gap-1 mb-4">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="size-4 fill-primary-gold text-primary-gold" />
                            ))}
                        </div>
                        <p className="text-white/80 text-lg italic leading-relaxed mb-6">"{review.review}"</p>

                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-gradient-to-br from-primary-gold to-primary-dark flex items-center justify-center text-black font-bold text-sm">
                                {review.name[0]}
                            </div>
                            <div>
                                <h4 className="text-white font-bold">{review.name}</h4>
                                <p className="text-white/40 text-xs uppercase tracking-wider">{review.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
