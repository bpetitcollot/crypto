document.querySelector('#add-widget').addEventListener('click', function(e){
  document.querySelector('#app-container').insertAdjacentHTML('afterbegin', '<decrypt-widget />');
});
