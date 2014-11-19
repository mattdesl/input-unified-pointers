var Pointers = require('./');

var QuickText = require('dom-quick-text');

var containerDiv = document.createElement('div');
containerDiv.id = 'threejsContainer';
document.getElementsByTagName('body')[0].appendChild(containerDiv);
console.log(containerDiv);
containerDiv.style.position = 'absolute';
containerDiv.style.left = '25%';
containerDiv.style['background-color'] = '#00ff00';
containerDiv.style.top = '25%';
containerDiv.style.width = '50%';
containerDiv.style.height = '50%';



var containerChildDiv = document.createElement('div');
containerChildDiv.id = 'subContainer';
containerDiv.appendChild(containerChildDiv);
containerChildDiv.style.position = 'absolute';
containerChildDiv.style.left = '25%';
containerChildDiv.style['background-color'] = '#7fff00';
containerChildDiv.style.top = '25%';
containerChildDiv.style.width = '50%';
containerChildDiv.style.height = '50%';


function preparePointer(element) {
	var pointers = new Pointers(element);
	var totalPointerLabels = 11;
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
	pointers.onPointerDownSignal.add(pointerDown);
	pointers.onPointerUpSignal.add(pointerUp);
	//pointers.onPointerMoveSignal.add(pointerMove);
	pointers.onPointerHoverSignal.add(pointerHover);
	pointers.onPointerDragSignal.add(pointerDrag);
	pointers.onPointerSelectSignal.add(pointerSelect);

	pointers.touch.testStart(testCoords.x, testCoords.y, 0);
	pointers.touch.testMove(testCoords.x + 200, testCoords.y + 100, 0);
	pointers.touch.testEnd(testCoords.x + 200, testCoords.y + 100, 0);
}

preparePointer(document);
preparePointer(containerDiv);