import express from "express";

const app = express();
const PORT: number = 5000
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server on" });
});

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
