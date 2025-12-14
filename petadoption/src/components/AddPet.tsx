"use client";

import {useState} from "react";
import { createClient } from "@/utils/supabase/client";

export default function AddPet() {
    const supabase = createClient();

    const[form, setForm] = useState({
        PetName: "",
        Species: "",
        Breed: "",
        Birthdate: "",
        Size: "",
        Gender: "",
        PetDescription: "",
        Status: "available"
    });

    const [loading, setLoading] = useState(false);
    const [allowed, setAllowed] = useState<boolean | null>(null);

    async function isShelter() {
        const {data: {user}} = await supabase.auth.getUser();
        if(!user) return setAllowed(false);

        const {data} = await supabase.from("Profile").select("Role").eq("ProfileID", user.id).single();

        setAllowed(data?.Role === "Shelter");
    }

    useState(() => {
        isShelter();
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const{data: {user}} = await supabase.auth.getUser();
        if(!user) {
            setLoading(false);
            return;
        }
        const {error} = await supabase.from("Pet").insert({...form, Species: form.Species.toLowerCase(), Size: form.Size.toLowerCase(), 
            Gender: form.Gender.toLowerCase(), ProfileID: user.id});

        setLoading(false);

        if(error) {
            alert(error.message);
            return;
        }

        alert("Pet added successfully!");
        
        setForm({
            PetName: "",
            Species: "",
            Breed: "",
            Birthdate: "",
            Size: "",
            Gender: "",
            PetDescription: "",
            Status: "available"
        });
    }

    if (allowed === null) return <p>Loading Add Pet...</p>;

    return (
        <form onSubmit={handleSubmit} className="border p-6 w-full max-w-xl rounded-lg">
            <h2 className="text-center text-2xl font-bold m-4">Add Pet</h2>

            {Object.entries(form).map(([key, value]) => (
                    <div key={key} className="m-4">
                        <label className="block m-2">{key}</label>
                        <input type={"text"} value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            className="w-full p-2 border rounded"/>
                    </div>
            ))}

            <button type="submit" disabled={loading} className="m-4 bg-green-400 p-4 rounded">
                {loading ? "Adding..." : "Add Pet"}
            </button>
        </form>
    );
}