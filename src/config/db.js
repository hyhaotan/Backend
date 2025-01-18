import mongoose from "mongoose";
import pkg from "mongodb-legacy";
const { MongoClient } = pkg;

// Hàm kết nối MongoDB với Mongoose
export const connectDB = async (uri) => {
  try {
    console.log("Connecting to database with URI:", uri);
    await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

// Hàm thực hiện insertMany vào MongoDB bằng MongoDB Legacy Driver
export const seedDatabase = async () => {
  const uri = "mongodb://127.0.0.1:27017";
  const client = new MongoClient(uri);
  
  try {
    // Kết nối với MongoDB
    await client.connect();
    console.log("Connected to MongoDB with Legacy Driver");

    const db = client.db("Backend");

    // Dữ liệu mẫu
    const products = [
      {
        name: "BMW 6-Series Gran Coupe",
        price: 89395,
        description: "The BMW 6-Series Gran Coupe combines luxury and sporty elegance in a four-door design. Ideal for both long journeys and daily commutes, it delivers a premium experience with advanced features.",
        model: "2017 | 3.0L TwinPower Turbo | 240 HP",
        type: "Automatic | Gran Coupe",
        image: "./assets/fc1.png",
      },
      {
        name: "Chevrolet Camaro WMV20",
        price: 66575,
        description: "A true American muscle car, the Chevrolet Camaro WMV20 offers stunning performance and iconic style. It's built for enthusiasts who crave speed and bold design.",
        model: "2017 | 3.6L V6 | 335 HP",
        type: "Automatic | Coupe",
        image: "./assets/fc2.png",
      },
      {
        name: "Lamborghini V520",
        price: 125250,
        description: "The Lamborghini V520 stands as a symbol of ultimate luxury and high-performance engineering. Its sharp design and unmatched power make it a supercar lover's dream.",
        model: "2017 | 5.2L V10 | 610 HP",
        type: "Automatic | Supercar",
        image: "./assets/fc3.png",
      },
      {
        name: "Audi A3 Sedan",
        price: 95500,
        description: "The Audi A3 Sedan blends compact dimensions with sophisticated design. Perfect for urban driving, it features a luxurious interior and cutting-edge technology.",
        model: "2017 | 2.0L TFSI | 220 HP",
        type: "Automatic | Sedan",
        image: "./assets/fc4.png",
      },
      {
        name: "Infiniti Z5",
        price: 36850,
        description: "The Infiniti Z5 is a sleek, modern crossover SUV that offers comfort, advanced safety features, and a smooth ride. A perfect choice for families and adventurers.",
        model: "2017 | 2.5L Turbo | 208 HP",
        type: "Automatic | SUV",
        image: "./assets/fc5.png",
      },
      {
        name: "Porsche 718 Cayman",
        price: 48500,
        description: "The Porsche 718 Cayman is a compact sports car designed for agility and precision. With a mid-engine layout and dynamic handling, it’s built for driving enthusiasts.",
        model: "2017 | 2.0L Turbo | 300 HP",
        type: "Automatic | Coupe",
        image: "./assets/fc6.png",
      },
      {
        name: "BMW 8-Series Coupe",
        price: 56000,
        description: "The BMW 8-Series Coupe redefines the luxury sports car experience with its refined design and thrilling performance. A masterpiece of engineering and style.",
        model: "2017 | 4.4L V8 TwinTurbo | 523 HP",
        type: "Automatic | Coupe",
        image: "./assets/fc7.png",
      },
      {
        name: "BMW XSeries-6",
        price: 75800,
        description: "The BMW XSeries-6 offers a blend of SUV practicality and coupe-inspired style. With dynamic driving capabilities and advanced tech, it’s ready for any adventure.",
        model: "2017 | 3.0L Turbocharged Diesel | 265 HP",
        type: "Automatic | SUV Coupe",
        image: "./assets/fc8.png",
      },
    ];

    // Thêm dữ liệu nếu collection rỗng
    const collection = db.collection("products");
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(products);
      console.log("Seed data inserted successfully!");
    } else {
      console.log("Products collection already has data.");
    }
  } catch (error) {
    console.log("Error inserting seed data:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
};
