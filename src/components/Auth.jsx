import { useState } from "react";

function Auth({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const handleSignup = () => {
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    const exists = users.find((u) => u.email === email);
    if (exists) {
      setError("User already exists");
      return;
    }

    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", email);
    onAuthSuccess();
  };

  const handleLogin = () => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedInUser", email);
    onAuthSuccess();
  };

  const handleForgotPassword = () => {
    const user = users.find((u) => u.email === email);
    if (!user) {
      setError("Email not registered");
      return;
    }
    setMessage("Password reset link sent (demo)");
    setError("");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="auth-subtitle">
          {isSignup
            ? "Sign up to start your typing journey"
            : "Login to continue your progress"}
        </p>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {isSignup && (
          <div className="name-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isSignup && (
          <p className="forgot" onClick={handleForgotPassword}>
            Forgot password?
          </p>
        )}

        <button onClick={isSignup ? handleSignup : handleLogin}>
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="switch">
          {isSignup ? "Already have an account?" : "New here?"}
          <span onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setMessage("");
          }}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
