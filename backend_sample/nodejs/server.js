const express = require('express');
const app = express();
const cors = require('cors');
const DrivesUtils = require('./drives-utils');

app.use(cors());

app.get('/config', async function (req, res) {
    const config = await DrivesUtils.getConfig();
    console.log(config);
    res.json(config);
});

app.get('/files', async function (req, res) {
    const files = DrivesUtils.getFiles(req.query.id);
    res.json(files);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});