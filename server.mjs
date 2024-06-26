import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;
const apiKey = 'd40cf89b39cce6'; // Замініть на свій API-ключ

function getClientIp(req) {
    return req.headers['cf-connecting-ip'] ||
           req.headers['x-real-ip'] ||
           req.headers['x-forwarded-for'] ||
           req.socket.remoteAddress;
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/geoip', async (req, res) => {
    const clientIp = getClientIp(req);
    console.log('Client IP:', clientIp); // Виводить IP-адресу клієнта до log-файлу

    const apiUrl = `https://ipinfo.io/${clientIp}/json?token=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).send('Помилка при завантаженні даних: ' + error);
    }
});

app.listen(port, () => {
    console.log(`Сервер працює за адресою: http://localhost:${port}`);
});



