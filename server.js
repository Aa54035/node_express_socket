var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var mongoose = require('mongoose')
var port = 3000;

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.Promise = Promise;

var DBURL =
    'mongodb+srv://admin:admin@mongoclustor-t0m10.mongodb.net/node_socket_Mongo?retryWrites=true&w=majority';

//This Message will be stored as its in Collection 
//as Message DB
// IN Message DB array as row will be stored 

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var messages = [
    { name: 'Tim', message: 'Hi' },
    { name: 'Jane', message: 'Hello' }
]

app.get('/messages', (req, res) => {
    Message.find({}, (err, message) => {
        res.send(messages)
    })

})

app.get('/deleteall', (req, res) => {
    Message.remove({},(err)=>{
          console.log('all records removed ')
      })
  
})

app.post('/messages', async (req, res) => {
    var message = new Message(req.body);
    var saved = await message.save()

    console.log('nes message has been saved ');

    var hellword = await Message.findOne({ message: 'hell' }); //,(err,hellword)=>{
    if (hellword)
        await message.remove({ _id: hellword.id })
    else {
        // messages.push(req.body)
        io.emit('message', req.body)
        res.sendStatus(200)
    }

})
//This post pushes input to Arraya and Emit message 

mongoose.connect(DBURL, (err) => {
    console.log('DB connection ==>' + err);
})

io.on('connection', (socket) => {
    console.log('a user connected')
    console.log('a user connected')
})

server.listen(port, () => {
    console.log('server is listening on port', port)
})