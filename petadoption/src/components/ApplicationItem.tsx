import {useState} from "react";

export default function ApplicationItem({ app }: { app: any }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="min-w-150 border rounded p-4 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center gap-8">
                <div>
                    <p className="font-semibold">
                        Application for: {app.PetName || "Unknown Pet"}
                    </p>
                    <p className="text-sm text-gray-600">
                        Submitted: {new Date(app.ApplicationDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        Shelter: {app.ShelterName} ({app.ShelterCity}, {app.ShelterState})
                    </p>
                    <p className="font-medium mt-1">
                        Status:{" "}
                        <span
                            className={
                                app.Status === "approved"
                                    ? "text-green-600"
                                    : app.Status === "rejected"
                                        ? "text-red-600"
                                        : "text-yellow-600"
                            }
                        >
                            {app.Status}
                        </span>
                    </p>
                </div>

                <button
                    className="btn-secondary"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? "Hide Details" : "View Details"}
                </button>
            </div>

            {/* Expanded full details */}
            {expanded && (
                <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                    <p><strong>Residence Type:</strong> {app.ResidenceType}</p>
                    <p><strong>Own or Rent:</strong> {app.OwnOrRent}</p>
                    <p><strong>Household Members:</strong> {app.HouseholdMembers}</p>
                    <p><strong>Has Allergies:</strong> {app.HasAllergies ? "Yes" : "No"}</p>
                    <p><strong>Current Pets:</strong> {app.CurrentPets}</p>
                    <p><strong>Previous Pets:</strong> {app.PreviousPets}</p>
                    <p><strong>Hours Alone Per Day:</strong> {app.HoursAlonePerDay}</p>
                    <p><strong>Pet Location When Alone:</strong> {app.PetLocationWhenAlone}</p>
                    <p><strong>Pet Sleep Location:</strong> {app.PetSleepLocation}</p>
                    <p><strong>Vet Name:</strong> {app.VetName}</p>
                    <p><strong>Vet Phone:</strong> {app.VetPhone}</p>
                    <p><strong>Why Adopt:</strong> {app.WhyAdopt}</p>
                    <p><strong>Experience With Pets:</strong> {app.ExperienceWithPets}</p>
                    <p><strong>References:</strong> {app.References}</p>
                    <p><strong>Agreed To Terms:</strong> {app.AgreedToTerms ? "Yes" : "No"}</p>
                    <p><strong>Signature:</strong> {app.Signature}</p>

                    {app.ShelterNotes && (
                        <p><strong>Shelter Notes:</strong> {app.ShelterNotes}</p>
                    )}
                </div>
            )}
        </div>
    );
}
