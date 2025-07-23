import ImgRight from "../components/ImgRight";
import ImgLeft from "../components/ImgLeft";
const About = () => {
  return (
    <section className="absolute pt-20 inset-0 flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-700 to-yellow-500 overflow-hidden">
      {/* About Header */}
      <div className="text-center max-w-4xl w-full">
        <h2 className="text-5xl font-extrabold text-white">About Us</h2>
        <h3 className="text-lg font-extrabold text-white mt-2">
          Connecting Georgia Tech students with better academic tools.
        </h3>
      </div>

      {/* Content Section */}
      <div className="mt-12 space-y-12 w-full max-w-5xl">
        {/* Our Mission */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-between min-h-[300px]">
          <div className="w-1/2 pr-6">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-lg font-bold text-gray-500">
              Our mission is to simplify the academic journey for Georgia Tech students by 
              providing easy-to-use tools for scheduling and class planning.
            </p>
          </div>
          <div className="w-1/2 flex justify-center">
            <img  
              src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Georgia_Tech%27s_Buzz_logo.svg/200px-Georgia_Tech%27s_Buzz_logo.svg.png" 
              alt="GT Buzz Logo"
              className="w-50 h-auto"
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-between min-h-[300px]">
          <div className="w-1/2 flex justify-center">
            <img 
              src="https://ramblinwreck.com/imgproxy/WKTS5PVxTppr1N2WZr2q0QIIbrebzVDufJuMwCDWCwg/fit/2500/2500/ce/0/aHR0cHM6Ly9yYW1ibGlud3JlY2suY29tL3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDIzLzA1L01pc3NfMDkxNzIyX0RLLTYxMy5qcGc.jpg" 
              alt="GT Mascot"
              className="w-100 h-auto rounded-lg"
            />
          </div>
          <div className="w-1/2 pl-6">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-3">Features</h3>
            <p className="text-lg font-bold text-gray-500">
              GT ClassLinker offers features like a real-time schedule conflict checker, 
              personalized course recommendations, and a user-friendly interface designed 
              specifically for Georgia Tech students.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
