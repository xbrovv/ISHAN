const axios = require("axios");
const fs = require("fs");
const path = require("path");

const FILE_URL = "https://drive.google.com/uc?export=download&id=10HrgBH8CBe0qqPzN6nHiqhXTL_cPBLTJ/view?usp=drivesdk";
const OUTPUT_PATH = path.join(__dirname, "plugins", "file.zip");

async function downloadFile() {
    try {
        const response = await axios({
            method: "GET",
            url: FILE_URL,
            responseType: "stream"
        });

        const writer = fs.createWriteStream(OUTPUT_PATH);

        response.data.pipe(writer);

        writer.on("finish", () => {
            console.log("✅ File Downloaded Successfully!");
        });

        writer.on("error", (err) => {
            console.log("❌ Error:", err);
        });

    } catch (err) {
        console.log("❌ Download Failed:", err.message);
    }
}

downloadFile();
