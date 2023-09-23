const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
const REDIRECT_URI = 'http://localhost:3000';
const ZOHO_API_URL = 'https://www.zohoapis.in/crm/v2/Contacts';
const CLIENT_ID = '1000.B9BFLV47K6WZH1N9QVCK0CR67GL9YM';
const CLIENT_SECRET = 'a6cd6da6849b1c7ddef314beabffbf54fbb7a02e5b';
const REFRESH_TOKEN = '1000.38eb806bbebff514abbdab8c473dea74.b1f79c6b2db45e0f55f346447a22bfae';
let access_token = '1000.63f13a1996fdd23c1144bc50aab1e754.6b9bae68b039cae6f47f7da256dcb47e';

let lastTokenRefreshTime = null;
// ---------------------------------------------------------------------------------------------------------------------

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));
//----------------------------------------create secret key--------------------------------------------
const keyLength = 32
const secretKey = crypto.randomBytes(keyLength).toString('hex');

console.log("Generated Secret Key:", secretKey);


//----------------------------------------LoginAuth-----------------------------------------------------------------
const Email = 'nikhilpakhloo@gmail.com';
const Password = '123456789';


app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  if (email === Email && password === Password) {

    res.status(200).send('Authentication successful');
  } else {
  
    res.status(401).send('Authentication failed');
  }
});


// ---------------------------------Refreshing the Access_token---------------------------------------------------------------------------
const refreshAccessToken = async () => {
    try {
        const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
            params: {
                refresh_token: REFRESH_TOKEN,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
            },
        });
        access_token = response.data.access_token;

        lastTokenRefreshTime = Date.now();
    } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.data) {
            const zohoError = error.response.data;
            console.error('Zoho CRM Error Response:', zohoError);
        }
    }
};
const tokenRefreshInterval = 55 * 60 * 1000;
setInterval(refreshAccessToken, tokenRefreshInterval);
// ------------------------------------after 55 min this code run for refresh token-----------------------------------------------


app.use(async (req, res, next) => {

    const tokenExpirationTime = lastTokenRefreshTime + tokenRefreshInterval;
    if (!access_token || Date.now() >= tokenExpirationTime) {
        await refreshAccessToken();
    }
    next();
});
// ------------------------------------------fetching the contacts from zoho------------------------------------------------------------
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(ZOHO_API_URL, {
            headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// -------------------------------------------making update on contacts-----------------------------------------------------------
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
                Authorization: `Zoho-oauthtoken ${access_token}`,
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
// ----------------------------------------inserting new value in crm --------------------------------------------------------
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
                Authorization: `Zoho-oauthtoken ${access_token}`,
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
// -----------------------------------------deleting contacts fron crm ------------------------------------------------------------
app.delete('/Contacts/:id', async (req, res) => {
    const contactId = req.params.id;

    try {

        const deleteUrl = `${ZOHO_API_URL}/${contactId}`;

        const response = await axios.delete(deleteUrl, {
            headers: {
                Authorization: `Zoho-oauthtoken ${access_token}`,
            },
        });

        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.data) {
            const zohoError = error.response.data;
            console.error('Error deleting contact in Zoho CRM:', zohoError);
            res.status(500).json(zohoError);
        } else {
            console.error('Error deleting contact in Zoho CRM:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});



app.listen(PORT, () => {
    console.log(`Nodejs Server is running at ${PORT}`);
});