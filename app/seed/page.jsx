"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, writeBatch, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function SeedPage() {
    const [status, setStatus] = useState("Idle");

    const astrologyServices = [
        {
            name: "Kundali Matching",
            price: 300,
            description: "Personalized and in-depth compatibility analysis for couples looking to tie the knot. Experienced astrologers review both birth charts.",
        },
        {
            name: "Astrology for Career Growth",
            price: 200,
            description: "Guidance for your career. Experienced astrologers provide insightful consultations to help you navigate professional challenges and opportunities.",
        },
        {
            name: "Astrology for Education",
            price: 200,
            description: "Guidance on educational pursuits and challenges. Insights into the best fields of study, suitable career paths, and ways to overcome academic hurdles.",
        },
        {
            name: "Astrology for Family Problem",
            price: 249,
            description: "Addressing family problems through personalized astrological insights. Analyze birth charts and planetary alignments to provide guidance and solutions.",
        },
        {
            name: "Astrology for Financial Gain",
            price: 200,
            description: "Insights and guidance based on astrological principles to help clients improve their financial situations.",
        },
        {
            name: "Astrology for Health",
            price: 200,
            description: "Insights based on astrological charts, helping individuals understand how planetary positions may influence their well-being.",
        },
        {
            name: "Astrology for Love Problem",
            price: 200,
            description: "Guidance on love-related issues. Whether you're facing challenges in your relationship or seeking to understand your partner better.",
        },
        {
            name: "Astrology for Wealth",
            price: 300,
            description: "Insights into financial matters by analyzing your horoscope and planetary positions.",
        },
        {
            name: "Kundali Making",
            price: 300,
            description: "Detailed birth charts based on your date, time, and place of birth, offering a comprehensive overview of your astrological profile.",
        },
        {
            name: "Kundali Reading",
            price: 300,
            description: "Uncover the intricacies of your life. Insights into personality traits, career paths, and emotional well-being.",
        }
    ];

    const vastuServices = [
        {
            name: "Vastu Shastra Consultants For Residence",
            price: 200,
            description: "Expert guidance to create harmonious living spaces that promote well-being and prosperity.",
        },
        {
            name: "Vastu Shastra Consultants For Construction",
            price: 500,
            description: "Consulting a Vastu expert during the construction phase allows for the incorporation of essential features such as the right orientation of rooms.",
        },
        {
            name: "Vastu Shastra Consultants For Education",
            price: 500,
            description: "Analyze the structure, orientation, and interiors of educational spaces, including schools, colleges, and home study corners.",
        },
        {
            name: "Vastu Shastra Consultants For Marriage",
            price: 200,
            description: "Ensure the venue promotes positivity and happiness, creating a harmonious environment.",
        },
        {
            name: "Vastu Shastra Consultants For Plot",
            price: 200,
            description: "Plot evaluation providing guidance on optimizing land use according to ancient architectural principles.",
        },
        {
            name: "Vastu Shastra Consultants For Temple",
            price: 399,
            description: "Create a spiritually enriched space. Specialize in designing temples according to Vastu principles.",
        },
        {
            name: "Vastu Shastra Consultants For Wealth",
            price: 500,
            description: "Attracting wealth and prosperity. Recommendations to enhance financial growth.",
        },
        {
            name: "Vastu Shastra Consultants For Property",
            price: 500,
            description: "Designing homes and commercial properties to enhance energy flow and harmony.",
        }
    ];

    const seedData = async () => {
        setStatus("Seeding...");
        try {
            const batch = writeBatch(db);

            // Astrology Category
            const astroRef = doc(db, "service_categories", "astrology");
            batch.set(astroRef, {
                title: "Astrology Services",
                items: astrologyServices
            });

            // Vastu Category
            const vastuRef = doc(db, "service_categories", "vastu");
            batch.set(vastuRef, {
                title: "Vastu Shastra Services",
                items: vastuServices
            });

            await batch.commit();
            setStatus("Success! Data Seeded.");
        } catch (error) {
            console.error(error);
            setStatus("Error: " + error.message);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white flex-col gap-4">
            <h1 className="text-2xl font-bold">Firestore Seeder</h1>
            <p>Status: {status}</p>
            <Button onClick={seedData} className="bg-primary-gold text-black">
                Seed Services
            </Button>
        </div>
    );
}
