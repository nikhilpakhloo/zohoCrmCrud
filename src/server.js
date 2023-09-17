const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
const ZOHO_API_URL = 'https://www.zohoapis.in/crm/v2/Contacts';
const access_Token = '1000.9bb819b428a18d448063fd827ddedb90.923b54e60bf8569707ad0517b1f61520'

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
    const updatedContactData = req.body; 

    try {
        const dataToUpdate = {
            data: [
                {
                    id: contactId, 
                    ...updatedContactData, 
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
app.post('/', async (req, res) => {
    const newContactData = req.body;
    console.log("Data Added", newContactData);

    try {
        const dataToCreate = {
            data: [
                {
                    ...newContactData,
                }
            ]
        };
        console.log("Data to create", dataToCreate);

        const response = await axios.post(`${ZOHO_API_URL}`, dataToCreate, {
            headers: {
                Authorization: `Zoho-oauthtoken ${access_Token}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error creating contact in Zoho CRM:', error);

        if (error.response && error.response.data) {
            const zohoError = error.response.data;
            console.error('Zoho CRM Error Response:', zohoError);
            res.status(500).json(zohoError);
        } else {
            console.error('Internal Server Error:', error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});




  



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});