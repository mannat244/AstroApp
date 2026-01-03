"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, collection, addDoc, updateDoc, query, where, getDocs, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeBookingDetails } from "@/lib/sanitize";

// Components
import { ServiceSelection } from "./components/ServiceSelection";
import { DetailsForm } from "./components/DetailsForm";
import { DateTimeSelection } from "./components/DateTimeSelection";
import { PaymentSummary } from "./components/PaymentSummary";
import { BookingSuccess } from "./components/BookingSuccess";

import { SERVICES_DATA } from "@/data/services";

export default function BookPage() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Steps: 1=Service, 2=Details, 3=Date, 4=Pay, 5=Success
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Initial Data
    const [selectedCategory, setSelectedCategory] = useState("kundali");

    // Form State
    const [date, setDate] = useState();
    const [time, setTime] = useState("");
    const [bookedSlots, setBookedSlots] = useState([]); // Fetched from DB
    const [selectedService, setSelectedService] = useState(null); // Full service object

    // Smart Form Details
    const [beneficiary, setBeneficiary] = useState("self"); // self | other
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        dob: "",
        timeOfBirth: "",
        placeOfBirth: "",
        propertySize: "",
        propertyType: "residential"
    });

    const [bookingDetails, setBookingDetails] = useState(null);
    const timeSlots = ["10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "05:00 PM", "06:00 PM"];

    // Fetch Booked Slots Logic
    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!date) return;

            setBookedSlots([]); // Clear prev

            try {
                // Construct range for the entire day to catch all ISO strings on that date
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);

                const q = query(
                    collection(db, "bookings"),
                    where("date", ">=", startOfDay.toISOString()),
                    where("date", "<=", endOfDay.toISOString())
                );

                const querySnapshot = await getDocs(q);
                // We trust the exact string match for time slots
                const takenTimes = querySnapshot.docs.map(doc => doc.data().time);
                setBookedSlots(takenTimes);
            } catch (err) {
                console.error("Error fetching slots:", err);
            }
        };

        fetchBookedSlots();
    }, [date]);

    // Handle URL Params on Mount
    useEffect(() => {
        const paramCategory = searchParams.get('category');
        const paramService = searchParams.get('service');

        if (paramCategory && SERVICES_DATA[paramCategory]) {
            setSelectedCategory(paramCategory);

            if (paramService) {
                const svc = SERVICES_DATA[paramCategory].items.find(i => i.name === paramService);
                if (svc) {
                    setSelectedService({ ...svc, categoryId: paramCategory });
                }
            }
        }
    }, [searchParams]);

    // Pre-fill Self Data
    useEffect(() => {
        if (beneficiary === "self" && user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || "",
            }));
        } else if (beneficiary === "other") {
            setFormData(prev => ({ ...prev, name: "", dob: "" }));
        }
    }, [beneficiary, user]);

    // Handlers
    const handleCategoryChange = (val) => {
        setSelectedCategory(val);
    };

    const handleServiceSelect = (serviceId) => {
        const catData = SERVICES_DATA[selectedCategory];
        const svc = catData.items.find(i => i.id === serviceId);
        if (svc) {
            setSelectedService({ ...svc, categoryId: selectedCategory });
        }
    };

    const handleDetailsSubmit = () => {
        setStep(3);
    };

    const handleDateSubmit = () => {
        if (!date || !time) return;
        setStep(4);
    };

    const handlePayment = async () => {
        if (!user) {
            alert("Please login to book.");
            return;
        }

        setLoading(true);

        try {
            // DETERMINISTIC ID STRATEGY: YYYY-MM-DD_TIME
            // This ensures 100% uniqueness at the database level.
            // Example ID: "2024-12-25_1000AM"
            const slotId = format(date, "yyyy-MM-dd") + "_" + time.replace(/[: ]/g, "");
            const bookingRef = doc(db, "bookings", slotId);

            let meetingLink = null;
            const mode = searchParams.get('mode') || 'online';
            const isOnline = mode === 'online';

            if (isOnline) {
                // Use slotId as the meeting room identifier for consistency
                meetingLink = `https://meet.jit.si/${slotId}`;
            }

            // 1. ATOMIC RESERVATION (Check & Reserve in one go)
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(bookingRef);

                if (sfDoc.exists()) {
                    const data = sfDoc.data();
                    // If slot exists, check if it's "real" or just a stale abandoned initiation
                    // For now, strictly block any existing confirmed/initiated slot
                    if (data.status === "confirmed" || data.status === "initiated") {
                        throw new Error("SLOT_TAKEN");
                    }
                }

                // Prepare Booking Data
                // Sanitize user-submitted details to prevent XSS
                const sanitizedDetails = sanitizeBookingDetails(formData);

                const bookingData = {
                    id: slotId, // Explicitly set ID here too
                    userId: user.uid,
                    userName: user.displayName,
                    userEmail: user.email,
                    serviceName: selectedService.name,
                    serviceCategory: selectedService.categoryId,
                    details: sanitizedDetails,
                    beneficiaryType: beneficiary,
                    date: date.toISOString(),
                    time,
                    meetingLink,
                    mode: isOnline ? "online" : "in-person",
                    status: "initiated", // Reserved!
                    amount: selectedService.price,
                    currency: "INR",
                    createdAt: new Date().toISOString()
                };

                // Reserve the slot
                transaction.set(bookingRef, bookingData);
            });

            // 2. Process Payment (Mock)
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2s simulated delay

            // 3. Confirm Booking
            await updateDoc(bookingRef, {
                status: "confirmed",
                paymentId: "PAY_" + Math.random().toString(36).substr(2, 9).toUpperCase()
            });

            // Re-construct critical UI data for the success page
            setBookingDetails({
                id: slotId,
                serviceName: selectedService.name,
                meetingLink: meetingLink, // Use the meetingLink generated earlier
                status: "confirmed",
                date: date.toISOString(),
                time: time,
            });

            setStep(5);

        } catch (error) {
            console.error("Booking failed:", error);
            if (error.message === "SLOT_TAKEN") {
                alert("This slot has just been taken by another user. Please choose a different time.");
                setStep(3); // Back to slots
            } else {
                alert("Transaction failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const addToGoogleCalendar = () => {
        if (!bookingDetails) return;
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour
        const text = encodeURIComponent(`Astrology: ${bookingDetails.serviceName}`);

        let details = "";
        let location = "";

        if (bookingDetails.meetingLink) {
            details = encodeURIComponent(`Meeting Link: ${bookingDetails.meetingLink}`);
            location = encodeURIComponent("Online Meeting");
        } else {
            details = encodeURIComponent("In-person consultation. Please check your dashboard for address details.");
            location = encodeURIComponent("Astrology Center");
        }

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}&dates=${format(startTime, "yyyyMMdd'T'HHmmss")}/${format(endTime, "yyyyMMdd'T'HHmmss")}`;
        window.open(url, '_blank');
    };

    const isVastu = selectedService?.categoryId === "vastu";

    return (
        <div className="min-h-screen bg-bg-dark overflow-x-hidden text-white p-4 md:p-8 pb-32 max-w-7xl mx-auto font-sans">

            {/* Header / Steps Indicator */}
            <div className="flex flex-col items-center mb-8 md:mb-12">
                <div className="flex items-center gap-2 md:gap-4 bg-neutral-900 rounded-full px-6 md:px-6 py-2.5 md:py-3 border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                    {[
                        { id: 1, label: "Service" },
                        { id: 2, label: "Details" },
                        { id: 3, label: "Slot" },
                        { id: 4, label: "Pay" }
                    ].map((s) => (
                        <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
                            <div className={cn(
                                "size-7 md:size-8 rounded-full flex items-center justify-center font-bold text-[12px] md:text-sm transition-all duration-300",
                                step >= s.id ? "bg-primary-gold text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]" : "bg-white/10 text-white/40"
                            )}>
                                {step > s.id ? <CheckCircle className="size-3 md:size-4" /> : s.id}
                            </div>
                            <span className={cn(
                                "text-[10px] md:text-sm font-medium",
                                step >= s.id ? "text-primary-gold" : "text-white/40"
                            )}>{s.label}</span>
                            {s.id < 4 && <div className="w-4 md:w-8 h-0.5 rounded-full bg-white/10" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step 1: Service Selection */}
            {step === 1 && (
                <ServiceSelection
                    selectedCategory={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                    selectedService={selectedService}
                    handleServiceSelect={handleServiceSelect}
                    onNext={() => setStep(2)}
                />
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
                <DetailsForm
                    isVastu={isVastu}
                    beneficiary={beneficiary}
                    setBeneficiary={setBeneficiary}
                    formData={formData}
                    setFormData={setFormData}
                    onBack={() => setStep(1)}
                    onNext={handleDetailsSubmit}
                />
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <DateTimeSelection
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    timeSlots={timeSlots}
                    bookedSlots={bookedSlots}
                    onBack={() => setStep(2)}
                    onNext={handleDateSubmit}
                />
            )}

            {/* Step 4: Summary & Payment */}
            {step === 4 && selectedService && (
                <PaymentSummary
                    selectedService={selectedService}
                    beneficiary={beneficiary}
                    formData={formData}
                    date={date}
                    time={time}
                    handlePayment={handlePayment}
                    loading={loading}
                    onBack={() => setStep(3)}
                />
            )}

            {/* Step 5: Success */}
            {step === 5 && bookingDetails && (
                <BookingSuccess
                    bookingDetails={bookingDetails}
                    addToGoogleCalendar={addToGoogleCalendar}
                />
            )}

        </div>
    );
}
