"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, Plus, Edit, Trash2, Package, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function ServicesTab() {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        paymentUrl: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [searchTerm, services]);

    const fetchServices = async () => {
        try {
            const snapshot = await getDocs(collection(db, "service_categories"));
            const allServices = [];

            snapshot.docs.forEach(doc => {
                const categoryData = doc.data();
                const categoryId = doc.id;

                if (categoryData.items && Array.isArray(categoryData.items)) {
                    categoryData.items.forEach((item, index) => {
                        allServices.push({
                            ...item,
                            categoryId,
                            categoryName: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
                            itemIndex: index
                        });
                    });
                }
            });

            setServices(allServices);
            setFilteredServices(allServices);
        } catch (error) {
            console.error("Error fetching services:", error);
            alert("Failed to load services. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        if (!searchTerm) {
            setFilteredServices(services);
            return;
        }

        const filtered = services.filter(s =>
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(filtered);
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            errors.name = "Service name must be at least 3 characters";
        } else if (formData.name.length > 100) {
            errors.name = "Service name must be less than 100 characters";
        }

        if (!formData.description || formData.description.trim().length < 10) {
            errors.description = "Description must be at least 10 characters";
        } else if (formData.description.length > 500) {
            errors.description = "Description must be less than 500 characters";
        }

        const price = parseInt(formData.price);
        if (!formData.price || isNaN(price)) {
            errors.price = "Price is required and must be a number";
        } else if (price < 100) {
            errors.price = "Price must be at least ₹100";
        } else if (price > 100000) {
            errors.price = "Price must be less than ₹100,000";
        }

        // Payment URL validation
        if (!formData.paymentUrl || formData.paymentUrl.trim().length === 0) {
            errors.paymentUrl = "Payment URL is required";
        } else if (!formData.paymentUrl.startsWith("https://")) {
            errors.paymentUrl = "Payment URL must start with https://";
        } else if (!formData.paymentUrl.includes("payu.in")) {
            errors.paymentUrl = "Payment URL must be a PayU link (payu.in)";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setSaving(true);
        try {
            const serviceData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseInt(formData.price),
                paymentUrl: formData.paymentUrl.trim()
            };

            if (editingService) {
                // Update existing service
                const categoryRef = doc(db, "service_categories", editingService.categoryId);

                // Get current items
                const currentServices = services.filter(s => s.categoryId === editingService.categoryId);
                const updatedItems = currentServices.map((s, idx) =>
                    idx === editingService.itemIndex ? serviceData : {
                        name: s.name,
                        description: s.description,
                        price: s.price,
                        paymentUrl: s.paymentUrl || ""
                    }
                );

                await updateDoc(categoryRef, { items: updatedItems });

                // Update local state
                setServices(prev => prev.map(s =>
                    s.categoryId === editingService.categoryId && s.itemIndex === editingService.itemIndex
                        ? { ...s, ...serviceData }
                        : s
                ));
            }

            setIsDialogOpen(false);
            resetForm();
            await fetchServices(); // Refresh to get latest data
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Failed to save service. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            description: service.description,
            paymentUrl: service.paymentUrl || ""
        });
        setFormErrors({});
        setIsDialogOpen(true);
    };

    const handleDelete = async (service) => {
        setDeleteConfirm(service);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            const categoryRef = doc(db, "service_categories", deleteConfirm.categoryId);

            // Get current items and remove the one to delete
            const currentServices = services.filter(s => s.categoryId === deleteConfirm.categoryId);
            const updatedItems = currentServices
                .filter((s, idx) => idx !== deleteConfirm.itemIndex)
                .map(s => ({
                    name: s.name,
                    description: s.description,
                    price: s.price,
                    paymentUrl: s.paymentUrl || ""
                }));

            await updateDoc(categoryRef, { items: updatedItems });

            setDeleteConfirm(null);
            await fetchServices(); // Refresh data
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Failed to delete service. Please try again.");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            description: "",
            paymentUrl: ""
        });
        setFormErrors({});
        setEditingService(null);
    };

    const stats = {
        total: services.length,
        astrology: services.filter(s => s.categoryId === "astrology").length,
        vastu: services.filter(s => s.categoryId === "vastu").length
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading services...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Total Services</CardDescription>
                        <CardTitle className="text-3xl text-white">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Astrology</CardDescription>
                        <CardTitle className="text-3xl text-blue-500">{stats.astrology}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-white/60">Vastu</CardDescription>
                        <CardTitle className="text-3xl text-green-500">{stats.vastu}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                    <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="size-12 text-white/20 mb-4" />
                        <p className="text-white/40 text-center">No services found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredServices.map((service, idx) => (
                        <Card key={`${service.categoryId}-${idx}`} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Badge className="mb-2 bg-white/10 text-white/80 border-white/20">
                                            {service.categoryName}
                                        </Badge>
                                        <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                                        <CardDescription className="text-primary-gold font-semibold text-xl mt-2">
                                            ₹{service.price.toLocaleString()}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-white/60 text-sm line-clamp-3">{service.description}</p>
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(service)}
                                        className="text-white/60 hover:text-white hover:bg-white/10"
                                    >
                                        <Edit className="size-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(service)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-neutral-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Update service details in Firestore
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">Service Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Kundali Reading"
                                className="bg-white/5 border-white/10 text-white"
                            />
                            {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">Description *</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Detailed description of the service..."
                                rows={3}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                            />
                            {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">Price (₹) *</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="2000"
                                className="bg-white/5 border-white/10 text-white"
                            />
                            {formErrors.price && <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>}
                        </div>
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">PayU Payment URL *</label>
                            <Input
                                value={formData.paymentUrl}
                                onChange={(e) => setFormData({ ...formData, paymentUrl: e.target.value })}
                                placeholder="https://dashboard-staging.payu.in/web/..."
                                className="bg-white/5 border-white/10 text-white"
                            />
                            {formErrors.paymentUrl && <p className="text-red-400 text-xs mt-1">{formErrors.paymentUrl}</p>}
                            <p className="text-xs text-white/40 mt-1">PayU payment link for this service</p>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="bg-primary-gold text-black hover:bg-primary-light"
                            >
                                <Save className="size-4 mr-2" />
                                {saving ? "Saving..." : "Update Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent className="bg-neutral-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Delete Service?</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteConfirm(null)}
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
