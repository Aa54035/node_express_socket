var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var mongoose  = require('mongoose')
var port = 3000;

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
 
var DBURL =
 'mongodb+srv://admin:admin@mongoclustor-t0m10.mongodb.net/node_socket_Mongo?retryWrites=true&w=majority';

// var DBURL =
//   'mongodb+srv://user:user123@mongoclustor-t0m10.mongodb.net/node_socket_Mongo?retryWrites=true&w=majority';


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://user:user@mongoclustor-t0m10.mongodb.net/node_socket_Mongo.node_socket_Mongo?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//      console.log('DB connection ==>'+err);
// });
   
var Message = mongoose.model('Message',{
    name : String ,
    message : String 
})

var messages = [
    {name: 'Tim', message: 'Hi'},
    {name: 'Jane', message: 'Hello'}
]

app.get('/messages', (req, res) =>{
    res.send(messages)
})

app.post('/messages', (req, res) =>{
 var message = new Message(req.body);
 message.save((Err)=>{
     if (Err) {
         res.sendStatus(5000);
     }
     messages.push(req.body)
     io.emit('message', req.body)
     res.sendStatus(200)
 
 })
    })
//This post pushes input to Arraya and Emit message 

mongoose.connect(DBURL,(err)=>{
    console.log('DB connection ==>'+err);
})

io.on('connection', (socket) => {
    console.log('a user connected')
    console.log('a user connected')
})
 
server.listen(port, () => {
    console.log('server is listening on port', port)
})