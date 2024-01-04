import { useState } from "react";
import supabase from "./supabase";
export default function SignupForm({ setShowSignupForm, onSignup }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isUpLoading, setIsUpLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsUpLoading(true);
    const { data, error } = await supabase
      .from("user")
      .insert([{ name, password }]);

    setIsUpLoading(false);

    if (error) {
      console.error("Signup error:", error);
      alert("Signup failed");
    }
    if (!error) {
      console.log("Signup successful, data:", data);
      setName("");
      setPassword("");
      // Optionally call onSignup callback here
      onSignup(data);
      setShowSignupForm(false);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          className="sign-input"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="sign-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit" // 这里改为 submit 类型
          className="sign-input"
          //   onClick={() => {
          //     onSignup({
          //       /* 用户凭据 */
          //     });
          //     setShowSignupForm(false);
          //   }}
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
