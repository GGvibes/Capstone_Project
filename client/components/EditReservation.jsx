import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Modal from "./Modal";

export default function EditReservation() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(null);
  const [animal, setAnimal] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [showModal, setShowModal] = useState(null);

  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);


  useEffect(() => {
    async function fetchReservation() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/reservations/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error("Failed to fetch reservation details.");

        const data = await response.json();
        setReservation(data);

        const animalResponse = await fetch(
          `http://localhost:5000/api/animals/${data.animal_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!animalResponse.ok)
          throw new Error("Failed to fetch animal details.");

        const animalData = await animalResponse.json();
        setAnimal(animalData);
      } catch (err) {
        setError(err.message);
      }
    }

    if (id) {
      fetchReservation();
    }
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!reservation || !animal) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  if (new Date(newStartDate) < new Date(today)) {
    setError("Start date must be in the future.");
    return;
  }

  if (new Date(newEndDate) < new Date(today)) {
    setError("End date must be in the future.");
    return;
  }

    if (new Date(newStartDate) > new Date(newEndDate)) {
      setError("Start date must be before the end date.");
      return;
    }

    const token = localStorage.getItem("token");
    const updatedDates = {
      start_date: new Date(newStartDate).toISOString().split("T")[0],
      end_date: new Date(newEndDate).toISOString().split("T")[0],
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${reservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedDates),
        }
      );

      if (!response.ok) throw new Error("Failed to update reservation.");

      const updatedReservation = await response.json();
      setReservation(updatedReservation);
      alert("Reservation updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error updating reservation:", err);
    }
  };

  const handleCancelClick = async (reservationid) => {
    const isSure = window.confirm(
      "Are you sure you want to cancel this reservation? This action cannot be undone."
    );

    if (isSure) {
      deleteReservation(reservationid);
    } else {
      console.log("Reservation deletion canceled.");
    }
  };

  const deleteReservation = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/account");
      } else {
        console.error ("Error deleting reservation", data.error)
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-reservations-container" key={reservation.id}>
      <div className="edit-reservation-card">
        {animal ? (
          <>
            <p>Type: {animal.type}</p>
            <p>Breed: {animal.breed}</p>
            <p>Number of Animals: {animal.num_animals}</p>
            <img src={animal.animal_img_url} alt={animal.type} width="150" />
          </>
        ) : (
          <p>Loading animal info...</p>
        )}
        <p>
          Start Date: {format(new Date(reservation.start_date), "MMMM d, yyyy")}
        </p>
        <p>
          End Date: {format(new Date(reservation.end_date), "MMMM d, yyyy")}
        </p>
      </div>
      <button
        onClick={openModal}
        style={{ margin: "5px", padding: "5px" }}
      >
        Edit Dates
      </button>
      <Modal show={showModal} handleClose={closeModal}>
        <form className="dates-form">
          <h4>Set New Reservation Dates:</h4>
          <label>
            Start Date:
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </label>
          <br />
          <label>
            End Date:
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </label>
          <br />
          <button style={{marginTop: "15px"}} className="save-new-dates" onClick={handleSubmit} type="submit">
            Save
          </button>
        </form>
      </Modal>
      <div>
        <button
          onClick={() => handleCancelClick(reservation.id)}
          style={{ margin: "5px", padding: "5px" }}
        >
          Cancel Reservation
        </button>
      </div>
      <button
        onClick={() => navigate(`/account`)}
        style={{ padding: "5px", margin: "5px" }}
      >
        Back to Account Page
      </button>
    </div>
  );
}
