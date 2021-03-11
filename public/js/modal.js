'use strict';
const about_us = document.getElementById('about_us');
const modal = document.getElementById('aboutModal');
const close_modal = document.getElementById('close_modal');
const overlay  = document.getElementById('overlay');
about_us.addEventListener('click', function(){
   aboutModal.classList.add('opened');
   overlay.style.display = 'block';

});
close_modal.addEventListener('click', function(){
   aboutModal.classList.remove('opened');
   overlay.style.display = 'none';

});














