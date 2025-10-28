import {createClient} from "@/utils/supabase/server";
import Image from "next/image";

export default async function ShelterPage({params}: {params:{id:string}}) {
    const supabase = await createClient();

    const{data: shelter, error} = await supabase.from("Profile").select("*").eq("ProfileID", params.id).single();
    
    if(error || !shelter) {
        return(
            <div className="text-red-500 text-center text-5xl">
                Pet not found?
            </div>
        )
    }

    return(
        <div className="flex flex-col items-center border-collapse justify-center p-6">
            <h1 className="text-4xl font-bold m-6">{shelter.ProfileName}</h1>
            <Image className="m-6" src={shelter.ImageURL} alt={shelter.ProfileName} width={300} height={300}/>
        
            <h2 className="text-4xl font-bold m-6">Details</h2>
            <table className="min-w-[400px] w-[600px] border shadow-md">
                <tbody>

                </tbody>
                <tr>
                    <td className="p-4 font-semibold border w-40">Address</td>
                    <td className="p-4 border text-center">{shelter.Address}, {shelter.City} {shelter.State}, {shelter.Zip}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Contact Email</td>
                    <td className="p-4 border text-center">{shelter.ProfileEmail}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border ">Contact Phone</td>
                    <td className="p-4 border text-center">{shelter.Phone}</td>
                </tr>
                <tr>
                    <td className="p-4 font-semibold border">Description</td>
                    <td className="p-4 border text-center">{shelter.ProfileDescription}</td>
                </tr>
            </table>
        </div>
    )
}