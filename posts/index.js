const express = require('express');
const { randomBytes } = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const posts = {};
const axios = require('axios');

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
    try {
        res.send(posts);
    } catch (err) {

    }
})

app.post('/posts', async (req, res) => {
    try {
        const id = randomBytes(4).toString('hex');
        const {title} = req.body;

        posts[id] = {
            id,
            title
        };

        await axios.post('http://localhost:4005/events', {
            type: 'PostCreated',
            data:{
                id,
                title
            }
        });

        res.status(201).send(posts[id]);

    } catch (err) {
        
    }
})

app.post('/events', (req, res) => {
    console.log("received event", req.body.type);

    res.send({});
});

app.listen(4000, () => {
    console.log(`listening on 4000`);
})