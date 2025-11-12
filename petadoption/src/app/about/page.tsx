import Image from "next/image";

const About = () => {
    return ( 
        <div>
            <div className="text-center font-bold">
                <h1 className="text-5xl p-8 pt-16">About Us</h1>
                <p className="text-2xl p-4">Here are the steps to adoption.</p>
            </div>
            <div className="font-bold text-center flex space-evenly items-center  justify-evenly m-20">
                <h1 className="text-5xl p-8 pt-16">Research</h1>
                <Image src={"/research.jpg"} alt={"research image"} width={200} height={200}
                    className="w-[20%] aspect-square object-cover object-center"/>
                <div className="bg-blue-400 text-2xl w-[20%] aspect-square flex items-center justify-center text-center p-6">
                    Find a reputable adoption agency or professional and search for a pet that you want. 
                </div>
            </div>
            <div className="font-bold text-center flex space-evenly items-center  justify-evenly m-20">
                <div className="bg-blue-400 text-2xl w-[20%] aspect-square flex items-center justify-center text-center p-6">
                    Fill out adoption paperwork at the shelter or online. We will help you with this.  
                </div>
                <Image src={"/apply.jpg"} alt={"apply image"} width={200} height={200}
                    className="w-[20%] aspect-square object-cover object-center"/>
                <h1 className="text-5xl p-8 pt-16">Apply</h1>
            </div>
            <div className="font-bold text-center flex space-evenly items-center  justify-evenly m-20">
                <h1 className="text-5xl p-8 pt-16">Meet</h1>
                <Image src={"/meet.jpg"} alt={"meet image"} width={200} height={200}
                    className="w-[20%] aspect-square object-cover object-center"/>
                <div className="bg-blue-400 text-2xl w-[20%] aspect-square flex items-center justify-center text-center p-6">
                    Once approved, visit the pet and confirm your compatability with your potencial new pet. 
                </div>
            </div>
            <div className="font-bold text-center flex space-evenly items-center  justify-evenly m-20">
                <div className="bg-blue-400 text-2xl w-[20%] aspect-square flex items-center justify-center text-center p-6">
                    A social worker may visit your house to confirm your situation. Finally, complete paperwork and pay fees. 
                </div>
                <Image src={"/finalize.jpg"} alt={"finalize image"} width={200} height={200}
                    className="w-[20%] aspect-square object-cover object-center"/>
                <h1 className="text-5xl p-8 pt-16">Finalize</h1>
            </div>
        </div>
     );
}
 
export default About;