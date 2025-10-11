import { createClient } from "@/utils/supabase/server";

export default async function PetsPage(props: { searchParams?: Record<string, string | undefined> }) {
    const searchParams = await props.searchParams ?? {};
    let pets = [];
    let errorMessage = "";

    try {
        const supabase = await createClient();

        const city = searchParams.city || "";
        const name = searchParams.name || "";
        const state = searchParams.state || "";
        const zip = searchParams.zip || "";
        const species = searchParams.species || "";
        const breed = searchParams.breed || "";
        const gender = searchParams.gender || "";
        const size = searchParams.size || "";
        const age = searchParams.age || "";

        let query = supabase.from("pet_search_view").select("*");
        if (city) query = query.ilike("City", `%${city}%`);
        if (state) query = query.ilike("State", `%${state}%`);
        if (zip) query = query.ilike("Zip", `%${zip}%`);
        if (species) query = query.ilike("Species", `%${species}%`);
        if (breed) query = query.ilike("Breed", `%${breed}%`);
        if (name) query = query.ilike("PetName", `%${name}%`);
        if (gender) query = query.ilike("Gender", `%${gender}%`);
        if (size) query = query.ilike("Size", `%${size}%`);

        if (age) {
            const ageNum = Number(age);
            if (!isNaN(ageNum)) {
                const today = new Date();
                const maxDate = new Date(today.getFullYear() - ageNum, today.getMonth(), today.getDate());
                const minDate = new Date(today.getFullYear() - ageNum - 1, today.getMonth(), today.getDate() + 1);
                query = query.gte("Birthdate", minDate.toISOString()).lte("Birthdate", maxDate.toISOString());
            }
        }

        const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      errorMessage = error.message;
    } else {
      pets = data || [];
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    errorMessage = err instanceof Error ? err.message : String(err);
  }

    function calculateAge(birthdate: string): string {
    if (!birthdate) return "Unknown Age";
        const birth = new Date(birthdate);
        const today = new Date();
        const age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0) {
            return `${age - 1}`;
        }
        return `${age}`;
    }

  return (
    <div>
        <h1 className="text-3xl font-bold text-center m-8">
            Find Your Perfect Pet
        </h1>

        <form className="flex flex-col items-center justify-center m-6 w-full max-w-6xl mx-auto" method="GET">
        <div className="grid grid-cols-3 w-full m">
            <input type="text" name="city" placeholder="City" className="border p-3 w-full"/>
            <input type="text" name="state" placeholder="State" className="border p-3 w-full"/>
            <input type="text" name="zip" placeholder="Zip" className="border p-3 w-full"/>
        </div>

        <div className="grid grid-cols-3 w-full">
            <input type="text" name="name" placeholder="Name" className="border p-3 w-full"/>
            <select name="gender" className="border p-3 w-full">
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            <input type="text" name="age" placeholder="Age" className="border p-3 w-full"/>
        </div>

        <div className="grid grid-cols-3 w-full">
            <input type="text" name="species" placeholder="Species" className="border p-3 w-full"/>
            <input type="text" name="breed" placeholder="Breed" className="border p-3 w-full"/>
            <select name="size" className="border p-3 w-full">
                <option value="">Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
            </select>
        </div>

        <div className="flex w-full justify-center">
            <button type="reset" className="cursor-pointer p-4 font-bold bg-red-200 text-red-500 w-[20%]">
                Clear
            </button>
            <button type="submit" className="cursor-pointer p-4 font-bold bg-blue-400 w-[20%]">
                Search
            </button>
        </div>
        </form>

        {errorMessage ? (
            <p className="text-red-400 text-center m-6">
                No pets found: {errorMessage}
            </p>
        ) : pets.length > 0 ? (
        <div className="flex flex-wrap justify-center p-6 m-8 ">
            {pets.map((pet) => (
                <div key={pet.PetID} className="cursor-pointer border m-8 p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                    <img src={pet.image_url || "/dog.jpeg"} alt={pet.name} className="w-48 h-48 object-cover m-3"/>
                    <h2 className="text-xl font-semibold">{pet.PetName} ({calculateAge(pet.Birthdate)} {pet.Gender?.charAt(0)})</h2>
                    <p className="">{pet.Size} {pet.Species} - {pet.Breed}</p>
                    <p className="">{pet.City} {pet.State}, {pet.Zip}</p>
                    <p>{pet.PetDescription}</p>
                </div>
            ))}
        </div>
        ) : (
            <p className="text-center">No pets</p>
        )}
    </div>
    );
}
