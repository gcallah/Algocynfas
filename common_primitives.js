/**
 * Created by Varun and the professor on 12/10/17.
 * This file contains priitives common to all types of animations.
 */
var delaytime = 1000

async function delay (time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

