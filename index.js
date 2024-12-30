const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const app = express();

const authRoutes = require('./routes/auth');
const seatRoutes = require('./routes/seats');

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

db.sequelize.sync().then(() => console.log('Database connected'));

app.use('/auth', authRoutes);
app.use('/api', seatRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
