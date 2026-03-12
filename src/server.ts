import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/dataSource.js";
import { error } from "node:console";

const app = express();
const PORT: number = 5001;
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});

try {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
  app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);  
  })
} catch (error) {
  console.error("Error during Data Source initialization", error);
}
