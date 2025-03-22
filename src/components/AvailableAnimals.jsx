import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";

export default function AvailableAnimals({ token }) {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const toggleType = (type) => {
    setSelectedType((prev) =>
      prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]
    );
  };

  const removeType = (type) => {
    setSelectedType((prev) => prev.filter((t) => t !== type));
  };

  const filteredAnimals = (
    searchInput.trim() ? filteredResults : animals
  ).filter(
    (animal) => selectedType.length === 0 || selectedType.includes(animal.type)
  );

  const searchAnimals = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue.trim()) {
      const filtered = animals.filter((animal) =>
        Object.values(animal)
          .join(" ")
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(animals);
    }
  };

  useEffect(() => {
    async function fetchAnimals() {
      try {
        const response = await fetch("http://localhost:5000/api/animals", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setError("Failed to fetch available animals.");
        }

        const result = await response.json();
        setAnimals(result.animals || []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchAnimals();
  }, [token]);

  if (error) {
    return <p style={{ margin: "30px" }}>{error}</p>;
  }

  if (!animals) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <img
        className="header-img"
        alt="cows-grazing"
        src="https://www.publicdomainpictures.net/pictures/40000/velka/cows-grazing.jpg"
      ></img>
      <div className="availableAnimalsPage">
        <h2 style={{ marginLeft: "50px", marginTop: "200px" }}>
          Available Animals
        </h2>
        {/* Search Functionality */}

        <input
          style={{ marginLeft: "50px" }}
          className="searchBox"
          icon="search"
          placeholder="Search..."
          onChange={(e) => searchAnimals(e.target.value)}
        ></input>
        {searchInput.trim() && filteredResults.length === 0 && (
          <h3 className="noAnimalsFound">No Animals match your search.</h3>
        )}

        {/* Filter Button */}
        <button className="filter-button" onClick={() => setShowModal(true)}>
          Filter by Animal Type
        </button>
        {selectedType.length > 0 && (
          <div
            style={{
              marginLeft: "20px",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          ><p>Filtering by:</p>
            {selectedType.map((type) => (
              <>
                <span
                  key={type}
                  className="selected-type-tag"
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  {type}
                  <button
                    onClick={() => removeType(type)}
                    style={{
                      marginLeft: "5px",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "black",
                      fontSize: "16px",
                      padding: "0",
                      marginTop: "2px",
                    }}
                  >
                    &times;
                  </button>
                </span>
              </>
            ))}
          </div>
        )}
        {/* Type Modal */}
        <Modal show={showModal} handleClose={() => setShowModal(false)}>
          <h3 style={{ textAlign: "center" }}>Select Animal Type(s):</h3>
          <ul className="filter-list">
            {["Chicken", "Cow", "Cow Calf Pair", "Sheep", "Pig", "Alpaca"].map(
              (type) => (
                <li
                  key={type}
                  onClick={() => toggleType(type)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "5px",
                    backgroundColor: selectedType.includes(type)
                      ? "rgb(251, 113, 78)"
                      : "aliceblue",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {type}
                </li>
              )
            )}
          </ul>
          <button onClick={() => setShowModal(false)}>Done</button>
        </Modal>
        <div></div>
        <div className="animals-container">
          {filteredAnimals.map((animal) => (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to={`/animals/${animal.id}`}
            >
              <div className="animals-card" key={animal.id}>
                <p style={{ paddingTop: "20px" }}>Type: {animal.type}</p>
                <p>Number of animals: {animal.num_animals}</p>
                <img
                  style={{ width: "200px", maxHeight: "200px", margin: "20px" }}
                  src={animal.animal_img_url}
                ></img>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
