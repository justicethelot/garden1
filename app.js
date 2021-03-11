const path = require('path');
const http = require('http');
const express = require('express');
const fs = require('fs');
const socketio = require('socket.io');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


let app_data = [
{
     
        frame: [],
        new_plants: [],
        new_litter: []
    },

 {
     
        frame: [],
        new_plants: [],
        new_litter: []
    },

 {
     
        frame: [],
        new_plants: [],
        new_litter: []
    }       

];

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room, file }) => {
    const user = userJoin(socket.id, room);
    let socketid = socket.id;
    socket.join(user.room);
    let full_file_name = file + '.txt';
    let fileContent = fs.readFileSync(full_file_name, 'utf8');
    let savedSocketId = socket.id;
    io.to(savedSocketId).emit('initialDOM', fileContent);
  });

  // Listen for new objects
  socket.on('newplant', data => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('showplant', data);
    let file = data.file;
    let index = data.array_index;
 
    app_data[index].new_plants.push(data); 
    writeFile(file, index);

  });
    // Listen for chatMessage
  socket.on('newlitter', data => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('showlitter', data);    
    let file = data.file;
    let index = data.array_index;
    app_data[index].new_litter.push(data);
     writeFile(file, index);
  });


    // Listen for picking up a litter
  socket.on('newremovedlitter', data => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('showRemovedLitter', data);
    let file = data.file;
    let index = data.array_index;    
    app_data[index].frame.push(data); 
    writeFile(file, index);
  });


  // Listen for pulling a weed
  socket.on('newpullweeds', data => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('showpulledWeed', data);
    let file = data.file;
    let index = data.array_index;    
    app_data[index].frame.push(data);
    
     writeFile(file, index);
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
  });
});


function readFile(name){
  let file_name = name+ '.txt';
let content = fs.readFileSync(file_name, 'utf8');
return content;
}

function writeFile(name, index){
  let file_name = name+ '.txt';
 let json_content = JSON.stringify(app_data[index]);
  fs.writeFile(file_name, json_content, function(error){ 
      if(error) throw error;    
  });
}
// every 24 hours new plant
function addnewPlanttoList(){
  let new_plant_number = getRandomInt(1, 9);
  let left = getRandomInt(1, 1920);
  let top = getRandomInt(60, 300);
  let x_left =  Math.round((left*100)/1920);
  let y_top =  Math.round((top*100)/1920);
  let data = {
    new_plant_number: new_plant_number,
    top: y_top,
    left: x_left
   }
    garden.new_plants.push(data);
     writeFile('garden', 0);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
let twentyfour = 1000 * 3600 *24;

setInterval(addnewPlanttoList, twentyfour); 

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => 
console.log(`Server running on port ${PORT}`));
let content_file1 = readFile('garden');
  if(content_file1) {
    app_data[0] =  JSON.parse(content_file1); 
  }
let content_file2 = readFile('info');
  if(content_file2) {
    app_data[2] =  JSON.parse(content_file2); 
  }
 

let content_file3 = readFile('fullgarden');
  if(content_file3) {
    app_data[1] =  JSON.parse(content_file3); 
}