import PetCard from "@/components/PetCard";
import { Button } from "@/components/ui/button";

const Page = () => {
    return ( 
      <div className="font-bold">
          <div className="flex flex-col items-center justify-evenly">
              <h2 className="text-5xl p-8">Who are we?</h2>
              <p className="text-2xl p-8 w-[40%]">
                  We are a pet adoption organization dedicated to providing consumers with only the very best in customer service 
                  and pet adoption convience. Search by shelter or by pet to find your best friend. 
                  Browse the adoption process overview or view our about us page. 
              </p>
          </div>
          <div className="flex flex-col items-center justify-evenly">
              <h2 className="text-5xl p-8 m-8">Featured Pets</h2>
              <div className="flex flex-wrap justify-center gap-16">
                  <PetCard name="Tom" description="Loves to play." imageUrl="/dog.jpeg" />
                  <PetCard name="Shadow" description="Easily scared." imageUrl="/dog.jpeg" />
                  <PetCard name="Max" description="Always hungry." imageUrl="/dog.jpeg" />
              </div>
          </div>
          <div className="flex justify-evenly items-center p-20">
              <Button className="size-[20%] h-20 text-2xl bg-blue-400 text-black text-bold">
                  Search by Pet
              </Button>
              <p className="text-2xl p-8 w-[30%] rounded-lg">
                  We have a wide variety of dog and cat breeds. We also have other types of pets like reptiles and mammals.
              </p>
          </div>
          <div className="flex justify-evenly items-center p-20">
              <p className="text-2xl p-8 w-[30%] rounded-lg">
                  View an extensive network of shelters in your local area. Message them to continue the adoption process. 
              </p>
              <Button className="size-[20%] text-2xl h-20 bg-blue-400 text-black text-bold">
                  Search by Shelter
              </Button>
          </div>
      </div>
    );
}
 
export default Page;