import { useNavigate } from "react-router-dom";

export default function Footer({ token, logout }) {
  const navigate = useNavigate();
  return (
    <>
      <footer className="footer-container">
        <hr />
        <div className="footer-content">
          <h1 style={{ color: "black" }} className="footer-title">
            Host-a-Herd
          </h1>
          <div className="footer-links">
            <ul className="column1">
              <li
                onClick={() => navigate("/aboutcontact#contact-section")}
                style={{ color: "black" }}
              >
                Contact Us
              </li>
              {!token && <li onClick={() => navigate("/login")}>Log In</li>}
              {!token && <li onClick={() => navigate("/signup")}>Sign Up</li>}
              {token && <li onClick={() => navigate("/account")}>Account</li>}
              {localStorage.getItem("token") && (
                <li
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </li>
              )}
            </ul>
            <ul className="column2">
              <li
                onClick={() => navigate("/aboutcontact#aboutPage")}
                style={{ color: "black" }}
              >
                About Us
              </li>
              <li onClick={() => navigate("/availableanimals")}>
                Host Animals
              </li>

              <li>
                <a
                  style={{ textDecoration: "none", color: "rgb(80, 80, 80)" }}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://gardens.theownerbuildernetwork.co/2023/11/21/sheep-as-lawn-mowers/"
                >
                  Sheep as Lawn-Mowers
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
