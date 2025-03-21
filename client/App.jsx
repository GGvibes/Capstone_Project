import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import AboutPage from "./components/AboutPage";
import Success from "./components/Success";
import AccountPage from "./components/AccountPage";
import Signup from "./components/Signup";
import Layout from "./components/Layout";
import AvailableAnimals from "./components/AvailableAnimals";
import AnimalDetails from "./components/AnimalDetails";
import EditReservation from "./components/EditReservation";

function App() {

  const [userId, setUserId] = useState();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const response = await fetch("http://localhost:5000/api/users/me", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    setUserId(data.id); 
  };
  fetchUserDetails();

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setLoggedOut(true);
    navigate("/");
  };

  useEffect(() => {
    if (loggedOut) {
      const timer = setTimeout(() => setLoggedOut(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loggedOut]);

  return (
    <div className="app-container">
      <main className="content">
        {loggedOut && (
          <p style={{ padding: "50px" }}>
            You have been logged out successfully
          </p>
        )}
        <Routes>
          <Route path="/" element={<Layout token={token} logout={logout} />}>
            <Route index element={<MainPage />}></Route>
            <Route
              path="/login"
              element={<Login setToken={saveToken}></Login>}
            ></Route>
            <Route
              path="/aboutcontact"
              element={<AboutPage></AboutPage>}
            ></Route>
            <Route path="/success" element={<Success />}></Route>
            <Route
              path="/signup"
              element={<Signup setToken={saveToken} />}
            ></Route>
            <Route
              path="/account"
              element={
                token ? <AccountPage token={token} /> : <Navigate to="/" />
              }
            ></Route>
            <Route
              path="/availableanimals"
              element={<AvailableAnimals token={token} />}
            ></Route>
            <Route 
              path="/animals/:id" 
              element={<AnimalDetails userId={userId} token={token}/>}
              userId={userId}
              token={token}
            ></Route>
            <Route token={token} path="/reservations/:id" element={<EditReservation />}></Route>
              
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
