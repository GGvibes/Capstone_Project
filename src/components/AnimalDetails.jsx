import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";

function AnimalDetails({ token, userId }) {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    async function fetchAnimalDetails() {
      try {
        const response = await fetch(`http://localhost:5000/api/animals/${id}`);
        if (!response.ok) throw new Error("Failed to fetch animal details.");

        const data = await response.json();
        setAnimal(data);
      } catch (err) {
        setError(err.message);
      }
    }

    if (id) {
      fetchAnimalDetails();
    }
  }, [id]);

  console.log(animal);

  if (error) return <p>Error: {error}</p>;
  if (!animal) return <p>Loading...</p>;

  async function makeReservation(event) {
    event.preventDefault();

      
    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  if (new Date(startDate) < new Date(today)) {
    setError("Start date must be in the future.");
    return;
  }

  if (new Date(endDate) < new Date(today)) {
    setError("End date must be in the future.");
    return;
  }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before the end date.");
      return;
    }


    if (!startDate || !endDate) {
      setError("Must enter both a start date and end date to reserve.");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          animal_id: animal.id,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Response result", result);
        setError(
          result.message ||
            result.error ||
            "An error occurred making the reservation."
        );
        return;
      }

      setSuccessMessage("Reservation created Successfully!");
      closeModal();
      navigate("/account");
    } catch (error) {
      console.error("Reservation Error:", error);
      setError(
        "An unexpected error occurred. Please try again.",
        error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="animal-details-page">
      <div className="animal-details-container">
        <img
          src={animal.animal_img_url}
          alt={animal.type}
          className="animal-image"
        />
        <div className="animal-details">
          <h2>Animal Information:</h2>
          <p>{animal.type}</p>
          <p>Breed: {animal.breed}</p>
          <p>Number of Animals: {animal.num_animals}</p>
          {!token && <Link className="signup-host-button" to="/signup">Sign Up to be a Host</Link>}
      {token && (
        <>
          <button className="host-animals" onClick={openModal}>Host these Animals</button>
          <Modal show={showModal} handleClose={closeModal}>
            <form className="dates-form">
              <h4>Reserve Dates</h4>
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <br />
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <br />
              {error && <p className="error-message">{error}</p>}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
              <button
                className="save-res"
                style={{ margin: "20px" }}
                onClick={makeReservation}
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Submitting..." : "Save Reservation"}
              </button>
            </form>
            </Modal>
          
        </>
      )}
        </div>
        
      </div>
      
    </div>
  );
}

export default AnimalDetails;
