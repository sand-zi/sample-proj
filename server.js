const app = require('express')();
const http = require('http').createServer(app);
const socketIO = require('socket.io')(http);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

var activeUsersCount = 0;
const msgs = [];

socketIO.on('connection', (socket) => {
    activeUsersCount++
    console.log('a user connected, active users:', activeUsersCount);
    socket.on('disconnect', () => {
        console.log('user disconnected');
        activeUsersCount--
    });
    socket.on('chat msg', (msg) => {
        console.log('msg: ' + msg);
        msgs.push(msg)
        // socketIO.emit('chat addMsg', msg);
        socketIO.to(socket.myTopic).emit('chat addMsg', msg);
    });
    socket.on('chat join', (nickname) => {
        console.log('nickname: ' + nickname);
        socketIO.emit('chat addJoin', nickname);
    });
    socket.on('chat setTopic', (topic) => {
        console.log('topic: ' + topic);
        if (socket.myTopic) {
            socket.leave(socket.myTopic)
        }

        socket.join(topic)
        socket.myTopic = topic
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});