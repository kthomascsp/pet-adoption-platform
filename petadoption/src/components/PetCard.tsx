import Image from "next/image";

interface PetCardProps {
  name: string;
  description: string;
  imageUrl: string;
}

const PetCard: React.FC<PetCardProps> = ({ name, description, imageUrl }) => {
  return (
    <div className="max-w-sm overflow-hidden bg-blue-400 hover:shadow-xl rounded-lg">
        <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={200}
            className="w-[400px] h-[200px] object-cover object-center"
        />
        <div className="p-4 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-sm">{description}</p>
        </div>
    </div>
  );
};

export default PetCard;