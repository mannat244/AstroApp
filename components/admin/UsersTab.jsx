"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Search, Mail, Calendar, User, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function UsersTab() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(u =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const stats = {
        total: users.length,
        onboarded: users.filter(u => u.onboarded).length,
        pending: users.filter(u => !u.onboarded).length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Total Users</CardDescription>
                        <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Onboarded</CardDescription>
                        <CardTitle className="text-3xl text-green-500">{stats.onboarded}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Pending</CardDescription>
                        <CardTitle className="text-3xl text-yellow-500">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <Card key={user.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <CardContent className="p-4">
                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <Avatar className="size-12 border-2 border-primary-gold/30">
                                    <AvatarImage src={user.photo} alt={user.name} />
                                    <AvatarFallback className="bg-primary-gold/20 text-primary-gold">
                                        {user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold truncate">{user.name || "Unknown"}</h3>
                                    <div className="flex items-center gap-1 text-xs text-white/40 mt-1">
                                        <Mail className="size-3" />
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 text-xs mb-4">
                                {user.gender && (
                                    <div className="flex items-center gap-2 text-white/60">
                                        <User className="size-3" />
                                        <span>{user.gender}</span>
                                    </div>
                                )}
                                {user.dob && (
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Calendar className="size-3" />
                                        <span>DOB: {user.dob}</span>
                                    </div>
                                )}
                                {user.birthCity && (
                                    <div className="flex items-center gap-2 text-white/60">
                                        <MapPin className="size-3" />
                                        <span>{user.birthCity}, {user.birthCountry || "India"}</span>
                                    </div>
                                )}
                                {user.whatsapp && (
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Phone className="size-3" />
                                        <span>{user.whatsapp}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-white/60">
                                    <Calendar className="size-3" />
                                    <span>Joined {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "Unknown"}</span>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="pt-3 border-t border-white/10">
                                <Badge className={
                                    user.onboarded
                                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                }>
                                    {user.onboarded ? "Onboarded" : "Pending"}
                                </Badge>
                                {user.role && user.role !== "user" && (
                                    <Badge className="ml-2 bg-primary-gold/20 text-primary-gold border-primary-gold/30">
                                        {user.role}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    No users found
                </div>
            )}
        </div>
    );
}
