const express = require('express');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();
const api = require('./server/routes/api.router');

const app = express();
app.use('/api', api);
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	console.error(`Request Error ${req.url} - ${err.status}`);
	next(err);
});
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message,
		},
	});
});
const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
if (process.env.NODE_ENV !== 'test') {
	server.listen(port, () => console.log(`API running on localhost:${port}`));
}

module.exports = app;
