const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.post("/upload-to-cloudinary", async (req, res) => {
  const preset_key = "amwwrhzq";
  
  const formData = new FormData();
  formData.append("file", req.body.file);
  formData.append(preset_key, preset_key);

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/V1_1/dqicwto8t/image/upload",
      formData
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
