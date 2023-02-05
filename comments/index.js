const express = require('express');
const { randomBytes } = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const commentsByPostId = {};
const axios = require('axios');
app.use(bodyParser.json());
app.use(cors());
// commentsById structure will look like commentId, postId, [commentsTextContent]

app.get('/posts/:id/comments', (req, res) => {
    try {
        res.send(commentsByPostId[req.params.id] || []);
    } catch (err) {
        console.log(err);
    }
})

app.post('/posts/:id/comments', async (req, res) => {
    try {
        const commentId = randomBytes(4).toString('hex');
        const { content } = req.body;
        
        const comments = commentsByPostId[req.params.id] || [];
        comments.push({ id: commentId, content, status: "pending" });

        await axios.post('http://localhost:4005/events', {
            type: "CommentCreated",
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: 'pending'
            }
        });

        commentsByPostId[req.params.id] = comments;

        res.status(201).send(comments);
    } catch (err) {
        console.log(err);
    }
})

app.post('/events', async (req, res) => {
    console.log("received event", req.body.type);

    const { type, data } = req.body;

    if (type === "CommentModerated") {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        console.log(postId, id, status, content);
        const comment = comments.find(item => {
            return item.id === id;
        })

        comment.status = status;
        
        await axios.post('http://localhost:4005/events', {
            type: "CommentUpdated",
            data: {
                id: id,
                status: status,
                postId: postId,
                content: content
            }
        })
    }
    res.send({});
});

app.listen(4001, () => {
    console.log("listening on port 4001");
})