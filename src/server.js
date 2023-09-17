const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
const ZOHO_API_URL = 'https://www.zohoapis.in/crm/v2/Contacts';
const access_Token = '1000.4edbf0c3f4a385b70b19461289b2fc83.e3343ffe91028691cc5c86b59fc235d9'

app.use(express.json());


app.use(cors({
    origin: 'http://localhost:3000',
}));
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(ZOHO_API_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${access_Token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});