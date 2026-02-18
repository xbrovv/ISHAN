const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const FILE_URL = process.env.FILE_URL; // .env එකෙන් ගන්නවා
const ZIP_PATH = path.join(__dirname, "temp.zip");
const EXTRACT_PATH = path.join(__dirname, "plugins");

async function downloadAndExtract() {
    try {
        console.log("⬇ Downloading File...");

        const response = await axios({
            method: "GET",
            url: FILE_URL,
            responseType: "arraybuffer"
        });

        fs.writeFileSync(ZIP_PATH, response.data);

        console.log("📦 Extracting...");

        const zip = new AdmZip(ZIP_PATH);
        zip.extractAllTo(EXTRACT_PATH, true);

        fs.unlinkSync(ZIP_PATH); // temp zip delete කරනවා

        console.log("✅ Setup Completed!");

    } catch (err) {
        console.error("❌ Setup Failed:", err.message);
        process.exit(1);
    }
}

downloadAndExtract();
