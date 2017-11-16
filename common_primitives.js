/**
 * Created by Varun and the professor on 12/10/17.
 * This file contains primitives common to all types of animations.
 */

const DEFAULT_DELAY = 2000;
const DEF_ELEM_HEIGHT = 60;
const DEF_ELEM_WIDTH = 60;
const PCT_FONT_BOX = .72;
const DEF_FONT = Math.floor(DEF_ELEM_HEIGHT * PCT_FONT_BOX);
const DEF_BG_COLOR = '#ffff99';
const DEF_HL_COLOR = '#99ccff';
const DEF_HLK_COLOR = '#0073e6';
const SWAP_COLOR = '#ffb380';
var delayTime = DEFAULT_DELAY;

async function delay (time) {
  return new Promise(function (resolve) {
    console.log("In delay with time of ", time);
    setTimeout(resolve, time)
  })
}

function create_legend() {
    const legend = {
        "data": [{
                    "title": "Item Swapped",
                    "color": SWAP_COLOR,
                },
                {
                    "title": "Item Being Compared",
                    "color": DEF_HL_COLOR,
                        },]
    };
    return legend;
}

function footer() {
  var legend = create_legend();
  return document.getElementById("footer").innerHTML =
  "<table style = width:10%>" +
      "<tr>" +
          "<td style = background-color:" + legend.data[0].color + ">" +
            legend.data[0].title +
          "</td>" +
      "</tr>" +
      "<tr>" +
          "<td style = background-color:" + legend.data[1].color + ">" +
            legend.data[1].title +
          "</td>" +
      "</tr>" +
  "</table>";
}
