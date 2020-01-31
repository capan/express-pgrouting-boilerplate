const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
// Get our API routes
const api = require('./server/routes/api.router');
const app = express();
app.use('/api', api);
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	console.error(`Request Error ${req.url} - ${err.status}`)
	next(err);
});
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});
const port = '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));