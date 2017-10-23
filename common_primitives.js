/**
 * Created by Varun and the professor on 12/10/17.
 * This file contains priitives common to all types of animations.
 */
var delaytime = document.getElementById('myRange').value

async function delay (time) {
  return new Promise(function (resolve) {
    console.log("In delay with time of ", time);
    setTimeout(resolve, time)
  })
}
