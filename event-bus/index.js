const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  // event can be anything like string object arr etc.
  const event = req.body;

  events.push(event);

  axios
    .post("http://posts-clusterip-srv:4000/events", event)
    .catch((err) => console.log(err.message));
  axios
    .post("http://comments-srv:4001/events", event)
    .catch((err) => console.log(err.message));
  axios
    .post("http://query-srv:4002/events", event)
    .catch((err) => console.log(err.message));
  axios.post("http://moderation-srv:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({
    status: "OK",
  });
});

app.get("/events", (req, res) => {
  return res.send(events);
});

app.listen(4005, () => {
  console.log(`app listening on port 4005`);
});
