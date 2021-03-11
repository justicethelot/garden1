'use strict';
window.onload = function() {
const preloader = document.getElementById('preloader');
const plant = document.getElementById('plant');
const litter_button= document.getElementById('litter_button');
const garden_field = document.getElementById('garden_field');
let bg_image_height = garden_field.clientHeight;
let button_block_container_height = document.getElementById('button_block_container').clientHeight;
let bg_image_width = garden_field.clientWidth;
let images = document.getElementsByClassName('garden_image');
let litter = document.getElementsByClassName('litter');
const socket = io();
const room = 'gardeners';
let username = Math.random().toString(36).substring(7);
let file = 'fullgarden';
let array_index = 1;
if(document.location.href == 'https://cleangarden.herokuapp.com/info.html'){
  file = 'info';
  array_index = 2;
}
// Join garden
socket.emit('joinRoom', { username, room, file });
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

plant.addEventListener('click', function(){
	plant.style.cursor = 'not-allowed';
	addnewPlant();
	plant.innerText = 'You have planted a flower!';
	setTimeout(returnText, 1500, plant, 'Plant a flower'); 
});


litter_button.addEventListener('click', function(){
	litter_button.style.cursor = 'not-allowed';
	addnewLitter();
	litter_button.innerText = 'You have thrown a litter!';
	setTimeout(returnText, 1500, litter_button, 'Litter'); 
});

function returnText(button, text) {
  button.innerText = text;
  button.style.cursor = 'pointer';
}

function displayNewObjects(state){
	if(state.new_plants.length>0){
		for(let i=0; i<state.new_plants.length; i++){
		    let number = state.new_plants[i].new_plant_number;
			let top = state.new_plants[i].top;
			let left = state.new_plants[i].left;
			let image = document.createElement('img');
			image.src = 'img/plants/' + number + '.png';
			image.classList = 'garden_image plants';	
			garden_field.append(image);
			image.style.top = top + 'vw';
			image.style.left = left + '%';		   
	}
 }

	 if(state.new_litter.length>0){
			for(let j=0; j<state.new_litter.length; j++){	
		    let number = state.new_litter[j].new_litter_number;
			let top = state.new_litter[j].top;
			let left = state.new_litter[j].left;
			let image = document.createElement('img');
			image.src = 'img/litterimage/' + number + '.png';
			image.classList = 'garden_image litter';	
			garden_field.append(image);
			image.style.top = top + 'vw';
			image.style.left = left + '%';		   
			}
	 }
}
function displayFrames(frames){
	for(let i=0; i<frames.length; i++){
		let current_frame = document.getElementById(frames[i].index);
		if(current_frame) {
		let current_frame_src = current_frame.getAttribute('src');
		current_frame.src = current_frame_src+ 'broken';				
		current_frame.style.height = frames[i].height + 'vw';		
		current_frame.classList.add('lost_image');	
		}		   
	}
}
function addnewPlant(){
	let new_plant_number = getRandomInt(1, 9);
	let left = getRandomInt(1, bg_image_width);
	let y_top = Math.floor(getRandomInt(23, 415));
	let x_left = Math.floor((left*100)/1920);
	let data = {
		new_plant_number: new_plant_number,
		top: y_top,
		left: x_left,
		file: file,
		array_index: array_index
	}
	 socket.emit('newplant', data);
}
function showPlant(data){
	let number = data.new_plant_number;
	let top = data.top;
	let left = data.left;
	let image = document.createElement('img');
	image.src = 'img/plants/' + number + '.png';
	image.classList = 'garden_image plants';	
	garden_field.append(image);
	image.style.top = top + 'vw';
	image.style.left = left + '%';
}

// adding new litter
function addnewLitter(){
	let new_litter_number = getRandomInt(1, 9);
	let left = getRandomInt(1, bg_image_width);
	let minimal = button_block_container_height+ 40;
	let top = getRandomInt(minimal, bg_image_height );
	let x_left =  Math.floor((left*100)/1920);
	let y_top =  Math.floor(getRandomInt(23, 415));;
	let data = {
		new_litter_number: new_litter_number,
		top: y_top,
		left: x_left,
		file: file,
		array_index: array_index
	}
	socket.emit('newlitter', data);
}
function showLitter(data){
	let number = data.new_litter_number;
	let top = data.top;
	let left = data.left;
	let image = document.createElement('img');
	image.src = 'img/litterimage/' + number + '.png';
	image.classList = 'garden_image litter';	
	garden_field.append(image);
	image.style.top = top + 'vw';
	image.style.left = left + '%';
}

socket.on('showplant', data => {
  showPlant(data);
});

socket.on('showlitter', data => {
  showLitter(data);
});

socket.on('initialDOM', fileContent => {
	let state  = JSON.parse(fileContent);
	if(state.frame.length>0){
	   displayFrames(state.frame);	
	}	
	displayNewObjects(state);
  preloader.style.display = 'none';
});
};