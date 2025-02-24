import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; 
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";  

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-white items-center justify-center">
      {/* Login Card */}
      <div className="w-full max-w-lg bg-white p-10 rounded-lg shadow-lg border border-gray-200 text-center">
        
        <img src={loginImage} alt="Login Illustration" className="w-96 mx-auto mb-4" />

      
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn}>
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Login Now
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-md text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-orange-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
