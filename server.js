const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');
const connectDB = require('./src/config/dbconnect'); 
const examUserRoutes = require("./src/routes/examUserRoutes");

dotenv.config();
connectDB();

const app = express();

//auto reload-------------------------------------------------------------

const url = process.env.BASE_URL;
const interval = 14 * 60 * 1000; // 14 minutes (300000 ms)


function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);


app.get("/", (req, res) => {
  res.status(200).send("SWPA-Server Running...");
});


//-------------------------------------------------------------


// 🔥 Enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/exam-users", examUserRoutes);

// PORT LISTENER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}: ✅`);
});
