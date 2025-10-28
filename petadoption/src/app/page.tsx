import PetCard from "@/components/PetCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const Page = async ({ searchParams }: { searchParams?: Record<string, string> }) => {
    // Create Supabase client
    const supabase = createClient();

    // Allow a dynamic number of pets (default = 3)
    const petLimit = parseInt(searchParams?.count || "3", 10);

    // Fetch random pets from the Supabase function
    const { data: pets, error } = await supabase.rpc("get_random_pets", {
        limit_count: petLimit,
    });

    if (error) {
        console.error("Error fetching pets:", error.message);
    }

    return (
        <div className="font-bold">
            {/* Who we are section */}
            <div className="flex flex-col items-center justify-evenly">
                <h2 className="text-5xl p-8 pt-16">Who are we?</h2>
                <p className="text-2xl p-3 w-[70%] max-w-[800px]">
                We are a pet adoption organization dedicated to providing consumers
                    with only the very best in customer service and pet adoption
                    convenience. Search by shelter or by pet to find your best friend.
                    Browse the adoption process overview or view our about us page.
                </p>
            </div>

            {/* Featured pets section */}
            <div className="flex flex-col items-center justify-evenly">
                <h2 className="text-5xl p-8 m-8">Featured Pets</h2>

                <div className="flex flex-wrap justify-center gap-16">
                    {pets && pets.length > 0 ? (
                        pets.map((pet) => (
                            <Link
                                key={pet.PetID}
                                href={`/pets/${pet.PetID}`}
                                className="transform transition-transform hover:scale-105 hover:shadow-lg rounded-lg"
                            >
                                <PetCard
                                    name={pet.PetName}
                                    description={pet.PetDescription}
                                    imageUrl={pet.ImageURL || "/dog.jpeg"}
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-xl text-gray-500">
                            No pets available at the moment.
                        </p>
                    )}
                </div>
            </div>

            {/* Search by pet section */}
            <div className="flex justify-evenly items-center p-20">
                <Link href="/pets">
                    <Button className="w-60 h-20 text-2xl bg-blue-400 text-black font-bold">
                        Search by Pet
                    </Button>
                </Link>
                <p className="text-2xl p-8 w-100 rounded-lg">
                    We have a wide variety of dog and cat breeds. We also have other types
                    of pets like reptiles and mammals.
                </p>
            </div>

            {/* Search by shelter section */}
            <div className="flex justify-evenly items-center p-20">
                <p className="text-2xl p-8 w-100 rounded-lg">
                    View an extensive network of shelters in your local area. Message them
                    to continue the adoption process.
                </p>
                <Link href="/shelters">
                    <Button className="w-60 h-20 text-2xl bg-blue-400 text-black font-bold">
                        Search by Shelter
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Page;
