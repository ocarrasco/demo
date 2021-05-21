const express = require('express')
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

app.use(express.static(__dirname + '/app' ));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname + "/app" });
});

app.get('/api/appointments/:professionalId/:period', (req, res) => {
  let professionalId = req.params.professionalId;
  let period = req.params.period;
  console.log(`Mock pull data fro ${professionalId} period ${period}`);
  res.send({});
})

app.post('/api/appointments/:professionalId', (req, res) => {
  let professionalId = req.params.professionalId;
  console.log(`Mock Save data for professional ${professionalId}`);
  console.log(req.body);
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Running app on ${port}`)
});