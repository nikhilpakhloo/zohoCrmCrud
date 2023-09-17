const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
const ZOHO_API_URL = 'https://www.zohoapis.in/crm/v2/Contacts';
const access_Token = '1000.9283a9e0571d7837d14664c32c2f6cd6.dbe895beb15deacbebe74a6b15926460'

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
app.put('/Contacts/:id', async (req, res) => {
    const contactId = req.params.id;
    const updatedContactData = req.body; // req.body is already an object

    try {
        const dataToUpdate = {
            data: [ // Wrap your data in an array as Zoho CRM expects an array of records
                {
                    id: contactId, // Include the contact's ID here
                    ...updatedContactData, // Include all other fields you want to update
                }
            ]
        };

        const response = await axios.put(`${ZOHO_API_URL}`, dataToUpdate, {
            headers: {
                Authorization: `Zoho-oauthtoken ${access_Token}`,
                'Content-Type': 'application/json',
            },
        });
    
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.data) {
            const zohoError = error.response.data;
            console.error('Error updating contact in Zoho CRM:', zohoError);
            res.status(500).json(zohoError);
        } else {
            console.error('Error updating contact in Zoho CRM:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

  



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});