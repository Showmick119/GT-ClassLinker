interface ImageLeftSectionProps {
    title: string;
    text: string;
    img: string;
  }
  
const ImgRight: React.FC<ImageLeftSectionProps> = ({title, text, img}) => {
    return (
        <div className="flex items-center pt-10">
            <div className="md:w-1/2 flex justify-center">
                <img src={img} className="justify-center rounded-lg shadow-lg"></img>
            </div>
            <div className="w-full justify-between md:w-1/2 pr-8">
                <h2 className="font-bold text-2xl">{title}</h2>
                <p className="text-gray-600">{text}</p>
            </div>
            
        </div>
    );
};

export default ImgRight; 
