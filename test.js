var Pointers = require('./');

var QuickText = require('dom-quick-text');

var totalPointerLabels = 21;
var pointerLabels = [];
for (var i = 0; i < totalPointerLabels; i++) {
	var pointerLabel = new QuickText('[pointer ' + i + ']');
	pointerLabels.push(pointerLabel);
};

var selectCount = 0;
var selectCounterLabel = new QuickText('selects: 0');


function processPointer(id, state, x, y) {
	var label = pointerLabels[id];
	if(label) {
		var status = [
			'[pointer ' + id + '] ' + state,
			'x: ' + x,
			'y: ' + y
		].join(', ');
		label.update(status)
	} else {
		console.warn('not enough labels for this many pointers');
	}
}

function processSelect(id, x, y){
	selectCount++;
	selectCounterLabel.update('selects: ' + selectCount);
}

//move while down
function pointerDrag(x, y, id){
	processPointer(id, 'drag', x, y);
}
//move while up
function pointerHover(x, y, id){
	processPointer(id, 'hover', x, y);
}

function pointerDown(x, y, id){
	processPointer(id, 'down', x, y);
}
function pointerUp(x, y, id){
	processPointer(id, 'up', x, y);
}

//click or tap
function pointerSelect(x, y, id){
	processSelect(id, x, y);
}

var testCoords = {
	x: window.innerWidth * .5, 
	y: window.innerHeight * .5
}
Pointers.onPointerDownSignal.add(pointerDown);
Pointers.onPointerUpSignal.add(pointerUp);
//Pointers.onPointerMoveSignal.add(pointerMove);
Pointers.onPointerHoverSignal.add(pointerHover);
Pointers.onPointerDragSignal.add(pointerDrag);
Pointers.onPointerSelectSignal.add(pointerSelect);

var Touch = require('input-touch');

Touch.testStart(testCoords.x, testCoords.y, 0);
Touch.testMove(testCoords.x + 200, testCoords.y + 100, 0);
Touch.testEnd(testCoords.x + 200, testCoords.y + 100, 0);
