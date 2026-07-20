
import dns from "dns";
import { MongoClient } from "mongodb";

dns.setServers(["1.1.1.1"]);

const uri = 
  "mongodb+srv://anujpratapsingh608_db_user:IlJ98mBqJyY2aW5Z@cluster0.aw7wjgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("✅ Connected Successfully!");
} catch (err) {
  console.error(err);
} finally {
  await client.close();
}