import { useState } from "react";

interface ApplicationItemProps {
    app: any;
    isShelter?: boolean;
    onUpdateStatus?: (appId: number, newStatus: string) => void;
    onUpdateNotes?: (appId: number, notes: string) => void;
}

export default function ApplicationItem({
                                            app,
                                            isShelter = false,
                                            onUpdateStatus,
                                            onUpdateNotes,
                                        }: ApplicationItemProps) {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState(app.ShelterNotes || "");
    const [savingNotes, setSavingNotes] = useState(false);

    const saveNotes = async () => {
        if (!onUpdateNotes) return;
        setSavingNotes(true);
        await onUpdateNotes(app.ApplicationID, notes);
        setSavingNotes(false);
    };

    return (
        <div className="min-w-150 border rounded p-4 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center gap-8">
                <div>
                    <p className="font-semibold">
                        Application for:&nbsp;
                        <a href={`/pets/${app.PetID}`} className="underline text-blue-500">
                            {app.PetName || "Unknown Pet"}
                        </a>
                    </p>
                    <p className="text-sm text-gray-600">
                        Submitted: {new Date(app.ApplicationDateTime).toLocaleString()}
                    </p>

                    {isShelter && (
                        <p className="text-sm text-gray-600">
                            Applicant: {app.ApplicantName}
                        </p>
                    )}

                    {!isShelter && (
                        <p className="text-sm text-gray-600">
                            Shelter: {app.ShelterName} ({app.ShelterCity}, {app.ShelterState})
                        </p>
                    )}

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
                            {app.Status.toUpperCase()}
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

            {expanded && (
                <div className="mt-4 border-t pt-4 space-y-2 text-sm">
                    {/* Applicant info */}
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

                    {/* Shelter-only review section */}
                    {isShelter && (
                        <div className="mt-4 p-3 bg-white border rounded space-y-3">
                            <h3 className="font-semibold text-lg">Shelter Review</h3>

                            <label className="font-medium">Shelter Notes:</label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button
                                    className="btn-primary"
                                    onClick={saveNotes}
                                    disabled={savingNotes}
                                >
                                    {savingNotes ? "Saving..." : "Save Notes"}
                                </button>
                            </div>

                            <div className="flex gap-3 mt-3">
                                <button
                                    className="btn-success"
                                    onClick={() => onUpdateStatus?.(app.ApplicationID, "approved")}
                                >
                                    Approve
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() => onUpdateStatus?.(app.ApplicationID, "rejected")}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
