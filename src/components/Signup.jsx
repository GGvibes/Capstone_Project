import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ setToken }) {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);
    setSuccessMessage(null);

    const validationError = validateForm({
      firstName,
      lastName,
      email,
      password,
      address,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "An error occurred during registration.");
        return;
      }

      setSuccessMessage("Registration successful! You are now logged in.");
      if (result.token) {
        setToken(result.token);

        navigate("/account");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError(
        "An unexpected error occurred. Please try again.",
        error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="content">
      <img
        className="header-img"
        alt="sheep"
        src="https://c.pxhere.com/photos/3b/f8/lamb_sheep_country_natural-602711.jpg!d"
      ></img>
      <div className="becomeHostInfo">
        <h2 style={{ marginTop: "200px" }}>Become a Host</h2>

        <p>
          Are you interested in hosting a pastured animal on your land? Becoming
          a Host-a-Herd member is a rewarding way to support sustainable
          agriculture, bring local food to your community, and contribute to
          ethical animal stewardship.
        </p>

        <h3>Land Requirements</h3>

        <p>
          Each type of animal has different space and care needs. Below are the
          general guidelines for hosting:
        </p>
        <p>
          Chickens: Require at least 500 sq. ft. of outdoor space with natural
          foraging opportunities. A secure coop is recommended for protection at
          night.
        </p>
        <p>
          Rabbits: Need at least 200 sq. ft. of well-drained grassy area with
          shaded spots. A predator-proof enclosure is required.
        </p>
        <p>
          Sheep or Goats: Require ¼ to ½ acre per animal, with proper fencing
          (woven wire or electric). Access to shelter and clean water is
          essential.
        </p>
        <p>
          Pigs: Need at least ½ acre per pig, with sturdy fencing and a wallow
          area for cooling. Shade and access to fresh water are necessary.
        </p>
        <p>
          Cattle: Requires a minimum of 1 acre per cow, with rotational grazing
          preferred to maintain pasture health. A water source and windbreak for
          shelter are important.
        </p>
        <h3>Other Considerations</h3>
        <p>
          Fencing & Shelter: We will provide the necessary fencing and shelter
          for all animals. Animals will be rotationally grazed to maintain
          pasture and animal health.
        </p>
        <p>
          Time Commitment: While Host-a-Herd handles major animal care aspects,
          hosts should monitor animals daily and report any concerns.
        </p>
        <p>
          Zoning & Local Regulations: Hosts must ensure compliance with local
          zoning laws and livestock regulations.
        </p>
        <h3> Benefits of Hosting</h3>
        <div className="txt-img-container">
         
          <p style={{ width: "60vw" }}>
            Receive high-quality pasture-raised meat, eggs and dairy based on
            your membership level. Contribute to sustainable and ethical farming
            practices. Enjoy the natural benefits of animal grazing, such as
            improved soil health and pasture management. Interested in becoming
            a host? Sign up today to learn more and start your journey with
            Host-a-Herd!
          </p>
          <img alt="eggs-in-basket" className="eggs-pic" src="./assets/eastereggereggs.jpg"></img>
        </div>
      </div>

      <div style={{ paddingBottom: "200px" }} className="login-container">
        <h2>Sign Up to Become a Host</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label>
              First Name:
              <input
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name"
              />
            </label>
            <label>
              Last Name:
              <input
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last Name"
              />
            </label>
            <label>
              Email:
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </label>
            {/* <p>password must be between 8-20 characters</p> */}

            <button className="login-button" type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
function validateForm({ firstName, lastName, email, password, address }) {
  if (!firstName) {
    return "First name is required.";
  }

  if (!lastName) {
    return "Last name is required.";
  }
  if (!email || !email.includes("@")) {
    return "Please enter a valid email";
  }

  if (!password || password.length < 8 || password.length > 20) {
    return "Password must be between 8 and 20 characters.";
  }

  if (!address) {
    return "Address is required to determine if you're eligible to host animals!";
  }

  return null;
}
