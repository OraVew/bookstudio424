import { MongoClient, ServerApiVersion } from 'mongodb';  // Import MongoClient and ServerApiVersion

const uri = process.env.MONGODB_URI;  // Ensure this is correctly set in your .env file
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Explicitly enable SSL
  serverApi: ServerApiVersion.v1,  // Use MongoDB's stable API version
};

let client = new MongoClient(uri, options);
let clientPromise;

try {
  clientPromise = client.connect();
  console.log("MongoDB connection successful");
} catch (error) {
  console.error("Failed to connect to MongoDB", error);
  throw new Error("MongoDB connection failed: " + error.message);
}

export default clientPromise;
