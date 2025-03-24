import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({token, logout}) {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const navigate = useNavigate();

  return (
    <div className="app-container">
      <Header token={token} logout={logout}></Header>
      {isHomePage && (
        <a className="learnMore" onClick={() => navigate("/aboutcontact")}>
          Learn More
        </a>
      )}
      <main className="content">
        <Outlet /> 
      </main>
      <Footer logout={logout} token={token} />
    </div>
  );
}

export default Layout;