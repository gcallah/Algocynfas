function updateDelay() {
  var delay = document.getElementById('myDelay').value;
  delayTime = delay;
  var delayDisplay =  document.getElementById("delayLbl");
  delayDisplay.innerHTML = '<p>'
              + 'Delay: '
              + '<strong>' + delay + '</strong>'
              + '</p>';
}
