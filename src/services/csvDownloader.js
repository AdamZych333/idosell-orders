const converter = require("json-2-csv");

exports.downloadCsv = async function (res, fileName, data) {
	const csv = converter.json2csv(data, {
		escapeHeaderNestedDots: false,
	});
	res.header("Content-Type", "text/csv");
	res.attachment(fileName);

	return res.send(csv);
};
