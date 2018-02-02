function updateDelay() {
  var delay = document.getElementById('myDelay').value;
  delayTime = delay;
  var delayDisplay =  document.getElementById("delayLbl");
  delayDisplay.innerHTML = '<p>'
              + 'Delay: '
              + '<strong>' + delay + '</strong>'
              + '</p>';
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
