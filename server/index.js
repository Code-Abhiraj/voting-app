const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const voterRoutes = require('./routes/voterRoutes');
const officerRoutes = require('./routes/officerRoutes');
const resultRoutes = require('./routes/resultRoutes');
const { setupWebSocketServer } = require('./utils/ws');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
  }));

app.use(express.json());
app.use('/api/voter', voterRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/results', resultRoutes);

const start = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('connected to database');
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        });
        setupWebSocketServer();
    } catch(err) {
        throw err;
    }
} 

start();