import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ token, logout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const logoClick = () => {
    navigate("/");
    setIsOpen(false);
  };

  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="header">
        <img
          style={{ cursor: "pointer" }}
          onClick={logoClick}
          className="logo"
          src="favicon.ico"
          alt="goatlogo"
        ></img>
        <div ref={dropdownRef} className="dropdown-container">
          <div className="dropdown-menu" onClick={handleClick}>
            <img
              className="menu-image"
              src="/assets/Button.png"
              alt="menu-button"
            />

            {isOpen && (
              <div className="dropdown-content">
                {token ? (
                  <>
                    <Link
                      to={"/"}
                      onClick={logout}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="menu-item">Log Out</div>
                    </Link>
                    <Link
                      to={"/account"}
                      onClick={handleLinkClick}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="menu-item">View Account</div>
                    </Link>
                    <hr />
                    <Link
                      to={"/availableanimals"}
                      
                      style={{textDecoration: "none", width:"100%" }}
                    >
                      <div className="menu-item">Available Animals</div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={"/login"}
                      onClick={handleLinkClick}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{ marginBottom: "10px" }}
                        className="menu-item"
                      >
                        Log In
                      </div>
                    </Link>
                    <Link
                      to={"/signup"}
                      onClick={handleLinkClick}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="menu-item">Join as a Host</div>
                    </Link>
                    <hr style={{marginBottom:"10px"}} />
                    <Link
                      to={"/availableanimals"}
                      className="menu-item"
                      style={{textDecoration: "none", width:"100%" }}
                    >
                      Available Animals
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
