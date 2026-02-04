
// Ig dl

import axios from 'axios';
import crypto from 'crypto';

async function igdl(url) {
    try {
        const encUrl = (text) => {
            try {
                const key = Buffer.from('qwertyuioplkjhgf', 'utf-8');
                const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
                cipher.setAutoPadding(true);
                let encrypted = cipher.update(text, 'utf-8', 'hex');
                encrypted += cipher.final('hex');
                return encrypted;
            } catch (err) {
                throw new Error("Encrypt failed: " + err.message);
            }
        };

        const encLink = encUrl(url);
        const config = {
            method: 'get',
            url: 'https://api.videodropper.app/allinone',
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'origin': 'https://fastvideosave.net',
                'referer': 'https://fastvideosave.net/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'url': encLink
            }
        };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            return { status: false, code: error.response.status, msg: error.response.data };
        }
        return { status: false, msg: error.message };
    }
}

// useage
igdl("https://www.instagram.com/reel/DTxDKrSE9vN/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==").then(res => console.log(JSON.stringify(res, null, 2)));
