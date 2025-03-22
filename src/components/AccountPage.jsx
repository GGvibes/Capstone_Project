import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";

export default function AccountPage({ token }) {
  const [accountData, setAccountData] = useState(null);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAccount() {
      if (!token) {
        setError("You need to log in to view your account details.");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Failed to fetch account details.");
        }

        const result = await response.json();
        const userId = result.id;
        setAccountData(result);
        console.log(result);

        const reservationsResponse = await fetch(
          `http://localhost:5000/api/reservations/lookupbyuser/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reservationsResult = await reservationsResponse.json();
        setReservations(reservationsResult);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAccount();
  }, [token]);

  useEffect(() => {
    async function fetchAnimals() {
      if (!reservations.length) return;

      const fetchedAnimals = {};
      await Promise.all(
        reservations.map(async (reservation) => {
          if (!fetchedAnimals[reservation.animal_id]) {
            const response = await fetch(
              `http://localhost:5000/api/animals/${reservation.animal_id}`
            );
            const animalData = await response.json();
            fetchedAnimals[reservation.animal_id] = animalData;
          }
        })
      );

      setAnimals(fetchedAnimals);
    }

    fetchAnimals();
  }, [reservations]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="accountDetails">
        <h2>Account Details</h2>
        <p>First Name: {accountData.firstname}</p>
        <p>Last Name: {accountData.lastname}</p>
        <p>Email: {accountData.email}</p>
        <p>Address: {accountData.address}</p>
      </div>
      <div className="outer-res-container">
        <h3>Reservations:</h3>

        {reservations?.length > 0 ? (
          <div className="reservations-container">
            {reservations.map((reservation) => {
              const animal = animals[reservation.animal_id];
              return (
                <div key={reservation.id} className="reservation-card">
                  {animal ? (
                    <>
                      <p>Type: {animal.type}</p>
                      <p>Breed: {animal.breed}</p>
                      <p>Number of Animals: {animal.num_animals}</p>
                      <img
                        src={animal.animal_img_url}
                        alt={animal.type}
                        width="150"
                      />
                    </>
                  ) : (
                    <p>Loading animal info...</p>
                  )}
                  <p>
                    Start Date:{" "}
                    {format(new Date(reservation.start_date), "MMMM d, yyyy")}
                  </p>
                  <p>
                    End Date:{" "}
                    {format(new Date(reservation.end_date), "MMMM d, yyyy")}
                  </p>
                  <button
                    onClick={() => navigate(`/reservations/${reservation.id}`)}
                    style={{ padding: "8px" }}
                  >
                    Edit Reservation
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <p>You currently have no reservations.</p>
            <Link to="/availableanimals">
              <button className="view-av-animals">View Available Animals</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
