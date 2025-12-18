"use client";

import { useState } from "react";
import { submitApplication } from "./actions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ApplyForm({ petId }: { petId: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect to login if not authenticated
    if (!user) {
        router.replace("/login");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.append("PetID", petId);

        try {
            await submitApplication(formData);
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-7">
            <input type="hidden" name="PetID" value={petId} />

            {/* ==== Residence ==== */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Residence Type <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="ResidenceType"
                        required
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    >
                        <option value="">-- select --</option>
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="condo">Condo</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Own or Rent? <span className="text-red-600">*</span>
                    </label>
                    <select
                        name="OwnOrRent"
                        required
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    >
                        <option value="">-- select --</option>
                        <option value="own">Own</option>
                        <option value="rent">Rent</option>
                    </select>
                </div>
            </div>

            {/* ==== Household ==== */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Number of people in household <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="number"
                        name="HouseholdMembers"
                        min="1"
                        required
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                </div>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        name="HasAllergies"
                        id="allergies"
                        className="h-5 w-5 text-blue-600 border-2 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="allergies" className="text-sm font-medium text-gray-700">
                        Anyone in household has pet allergies
                    </label>
                </div>
            </div>

            {/* ==== Current / Previous Pets ==== */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Current pets (list species/age)
                    </label>
                    <textarea
                        name="CurrentPets"
                        rows={2}
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-y"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Previous pets (list species/age/outcome)
                    </label>
                    <textarea
                        name="PreviousPets"
                        rows={2}
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-y"
                    />
                </div>
            </div>

            {/* ==== Daily Routine ==== */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Hours pet will be alone per day <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="number"
                        name="HoursAlonePerDay"
                        min="0"
                        max="24"
                        required
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Where will pet stay when alone? <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="PetLocationWhenAlone"
                        required
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Where will pet sleep at night? <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    name="PetSleepLocation"
                    required
                    className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
            </div>

            {/* ==== Vet Info ==== */}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Vet name (if any)
                    </label>
                    <input
                        type="text"
                        name="VetName"
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1">
                        Vet phone (if any)
                    </label>
                    <input
                        type="text"
                        name="VetPhone"
                        className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                    />
                </div>
            </div>

            {/* ==== Motivation & Experience ==== */}
            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Why do you want to adopt? <span className="text-red-600">*</span>
                </label>
                <textarea
                    name="WhyAdopt"
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-y"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Describe your experience with pets <span className="text-red-600">*</span>
                </label>
                <textarea
                    name="ExperienceWithPets"
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-y"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Personal references (name + phone)
                </label>
                <textarea
                    name="References"
                    rows={2}
                    className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition resize-y"
                />
            </div>

            {/* ==== Terms & Signature ==== */}
            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    name="AgreedToTerms"
                    id="terms"
                    required
                    className="h-5 w-5 text-blue-600 border-2 border-gray-400 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm font-medium text-gray-700">
                    I agree to the adoption terms and conditions <span className="text-red-600">*</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Full name (signature) <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    name="Signature"
                    required
                    className="w-full px-4 py-2.5 text-base border-2 border-gray-400 rounded-md focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                />
            </div>

            {/* ==== Submit ==== */}
            {error && <p className="text-red-600 font-medium">{error}</p>}

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-md transition text-lg"
            >
                {submitting ? "Submitting…" : "Submit Application"}
            </button>
        </form>
    );
}