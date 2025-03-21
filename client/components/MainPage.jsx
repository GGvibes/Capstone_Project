import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="content">
      <div className="mainPage">
        <header className="header">
          <h1 className="title">Host-a-Herd</h1>
          <h3 className="titlesnippet">
            Turn Your Land into a Living Pasture – Host Animals, Enrich Your
            Land, and Support Local Agriculture.
          </h3>
          <button
            onClick={() => navigate("/signup")}
            className="becomeHostButton"
          >
            Become a Host
          </button>
        </header>
        <div className="mainBodyPic">
          <img
            className="lambPicMain"
            src="/assets/sheeponpasture.png"
            alt="sheep-on-pasture"
          ></img>
        </div>
        <div className="mainBodyPg">
          <h2>Support Sustainable Farming</h2>
          <p>
            With Host-a-Herd, you can transform your property into a thriving
            pasture while enriching the land and supporting local food systems.
            We provide the animals, fencing, and care—you simply provide the
            space. Whether you want to promote sustainable agriculture, enjoy
            the presence of animals, or (optionally) receive fresh,
            pasture-raised meat and eggs, hosting a herd is a meaningful way to
            contribute to a healthier environment and community.
          </p>
        </div>
        <div className="mainBodyTitle">
          <h2>Enrich the Land</h2>
        </div>
        <div>
          <img
            className="chickenPicMain"
            src="/assets/chickensonpasture.png"
            alt="chickens-on-pasture"
          ></img>
          <div className="mainBodyPg">
            <p>
              Hosting pastured animals in your yard is an environmentally
              friendly alternative to traditional lawn care methods. Animals
              like goats, sheep, and chickens naturally graze and forage,
              reducing the need for gas-powered lawn mowers, fertilizers, and
              pesticides. This creates a healthier, more sustainable environment
              by promoting natural plant growth and reducing the carbon
              footprint associated with maintaining a well-kept yard.
              Furthermore, the manure produced by these animals can be composted
              and used as nutrient-rich fertilizer, closing the loop on waste
              and reducing dependence on synthetic products. It's a win-win for
              both your yard and the planet!
            </p>
          </div>
          <div className="bottomBody">
            <h2>Get Local Pasture-Raised Meat, Eggs, and Dairy</h2>
            <div>
              <p className="cowPgMain">
                Host-a-Herd supplies local, grass-fed meat, eggs, and even
                dairy. These products are not only fresher but also more
                nutritious, as animals raised on pasture are often healthier and
                produce higher-quality food. Enjoy the peace of mind knowing
                where your food comes from, how it's raised, and the positive
                impact it has on both your property and the environment.
                Supporting local, sustainable farming practices benefits your
                community and helps ensure a more ethical and eco-friendly food
                system.
              </p>
              <img
                className="cowsPicMain"
                alt="cows-on-pasture"
                src="/assets/cowsonpasture.png"
              ></img>
            </div>
          </div>
        </div>
        <button className="learnMoreButton">Learn More</button>
      </div>
    </div>
  );
}
