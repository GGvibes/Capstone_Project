import { useNavigate } from "react-router-dom";


export default function Contact() {
    const navigate = useNavigate();

    const submitClick = () => {
        navigate("/success")
    }

  return (
    <>
      <div>
        <h1 style={{ margin: "50px" }}>Contact Us</h1>
        <form className="contact-form">
          <div className="name-fields">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" id="name" name="name" placeholder="Jane" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" id="name" name="name" placeholder="Ferris" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label>Your Message</label>
            <textarea
                className="message-field"
              style={{
                height: "100px",
                paddingTop: "10px", 
                paddingLeft: "10px", 
              }}
              id="message"
              name="message"
              placeholder="Enter your question or message"
            ></textarea>
          </div>

          <button onClick={submitClick} className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
