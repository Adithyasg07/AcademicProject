import { useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-10">

      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Start Your Organic Journey
      </h1>

      <p className="text-gray-600 text-center max-w-xl mb-8">
        Switch to healthy organic groceries. Learn how to plan your organic
        shopping and improve your lifestyle.
      </p>

      {/* Video Section */}
      <div className="w-full max-w-3xl mb-8">
        <iframe
          className="w-full h-[400px] rounded-xl shadow-lg"
          src="https://www.instagram.com/organictattva/reel/DVANWjlgW8D/"
          title="Organic Food Plan"
          allow="fullscreen"
        ></iframe>
      </div>

      {/* Get Started Button */}
      <button
        onClick={() => navigate("/home")}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition"
      >
        Get Started
      </button>

    </div>
  );
}

export default GetStarted;