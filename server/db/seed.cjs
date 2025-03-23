const {
  client,
  createUser,
  createAnimals,
  createReservation,
  getAllUsers,
  getAllAnimals,
  getAllReservations,
} = require("./index.cjs");

const cloudinary = require ('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: 'daqyrjiug',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

async function uploadImage(imageUrl) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "animals" ,
      use_filename: true,
    });
    return result.secure_url; 
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS animals;
      DROP TABLE IF EXISTS users;
      `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          address VARCHAR(255) NOT NULL,
          host BOOLEAN DEFAULT false
        );
      `);

    await client.query(`
        CREATE TABLE animals (
          id SERIAL PRIMARY KEY,
          num_animals INT NOT NULL,
          type VARCHAR(255) NOT NULL,
          breed VARCHAR(255) NOT NULL,
          animal_img_url TEXT
        );
      `);

    await client.query(`
        CREATE TABLE reservations (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          animal_id INT REFERENCES animals(id) ON DELETE CASCADE,
          start_date date,
          end_date date
        );
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({
      firstName: "Al",
      lastName: "Bert",
      email: "albert@email.com",
      password: "bertie99",
      address: "Maple Plain, MN",
    });
    await createUser({
      firstName: "Sandra",
      lastName: "Bolton",
      email: "sandra@email.com",
      password: "2sandy4me",
      address: "Delano, MN",
    });
    await createUser({
      firstName: "Lina",
      lastName: "Olson",
      email: "lolson@email.com",
      password: "linalina",
      address: "Minnetrista, MN",
    });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialAnimals() {
  try {
    console.log("Starting to create animals...");
const animals = [
  {
      type: "Chicken",
      num_animals: 3,
      breed: "Easter Eggers",
      animal_img_url: "https://www.chickensforbackyards.com/wp-content/uploads/2017/10/320Easter20Egger1.jpg"
    },
    {
      type: "Sheep",
      num_animals: 2,
      breed: "Cotswold",
      animal_img_url: "https://i.pinimg.com/originals/a7/b5/a5/a7b5a561d9f4e81276b18982a6bb022e.jpg"
    },
    {
      type: "Cow",
      num_animals: 2,
      breed: "Jersey",
      animal_img_url: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-jersey-cow-and-calf-bethany-benike.jpg"
    },
    {
      type: "Alpaca",
      num_animals: 2,
      breed: "Huacaya",
      animal_img_url: "https://www.marylandzoo.org/wp-content/uploads/2017/10/alpaca_web.jpg"
    },
    {
      type: "Chicken",
      num_animals: 3,
      breed: "Buff Orpington",
      animal_img_url: "https://i.pinimg.com/originals/fb/d1/92/fbd192e5b8bbbde2c8e45be1ea4773af.jpg"
    },
    {
      type: "Sheep",
      num_animals: 3,
      breed: "Merino",
      animal_img_url: "https://images.freeimages.com/images/large-previews/e1a/merino-sheep-1337359.jpg"
    },
    {
      type: "Cow",
      num_animals: 3,
      breed: "Galloway",
      animal_img_url: "https://www.miniaturegalloway.com.au/images/Storm_Chaser_paddie_2022_06_17_1.jpg"
    },
    {
      type: "Pig",
      num_animals: 3,
      breed: "Berkshire",
      animal_img_url: "https://www.texasridge.com/uploads/1/1/0/7/11074616/published/img-5541.jpg?1675795567"
    },
    {
      type: "Chicken",
      num_animals: 2,
      breed: "Unkown",
      animal_img_url: "https://rafterwranch.net/wp-content/uploads/2019/06/pasture-raised-chicken-1-1080x675.jpg"
    },
    {
      type: "Chicken",
      num_animals: 15,
      breed: "Unkown",
      animal_img_url: "https://i.pinimg.com/736x/aa/cd/4e/aacd4e9d8ba4c4f99fa90540dfba3269--rhode-island-red-good-girl.jpg"
    },
    {
      type: "Pig",
      num_animals: 2,
      breed: "Unkown",
      animal_img_url: "https://www.beginningfarmers.org/wp-content/uploads/sites/4/2020/09/rsz_hogs.jpg"
    },
    {
      type: "Cow",
      num_animals: 2,
      breed: "Highland",
      animal_img_url: "https://peachcreekfarm.us/NewSite/wp-content/uploads/2021/05/IMG_0190-600x600.jpeg"
    }
]
for (let animal of animals) {
  const cloudinaryUrl = await uploadImage(animal.animal_img_url);
  if (cloudinaryUrl) {
    await createAnimals({
      type: animal.type,
      num_animals: animal.num_animals,
      breed: animal.breed,
      animal_img_url: cloudinaryUrl
    });
    console.log(`Uploaded ${animal.breed} image to Cloudinary`);
  } else {
    console.log(`Failed to upload ${animal.breed} image`);
  }
}

    console.log("Finished creating animals!");
  } catch (error) {
    console.error("Error creating animals!");
    throw error;
  }
}

async function createInitialReservations() {
  try {
    console.log("Starting to create reservations...");

    const { rows: users } = await client.query(`SELECT id FROM users LIMIT 10`);
    const { rows: animals } = await client.query(
      `SELECT id FROM animals LIMIT 10`
    );

    if (users.length === 0 || animals.length === 0) {
      console.error(
        "No users or animals available, cannot create reservations."
      );
      return;
    }
    await createReservation({
      user_id: users[0].id,
      animal_id: animals[2].id,
      start_date: "2025-04-10",
      end_date: "2025-05-01",
    });
    await createReservation({
      user_id: users[1].id,
      animal_id: animals[1].id,
      start_date: "2025-07-15",
      end_date: "2025-08-15",
    });
    await createReservation({
      user_id: users[2].id,
      animal_id: animals[2].id,
      start_date: "2025-09-01",
      end_date: "2025-09-10",
    });

    console.log("Finished creating reservations!");
  } catch (error) {
    console.error("Error creating reservations!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialAnimals();
    await createInitialReservations();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling getAllAnimals");
    const animals = await getAllAnimals();
    console.log("Result:", animals);

    console.log("Calling getAllReservations");
    const reservations = await getAllReservations();
    console.log("Result:", reservations);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
