const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const issueRoute = require('./routes/issue');
const verifyRoute = require('./routes/verify');
const paymentRoute = require('./routes/payment');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/pdfs', express.static('pdfs'));

app.use('/api/issue', issueRoute);
app.use('/api/verify', verifyRoute);
app.use('/api/payment', paymentRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`CertiFast Backend running on ${PORT}`));

module.exports = app;
