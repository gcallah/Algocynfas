function updateDelay() {
  var delay = document.getElementById('myDelay').value;
  delayTime = delay;
  var delayDisplay =  document.getElementById("delayLbl");
  console.log(delay);
  delayDisplay.innerHTML = "Delay: " + delay;
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
  `<ul class='list-group col-3'>
    <li class='list-group-item' style = background-color:${legend.data[0].color}>
    ${legend.data[0].title}
    </li>
    <li class='list-group-item' style = background-color:${legend.data[1].color}>
    ${legend.data[1].title}
    </li>
  </ul>`;
}
