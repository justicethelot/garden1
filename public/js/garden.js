'use strict';
window.onload = function() {
const preloader = document.getElementById('preloader');
const pick_weed = document.getElementById('pickone');
const plant = document.getElementById('plant');
const pickup = document.getElementById('pickup');
const litter_button= document.getElementById('litter_button');
const dirty_garden_game = document.getElementById('dirty_garden_game');
let bg_image_height = document.getElementById('bg_image_dirty').clientHeight;
let button_block_container_height = document.getElementById('button_block_container').clientHeight;
let bg_image_width = document.getElementById('bg_image_dirty').clientWidth;
let images = document.getElementsByClassName('garden_image');
let weeds = document.getElementsByClassName('weeds');
let litter = document.getElementsByClassName('litter');
const socket = io();
const room = 'gardeners';
let file = 'garden';
let array_index = 0;
let username = Math.random().toString(36).substring(7);
// Join garden
socket.emit('joinRoom', { username, room, file });
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
pick_weed.addEventListener('click', function(){
	pick_weed.style.cursor = 'not-allowed';
	pullWeeds();
	 
});

plant.addEventListener('click', function(){
	plant.style.cursor = 'not-allowed';
	addnewPlant();
	plant.innerText = 'You have planted a flower!';
	setTimeout(returnText, 1500, plant, 'Plant a flower'); 
});

pickup.addEventListener('click', function(){
	pickup.style.cursor = 'not-allowed';
	RemoveLitter();	
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
			dirty_garden_game.append(image);
			image.style.top = top + 'vw';
			image.style.left = left + '%';		   
	}
 }
	 if(state.new_litter.length>0){
			for(let j=0; j<state.new_litter.length; j++){	
			    let number = state.new_litter[j].new_litter_number;
				let top = state.new_litter[j].top;
				let left = state.new_litter[j].left;			
				let litter_id = state.new_litter[j].id;
				let image = document.createElement('img');
				image.src = 'img/litter/' + number + '.png';
				image.classList = 'garden_image litter';			
				image.setAttribute('id', litter_id);
				dirty_garden_game.append(image);
				image.style.top = top + 'vw';
				image.style.left = left + '%';		   
			}
	 }
}
function displayFrames(frames){
	for(let i=0; i<frames.length; i++){
		let current_frame = document.getElementById(frames[i].index);
		if(current_frame) {	
		current_frame.classList.add('lost_image');	
		}		   
	}
}
function addnewPlant(){
	let new_plant_number = getRandomInt(1, 9);
	let left = getRandomInt(1, bg_image_width);	
	let y_top = Math.floor(getRandomInt(34, 420));
	let x_left = Math.floor(left*100/1920);	 
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
	dirty_garden_game.append(image);
	image.style.top = top + 'vw';
	image.style.left = left + '%';
}

// adding new litter
function addnewLitter(){
	let id = Number(getMaxCurrentId())+1;
	let new_litter_number = getRandomInt(20, 28);

	let left = getRandomInt(1, bg_image_width);	
	let x_left =  Math.floor(left*100/1920);
	let y_top =  Math.floor(getRandomInt(34, 420));
	let data = {
		new_litter_number: new_litter_number,
		top: y_top,
		left: x_left,
		file: file,
		array_index: array_index,
		id: id
	 }
	socket.emit('newlitter', data);
}
function showLitter(data){
	let number = data.new_litter_number;
	let top = data.top;
	let left = data.left;
	let image_id = data.id;

	let image = document.createElement('img');
	image.src = 'img/litter/' + number + '.png';
	image.classList = 'garden_image litter';
	let added_id = 'item' + image_id;
	image.setAttribute('id', added_id);	
	dirty_garden_game.append(image);
	image.style.top = top + 'vw';
	image.style.left = left + '%';
}
// weeds
function pullWeeds(){
weeds = document.getElementsByClassName('weeds');
	for (let i=0; i<weeds.length; i++){
		let weed_src = weeds[i].getAttribute('src');
	   	if(!weeds[i].classList.contains('lost_image')){
	   	let index =weeds[i].getAttribute('id');	   	
		let data = {
			index: index,
			file: file,
			array_index: array_index
			
		};
		pick_weed.innerText = 'You have pulled a weed!';
	    setTimeout(returnText, 1500, pick_weed, 'Pull a weed');
		socket.emit('newpullweeds', data);
		return;	
	  }
	  else{
	  	pick_weed.innerText = 'No weeds around';	
	  }
	}  
}
function showRemoveWeed(data){
	let index = data.index;
	let weeds_item = document.getElementById(index);
	let weeds_src = weeds_item.getAttribute('src');
	if(weeds_src){
		weeds_item.src = weeds_src;
		weeds_item.classList.add('lost_image');	
		weeds_item.style.height = data.height + 'vw';	
	}
}

function RemoveLitter(){
litter = document.getElementsByClassName('litter');
	for (let i=0; i<litter.length; i++){
		let litter_src = litter[i].getAttribute('src');
	   	if(!litter[i].classList.contains('lost_image')){
	   	let index =litter[i].getAttribute('id'); 	   		
		let data = {
			index: index,
			file: file,
			array_index: array_index			
		};
		pickup.innerText = 'You have picked up a trash!';
	setTimeout(returnText, 1500, pickup, 'Pick up trash'); 
		socket.emit('newremovedlitter', data);
		return;	
	  }
	  else{
	  	pickup.innerText = 'No trash around';
	setTimeout(returnText, 1500, pickup, 'Pick up trash'); 
	  }

	}  
}
function showRemoveLitter(data){
	let index = data.index;
	let litter_item = document.getElementById(index);	
	let litter_src = litter_item.getAttribute('src');
	if(litter_src){
	litter_item.src = litter_src;
	litter_item.classList.add('lost_image');	
	}	
}

socket.on('showplant', data => {
  showPlant(data);
});

socket.on('showlitter', data => {
  showLitter(data);
});

socket.on('showpulledWeed', data => {
  showRemoveWeed(data);
});

socket.on('showRemovedLitter', data => {
   showRemoveLitter(data);
});

socket.on('initialDOM', fileContent => {
	let state  = JSON.parse(fileContent);
	if(state.frame.length>0){
	   displayFrames(state.frame);	
	}	
	displayNewObjects(state);
  preloader.style.display = 'none';
});

function getMaxCurrentId(){
let images = document.getElementsByClassName('garden_image');
let max = 0;
  for(let a=0; a<images.length; a++){
	let current_id = images[a].getAttribute('id');
	if(current_id){
		current_id = current_id.slice(4);

      if(Number(current_id) >max){
      	max = current_id;
      }
	}    
 }
 return max;	
}
};