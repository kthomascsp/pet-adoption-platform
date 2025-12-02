import Image from "next/image";

const About = () => {
    return ( 
        <div>
            <div className="text-center font-bold">
                <h1 className="text-5xl p-8 pt-16">About Us</h1>
                <p className="text-2xl p-4 mx-auto w-[40%]">We are a pet adoption agency committed to providing our clients with the 
                    best possible experience with their pet adoption needs. 
                </p>
            </div>
            <Image src={"/petadoption.jpg"} alt={"adoption shelter image"} width={200} height={200} className="w-[30%] aspect-square object-cover object-center mx-auto p-8"/>
            <div className="text-center font-bold">
                <h2 className="text-3xl p-6 pt-14">Created By:</h2>
                <p className="text-2xl p-4 mx-auto w-[40%]">Elisha Bjerkeset<br />Carl Fredrickson<br />Kristen Thomas</p>
            </div>
        </div>
     );
}
 
export default About;