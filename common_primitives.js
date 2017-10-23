/**
 * Created by Varun and the professor on 12/10/17.
 * This file contains primitives common to all types of animations.
 */

const DEFAULT_DELAY = document.getElementById('myRange'); // in milliseconds
const DEF_ELEM_HEIGHT = 60;
const DEF_ELEM_WIDTH = 60;
const PCT_FONT_BOX = .72;
const DEF_FONT = Math.floor(DEF_ELEM_HEIGHT * PCT_FONT_BOX);
const DEF_BG_COLOR = '#ffff99';
const DEF_HL_COLOR = '#99ccff';
const DEF_HLK_COLOR = '#0073e6';
var delaytime = 1000

async function delay (time) {
  return new Promise(function (resolve) {
    console.log("In delay with time of ", time);
    setTimeout(resolve, time)
  })
}
