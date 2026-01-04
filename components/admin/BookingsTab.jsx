"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format, isSameDay } from "date-fns";
import { Search, Download, ExternalLink, CheckCircle, Clock, XCircle, AlertCircle, CalendarDays, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BookingsTab() {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all"); // "all", "upcoming", "past"
    const [viewMode, setViewMode] = useState("table"); // "table" or "calendar"
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, statusFilter, timeFilter, bookings]);

    const fetchBookings = async () => {
        try {
            const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(data);
            setFilteredBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = bookings;
        const now = new Date();

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(b =>
                b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.id?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(b => b.status === statusFilter);
        }

        // Time filter (upcoming/past)
        if (timeFilter === "upcoming") {
            filtered = filtered.filter(b => new Date(b.date) >= now);
        } else if (timeFilter === "past") {
            filtered = filtered.filter(b => new Date(b.date) < now);
        }

        setFilteredBookings(filtered);
    };

    const updateStatus = async (bookingId, newStatus) => {
        try {
            await updateDoc(doc(db, "bookings", bookingId), { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const exportCSV = () => {
        const csv = [
            ["ID", "User", "Email", "Service", "Date", "Time", "Status", "Amount"],
            ...filteredBookings.map(b => [
                b.id,
                b.userName,
                b.userEmail,
                b.serviceName,
                format(new Date(b.date), "MMM d, yyyy"),
                b.time,
                b.status,
                b.amount
            ])
        ].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bookings-${Date.now()}.csv`;
        a.click();
    };

    const getStatusBadge = (status) => {
        const variants = {
            confirmed: { icon: CheckCircle, className: "bg-green-500/20 text-green-400 border-green-500/30" },
            completed: { icon: CheckCircle, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
            pending: { icon: Clock, className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
            initiated: { icon: AlertCircle, className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
            cancelled: { icon: XCircle, className: "bg-red-500/20 text-red-400 border-red-500/30" },
        };

        const config = variants[status] || variants.pending;
        const Icon = config.icon;

        return (
            <Badge className={config.className}>
                <Icon className="size-3 mr-1" />
                {status}
            </Badge>
        );
    };

    // Get bookings for selected date
    const getBookingsForDate = (date) => {
        return filteredBookings.filter(b => isSameDay(new Date(b.date), date));
    };

    // Get dates that have bookings
    const getDatesWithBookings = () => {
        return filteredBookings.map(b => new Date(b.date));
    };

    // Get upcoming appointments (next 7 days)
    const getUpcomingAppointments = () => {
        const now = new Date();
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return bookings
            .filter(b => {
                const bookingDate = new Date(b.date);
                return bookingDate >= now && bookingDate <= sevenDaysLater && b.status !== "cancelled" && b.status !== "completed";
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);
    };

    const stats = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === "confirmed").length,
        completed: bookings.filter(b => b.status === "completed").length,
        pending: bookings.filter(b => b.status === "pending" || b.status === "initiated").length,
        revenue: bookings.filter(b => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + (b.amount || 0), 0)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading bookings...</div>
            </div>
        );
    }

    const selectedDateBookings = getBookingsForDate(selectedDate);
    const upcomingAppointments = getUpcomingAppointments();

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Total Bookings</CardDescription>
                        <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Confirmed</CardDescription>
                        <CardTitle className="text-3xl text-green-500">{stats.confirmed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Completed</CardDescription>
                        <CardTitle className="text-3xl text-blue-500">{stats.completed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Revenue</CardDescription>
                        <CardTitle className="text-3xl text-primary-gold">₹{stats.revenue.toLocaleString()}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Upcoming Appointments Card */}
            {upcomingAppointments.length > 0 && (
                <Card className="bg-gradient-to-br from-primary-gold/10 to-primary-gold/5 border-primary-gold/30">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Clock className="size-5 text-primary-gold" />
                            Upcoming Appointments (Next 7 Days)
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            {upcomingAppointments.length} appointment{upcomingAppointments.length !== 1 ? 's' : ''} scheduled
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {upcomingAppointments.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-white font-semibold">{format(new Date(booking.date), "MMM d, yyyy")}</div>
                                        <div className="text-white/60">•</div>
                                        <div className="text-white/80">{booking.time}</div>
                                    </div>
                                    <div className="text-sm text-white/60 mt-1">{booking.serviceName}</div>
                                    <div className="text-xs text-white/40">{booking.userName}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(booking.status)}
                                    {booking.status === "confirmed" && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatus(booking.id, "completed")}
                                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 h-7 text-xs"
                                        >
                                            Mark Done
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Filters & View Toggle */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                    <Input
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-gold"
                >
                    <option value="all" className="bg-neutral-900 text-white">All Status</option>
                    <option value="confirmed" className="bg-neutral-900 text-white">Confirmed</option>
                    <option value="completed" className="bg-neutral-900 text-white">Completed</option>
                    <option value="pending" className="bg-neutral-900 text-white">Pending</option>
                    <option value="initiated" className="bg-neutral-900 text-white">Initiated</option>
                    <option value="cancelled" className="bg-neutral-900 text-white">Cancelled</option>
                </select>
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-gold"
                >
                    <option value="all" className="bg-neutral-900 text-white">All Time</option>
                    <option value="upcoming" className="bg-neutral-900 text-white">Upcoming</option>
                    <option value="past" className="bg-neutral-900 text-white">Past</option>
                </select>
                <div className="flex gap-2">
                    <Button
                        onClick={() => setViewMode("table")}
                        variant={viewMode === "table" ? "default" : "outline"}
                        className={viewMode === "table" ? "bg-primary-gold text-black" : "bg-white/5 border-white/10 text-white"}
                    >
                        <List className="size-4 mr-2" />
                        Table
                    </Button>
                    <Button
                        onClick={() => setViewMode("calendar")}
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        className={viewMode === "calendar" ? "bg-primary-gold text-black" : "bg-white/5 border-white/10 text-white"}
                    >
                        <CalendarDays className="size-4 mr-2" />
                        Calendar
                    </Button>
                </div>
                <Button onClick={exportCSV} className="bg-primary-gold text-black hover:bg-primary-light">
                    <Download className="size-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-white/60">ID</TableHead>
                                        <TableHead className="text-white/60">User</TableHead>
                                        <TableHead className="text-white/60">Service</TableHead>
                                        <TableHead className="text-white/60">Date & Time</TableHead>
                                        <TableHead className="text-white/60">Amount</TableHead>
                                        <TableHead className="text-white/60">Status</TableHead>
                                        <TableHead className="text-white/60">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((booking) => (
                                        <TableRow key={booking.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell className="font-mono text-sm text-white/80">
                                                {booking.id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-white">{booking.userName}</div>
                                                <div className="text-xs text-white/40">{booking.userEmail}</div>
                                            </TableCell>
                                            <TableCell className="text-sm text-white/80">{booking.serviceName}</TableCell>
                                            <TableCell>
                                                <div className="text-sm text-white">{format(new Date(booking.date), "MMM d, yyyy")}</div>
                                                <div className="text-xs text-white/40">{booking.time}</div>
                                            </TableCell>
                                            <TableCell className="text-sm text-primary-gold font-semibold">
                                                ₹{booking.amount?.toLocaleString() || 0}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {booking.status === "initiated" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateStatus(booking.id, "confirmed")}
                                                            className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-7 text-xs"
                                                        >
                                                            Confirm
                                                        </Button>
                                                    )}
                                                    {booking.status === "confirmed" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateStatus(booking.id, "completed")}
                                                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 h-7 text-xs"
                                                        >
                                                            Mark Done
                                                        </Button>
                                                    )}
                                                    {booking.meetingLink && (
                                                        <a
                                                            href={booking.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary-gold hover:text-primary-light"
                                                        >
                                                            <ExternalLink className="size-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Calendar View */}
            {viewMode === "calendar" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Appointments Calendar</CardTitle>
                            <CardDescription className="text-white/60">Select a date to view bookings</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border border-white/10 bg-white/5 text-white"
                                modifiers={{
                                    booked: getDatesWithBookings()
                                }}
                                modifiersClassNames={{
                                    booked: "bg-primary-gold/20 text-primary-gold font-bold"
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Selected Date Bookings */}
                    <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">
                                {format(selectedDate, "MMMM d, yyyy")}
                            </CardTitle>
                            <CardDescription className="text-white/60">
                                {selectedDateBookings.length} appointment{selectedDateBookings.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedDateBookings.length === 0 ? (
                                <div className="text-center py-8 text-white/40">
                                    No appointments on this date
                                </div>
                            ) : (
                                selectedDateBookings.map((booking) => (
                                    <div key={booking.id} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-white font-semibold">{booking.time}</div>
                                                <div className="text-sm text-white/60">{booking.serviceName}</div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <div className="text-sm text-white/80">
                                            <div>{booking.userName}</div>
                                            <div className="text-xs text-white/40">{booking.userEmail}</div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2">
                                            {booking.status === "initiated" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateStatus(booking.id, "confirmed")}
                                                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-7 text-xs"
                                                >
                                                    Confirm
                                                </Button>
                                            )}
                                            {booking.status === "confirmed" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => updateStatus(booking.id, "completed")}
                                                    className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 h-7 text-xs"
                                                >
                                                    Mark Done
                                                </Button>
                                            )}
                                            {booking.meetingLink && (
                                                <a
                                                    href={booking.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-gold hover:text-primary-light text-xs flex items-center gap-1"
                                                >
                                                    <ExternalLink className="size-3" />
                                                    Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {viewMode === "table" && filteredBookings.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    No bookings found
                </div>
            )}
        </div>
    );
}
