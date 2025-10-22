import {createClient} from "@/utils/supabase/server";
import Image from "next/image";

export default async function PetPage({params}: {params:{id:string}}) {
    const supabase = await createClient();

    const{data: pet, error} = await supabase.from("pet_search_view").select("*").eq("PetID", params.id).single();
    
    if(error || !pet) {
        return(
            <div className="text-red-500 text-center text-5xl">
                Pet not found?
            </div>
        )
    }

    function calculateAge(birthdate: string): string {
        if (!birthdate) return "Unknown Age";
        const birth = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        // Adjust age if birthday hasn’t occurred yet this year
        if (monthDifference < 0) {
            return `${age - 1}`;
        }
        return `${age}`;
    }

    return(
        <div className="flex flex-col items-center border-collapse justify-center p-6">
            <h1 className="text-4xl font-bold m-6">{pet.PetName}</h1>
            <Image className="m-6" src={pet.ImageURL} alt={pet.PetName} width={300} height={300}/>
        
            <h2 className="text-4xl font-bold m-6">Details</h2>
            <table className="min-w-[400px] w-[600px] border shadow-md">
                <tr>
                    <td className="p-4 font-semibold border w-40">Species</td>
                    <td className="p-4 border text-center">{pet.Species}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Breed</td>
                    <td className="p-4 border text-center">{pet.Breed}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Gender</td>
                    <td className="p-4 border text-center">{pet.Gender}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Age</td>
                    <td className="p-4 border text-center">{calculateAge(pet.Birthdate)}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Size</td>
                    <td className="p-4 border text-center">{pet.Size}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Location</td>
                    <td className="p-4 border text-center">
                    {pet.City}, {pet.State} {pet.Zip}
                    </td>
                </tr>
            </table>
        </div>
    )
}