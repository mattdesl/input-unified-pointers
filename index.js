var Mouse = require('input-mouse');
var Touch = require('input-touch');
var signals = require('signals');

var mouseID = 10;


//filter out fake clicks that browsers send after touch events
var filterFakeClicksDuration = 60;
var fakeClickHistory = [];
var fakeClickHistoryMaxLength = 10;
var fakeClickHistoryIndex = 0;
for (var i = 0; i < fakeClickHistoryMaxLength; i++) {
	fakeClickHistory[i] = {
		x: 0, y: 0, time: 0
	}
};
var fakeClick;

function checkHistory(x, y, time) {
	for (var i = 0; i < fakeClickHistoryMaxLength; i++) {
		fakeClick = fakeClickHistory[i]; 
		if(fakeClick.x == ~~x && fakeClick.y == ~~y) {
			if(time - fakeClick.time < filterFakeClicksDuration) {
				return true;
			}
		}
	};
}

function logHistory(x, y, time) {
	fakeClickHistoryIndex = (fakeClickHistoryIndex + 1) % fakeClickHistoryMaxLength;
	fakeClick = fakeClickHistory[fakeClickHistoryIndex];
	fakeClick.x = ~~x;
	fakeClick.y = ~~y;
	fakeClick.time = time;
}
//

function UnifiedPointers(targetElement) {
	this.touch = new Touch(targetElement);
	this.mouse = new Mouse(targetElement);
	this.onPointerSelectSignal = new signals.Signal();
	this.onPointerDownSignal = new signals.Signal();
	this.onPointerUpSignal = new signals.Signal();
	this.onPointerMoveSignal = new signals.Signal();
	this.onPointerHoverSignal = new signals.Signal();
	this.onPointerDragSignal = new signals.Signal();

	var _this = this;

	//filter out fake clicks that browsers send after touch events
	function filteredSelect(x, y, id) {
		var time = (new Date()).getTime();
		if(!checkHistory(x, y, time)) {
			_this.onPointerSelectSignal.dispatch(x, y, id);
		}
		logHistory(x, y, time);
	}


	this.touch.onTouchStartSignal.add(this.onPointerDownSignal.dispatch);
	this.touch.onTouchMoveSignal.add(this.onPointerDragSignal.dispatch);
	this.touch.onTouchEndSignal.add(this.onPointerUpSignal.dispatch);
	this.touch.onTouchTapSignal.add(filteredSelect);
	
	this.mouse.onDownSignal.add(function(x, y) {
		_this.onPointerDownSignal.dispatch(x, y, mouseID);
	});
	this.mouse.onUpSignal.add(function(x, y) {
		_this.onPointerUpSignal.dispatch(x, y, mouseID);
	});
	this.mouse.onDragSignal.add(function(x, y) {
		_this.onPointerDragSignal.dispatch(x, y, mouseID);
	});
	this.mouse.onHoverSignal.add(function(x, y) {
		_this.onPointerHoverSignal.dispatch(x, y, mouseID);
	});
	this.mouse.onMoveSignal.add(function(x, y) {
		_this.onPointerMoveSignal.dispatch(x, y, mouseID);
	});
	this.mouse.onClickSignal.add(function(x, y) {
		filteredSelect(x, y, mouseID);
	});
}

module.exports = UnifiedPointers;