'use strict';
let date = new Date(2021, 2, 7);
let final_garden_date = date.setDate(date.getDate() + 21);
date = new Date(2021, 2, 7);
let adv_garden_date = date.setDate(date.getDate() + 14);
date = new Date(2021, 2, 7);
let piecefull_garden_date = date.setDate(date.getDate() + 7);
let current_date = new Date();
let hour = 3600000;

setInterval(getactualDate, hour); 

if(current_date > piecefull_garden_date){	
	if(document.location.href != 'https://cleangarden.herokuapp.com/garden.html'){
		window.location.href = 'https://cleangarden.herokuapp.com/garden.html';
	 }
}
if(current_date > adv_garden_date ){
	if(document.location.href != 'https://cleangarden.herokuapp.com/info.html'){
		window.location.href = 'https://cleangarden.herokuapp.com/info.html';
	 }
}
if(current_date>= final_garden_date){
	if(document.location.href != 'https://cleangarden.herokuapp.com/shop.html'){
		window.location.href = 'https://cleangarden.herokuapp.com/shop.html';
	 }
} 
function getactualDate(){
   current_date = new Date();	
}














