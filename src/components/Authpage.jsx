import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center mt-6">
      {isLogin ? <Login /> : <SignUp />}

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-sm text-primary underline"
      >
        {isLogin
          ? "Don't have an account? Sign Up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default AuthPage;
