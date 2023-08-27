import { Alert, Input, Space } from "antd";
import React, { useState, useEffect } from 'react';
import SparkButton from "../components/button";
import { useNavigate } from "react-router-dom";
// import { signIn, AuthDetails } from "../utils/firebase_config";
import { useAuth } from "../context/auth_context";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, signIn } = useAuth();
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    await signIn(email, password);
    navigate('/445bde24-bbb1-47a9-82aa-c4c3fd956c14');
    setLoading(false)
  };

  const handleRegister = () => {
    navigate("/445bde24-bbb1-47a9-82aa-c4c3fd956c14-register")
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center w-full">
      <img
        className="h-12 mb-10"
        src="./assets/logo.png"
        alt="" />
      <div className=" bg-white p-12 rounded-lg w-1/2 mx-auto flex flex-col gap-3">
        <div>
          <h3 className="text-[24px] font-semibold mb-2">Admin Login</h3>
          <h3 className="text-[16px] text-gray-500 mb-4">Please login with your admin credentials to continue</h3>
        </div>
        {error && <Space
          direction="vertical"
          style={{
            width: '100%',
          }}
        >
          <Alert message={error.message === "Firebase: Error (auth/user-not-found)." ? "User not found, please register" : error.message} type="error" />
        </Space>}

        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="Email"
          value={email}
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="Password"
          value={password}
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <h3
          onClick={
            handleRegister
          }
          className="w-full place-content-end cursor-pointer flex text-[13px] text-green font-medium mt-2">
          Don't have an account?
        </h3> */}
        <SparkButton
          className={"mt-4 w-full"}
          isButtonValid={true}
          handleOnClick={handleSignIn}
          loading={loading}
          buttonLoadingText="Signing in..."
          buttonText="Sign In" />
      </div>
    </div>
  );
}

export default SignIn;
