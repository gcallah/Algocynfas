// How the graph and tree pages draw with sigma: shaded nodes with a white rim
// and a soft shadow, labels centred inside the nodes, round-ended edges, and
// weights on a small white tag. It replaces sigma's default canvas renderers,
// so load it after the sigma scripts. Colours still come from the algorithms
// (node.color / edge.color); only the look changes.
(function() {
  'use strict';
  if (typeof sigma === 'undefined') return;
  sigma.utils.pkg('sigma.canvas.hovers');

  var LABEL_FONT = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

  // "#abc" or "#aabbcc" -> [r, g, b]; null for anything else (named colours).
  function rgb(color) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color || '');
    if (!m) return null;
    var h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return [0, 2, 4].map(function(i) { return parseInt(h.slice(i, i + 2), 16); });
  }

  // Mix a colour with white (amount > 0) or black (amount < 0).
  function shade(c, amount) {
    var target = amount > 0 ? 255 : 0, a = Math.abs(amount);
    return 'rgb(' + c.map(function(v) { return Math.round(v + (target - v) * a); }).join(',') + ')';
  }

  function isLight(c) {
    return c && 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2] > 160;
  }

  // Nodes the algorithms are working on (anything not in the default colour)
  // get a faint halo so they stand out.
  function isActive(color, settings) {
    var def = (typeof EdgeNodeCOLOR !== 'undefined' ? EdgeNodeCOLOR : settings('defaultNodeColor'));
    var c = (color || '').toLowerCase();
    return c && c !== def.toLowerCase() && c !== '#ff0000' && c !== '#000000';
  }

  // Draw nodes at least this big, so a label fits inside.
  var MIN_RADIUS = 11;
  function radius(node, p) {
    return Math.max(MIN_RADIUS, node[p + 'size']);
  }

  // Draw text with a white outline, so it reads over edges and the dot grid.
  function outlinedText(ctx, text, x, y) {
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = '#1c2833';
    ctx.fillText(text, x, y);
  }

  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
  }

  sigma.canvas.nodes.def = function(node, ctx, settings) {
    var p = settings('prefix') || '';
    var x = node[p + 'x'], y = node[p + 'y'], r = radius(node, p);
    var color = node.color || settings('defaultNodeColor');
    var c = rgb(color);

    ctx.save();
    if (isActive(color, settings) && c) {
      circle(ctx, x, y, r + 5);
      ctx.fillStyle = 'rgba(' + c.join(',') + ',0.25)';
      ctx.fill();
    }
    // Body: a radial gradient lit from the upper left, with a drop shadow.
    ctx.shadowColor = 'rgba(20, 40, 60, 0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    if (c) {
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, r * 0.1, x, y, r * 1.05);
      g.addColorStop(0, shade(c, 0.45));
      g.addColorStop(0.55, color);
      g.addColorStop(1, shade(c, -0.18));
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = color;
    }
    circle(ctx, x, y, r);
    ctx.fill();
    // A white rim.
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = Math.max(1.5, r * 0.15);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.stroke();
    ctx.restore();
  };

  // The label goes inside the node, sized to fit. A label like "b  d = 5"
  // (name, two spaces, note) puts the name inside and the note beside the node;
  // a label too long to fit inside goes beside it.
  sigma.canvas.labels.def = function(node, ctx, settings) {
    var p = settings('prefix') || '';
    var x = node[p + 'x'], y = node[p + 'y'], r = radius(node, p);
    if (node.label === undefined || node.label === null) return;
    var label = String(node.label);
    if (label === '') return;
    var split = label.indexOf('  ');
    var inside = split >= 0 ? label.slice(0, split) : label;
    var beside = split >= 0 ? label.slice(split).trim() : '';

    ctx.save();
    var fontSize = Math.round(r * 0.95);
    ctx.font = '600 ' + fontSize + 'px ' + LABEL_FONT;
    while (fontSize > 9 && ctx.measureText(inside).width > r * 1.45) {
      fontSize -= 1;
      ctx.font = '600 ' + fontSize + 'px ' + LABEL_FONT;
    }
    if (ctx.measureText(inside).width > r * 1.6) {
      // Too long for the node: put all of it beside.
      beside = label.trim();
      inside = '';
    }
    if (inside) {
      ctx.fillStyle = isLight(rgb(node.color || settings('defaultNodeColor'))) ? '#1c2833' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(inside, x, y + 0.5);
    }
    if (beside) {
      var size = Math.min(15, settings('defaultLabelSize') || 14);
      ctx.font = '600 ' + size + 'px ' + LABEL_FONT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      outlinedText(ctx, beside, x + r + 5, y);
    }
    ctx.restore();
  };

  // Hovering just redraws the node with a darker rim (instead of sigma's
  // default label box beside it).
  sigma.canvas.hovers.def = function(node, ctx, settings) {
    var p = settings('prefix') || '';
    sigma.canvas.nodes.def(node, ctx, settings);
    ctx.save();
    circle(ctx, node[p + 'x'], node[p + 'y'], radius(node, p) + 1);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(28, 40, 51, 0.55)';
    ctx.stroke();
    ctx.restore();
    sigma.canvas.labels.def(node, ctx, settings);
  };

  sigma.canvas.edges.def = function(edge, source, target, ctx, settings) {
    var p = settings('prefix') || '';
    ctx.save();
    ctx.strokeStyle = edge.color || settings('defaultEdgeColor');
    ctx.lineWidth = edge[p + 'size'] || 1;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(source[p + 'x'], source[p + 'y']);
    ctx.lineTo(target[p + 'x'], target[p + 'y']);
    ctx.stroke();
    ctx.restore();
  };

  // Directed edges: the arrowhead stops at the drawn rim of the target (plus
  // its white ring), with a slightly sharper head than sigma's.
  sigma.canvas.edges.arrow = function(edge, source, target, ctx, settings) {
    var p = settings('prefix') || '';
    var size = edge[p + 'size'] || 1;
    var sX = source[p + 'x'], sY = source[p + 'y'], tX = target[p + 'x'], tY = target[p + 'y'];
    var tR = radius(target, p) + 2;
    var aSize = Math.max(size * 3, settings('minArrowSize') || 0, 8);
    var d = Math.sqrt((tX - sX) * (tX - sX) + (tY - sY) * (tY - sY));
    if (d === 0) return;
    var aX = sX + (tX - sX) * (d - aSize - tR) / d;
    var aY = sY + (tY - sY) * (d - aSize - tR) / d;
    var vX = (tX - sX) * aSize / d, vY = (tY - sY) * aSize / d;
    var color = edge.color || settings('defaultEdgeColor');

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(sX, sY);
    ctx.lineTo(aX, aY);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(aX + vX, aY + vY);
    ctx.lineTo(aX + vY * 0.5, aY - vX * 0.5);
    ctx.lineTo(aX - vY * 0.5, aY + vX * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };

  // Edge weights sit on a small white tag in the middle of the edge.
  if (sigma.canvas.edges.labels) {
    sigma.canvas.edges.labels.def = function(edge, source, target, ctx, settings) {
      if (typeof edge.label !== 'string' || edge.label === '' || source === target) return;
      var p = settings('prefix') || '';
      var label = String(edge.label);
      var x = (source[p + 'x'] + target[p + 'x']) / 2;
      var y = (source[p + 'y'] + target[p + 'y']) / 2;
      var fontSize = Math.max(11, Math.min(15, settings('defaultEdgeLabelSize') || 13));
      ctx.save();
      ctx.font = '600 ' + fontSize + 'px ' + LABEL_FONT;
      var w = ctx.measureText(label).width + 10, h = fontSize + 6;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = edge.color || settings('defaultEdgeColor');
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
      } else {
        ctx.rect(x - w / 2, y - h / 2, w, h);
      }
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#1c2833';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y + 0.5);
      ctx.restore();
    };
  }
})();
