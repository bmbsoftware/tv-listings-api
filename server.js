var express = require('express');
var bodyParser = require('body-parser');
var xml = require('xml');
var fs = require('fs');
var moment = require('moment');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3001;
var router = express.Router();

function getListings(days) {
	console.log('getting program data for ' + days + ' days...');
	var programSourceData = JSON.parse(fs.readFileSync('./data/tvListings.json', 'utf8'));

	var data = JSON.parse(JSON.stringify(programSourceData));
	data.listings[0].tv = [];

	var programCount = 0;
	programSourceData.listings[0].tv.forEach(function (element) {
		if (element.programme) {
			var format = 'YYYYMMDDHHmmss ZZ';
			for (var day = 0; day < days; day++) {
				var today = moment().startOf("day").add(day, "day").format(format);
				var tomorrow = moment().startOf("day").add(day + 1, "day").format(format);
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
	res.set('Content-Type', 'text/xml');
	res.send(xml(getListings(req.params.days || 1).listings));
});


app.use('/api', router);

app.listen(port);

console.log("Now listening on port " + port);
