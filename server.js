const express = require('express');
const bodyParser = require('body-parser');
const xml = require('xml');
const fs = require('fs');
const moment = require('moment');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const router = express.Router();

function getListings(days) {
	console.log('getting program data for ' + days + ' days...');
	const programSourceData = JSON.parse(fs.readFileSync('./data/tvListings.json', 'utf8'));

	const data = JSON.parse(JSON.stringify(programSourceData));
	data.listings[0].tv = [];

	let programCount = 0;
	programSourceData.listings[0].tv.forEach(function (element) {
		if (element.programme) {
			const format = 'YYYYMMDDHHmmss ZZ';
			for (let day = 0; day < days; day++) {
				const today = moment().startOf("day").add(day, "day").format(format);
				const tomorrow = moment().startOf("day").add(day + 1, "day").format(format);
				element.programme[0]._attr.start = today;
				element.programme[0]._attr.stop = tomorrow;
				data.listings[0].tv.push(JSON.parse(JSON.stringify(element)));
				programCount++;
			}
		} else {
			data.listings[0].tv.push(Object.assign({}, element));
		}
	});

	console.log('loaded ' + programCount + ' listings.');

	return data;
}

router.get('/', function (req, res) {
	res.send({
		message: "Hello world!!"
	});
});

router.get('/tvlistings/:days', function (req, res) {
	res.json(getListings(req.params.days || 1));
});

router.get('/xml', function (req, res) {
	res.set('Content-Type', 'text/xml');
	res.send(xml({
		message: "Hello world!!"
	}));
});

router.get('/xml/tvlistings/:days', function (req, res) {
	const data = xml(getListings(req.params.days || 1).listings, { indent: '  ', declaration: true });
	res.set('Content-Type', 'text/xml');
	res.send(data);
});

app.use('/api', router);

app.listen(port);

console.log("Now listening on port " + port);
