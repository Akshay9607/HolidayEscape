const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const ejs = require('ejs');
dotenv.config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const tourRoute = require('./routes/Tour.route');
const adminRoute = require('./routes/Admin.route');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
	origin: 'https://holidayescape.netlify.app',
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// database connection
const port = process.env.PORT || 8050;
const dbURI = process.env.MONGODB_CONNECTION_URI;
app.use('/api/tour', tourRoute);
app.use('/api/admin', adminRoute);
// app.use('/', (req, res) => {
// 	res.redirect('/api/admin');
// });
// app.get('/', (req, res) => {
// 	res.render('allTour');
// });

mongoose.set('strictQuery', true);
mongoose
	.connect(dbURI)
	.then(() => app.listen(port, () => console.log(`Listening on port ${port}...`)))
	.catch((err) => console.log(err.message));
