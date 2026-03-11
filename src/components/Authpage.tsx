import React, { useState } from "react";
import Login from "./Login.js";
import SignUp from "./Signup.js";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

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
