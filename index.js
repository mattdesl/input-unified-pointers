var Mouse = require('input-mouse');
var Touch = require('input-touch');
var signals = require('signals');

var mouseID = 20;


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

function UnifiedPointers() {
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


	Touch.onTouchStartSignal.add(this.onPointerDownSignal.dispatch);
	Touch.onTouchMoveSignal.add(this.onPointerDragSignal.dispatch);
	Touch.onTouchEndSignal.add(this.onPointerUpSignal.dispatch);
	Touch.onTouchTapSignal.add(filteredSelect);
	
	Mouse.onDownSignal.add(function(x, y) {
		_this.onPointerDownSignal.dispatch(x, y, mouseID);
	});
	Mouse.onUpSignal.add(function(x, y) {
		_this.onPointerUpSignal.dispatch(x, y, mouseID);
	});
	Mouse.onDragSignal.add(function(x, y) {
		_this.onPointerDragSignal.dispatch(x, y, mouseID);
	});
	Mouse.onHoverSignal.add(function(x, y) {
		_this.onPointerHoverSignal.dispatch(x, y, mouseID);
	});
	Mouse.onMoveSignal.add(function(x, y) {
		_this.onPointerMoveSignal.dispatch(x, y, mouseID);
	});
	Mouse.onClickSignal.add(function(x, y) {
		filteredSelect(x, y, mouseID);
	});
}

module.exports = new UnifiedPointers();