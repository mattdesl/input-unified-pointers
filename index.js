var Mouse = require('input-mouse');
var Touch = require('input-touch');
var signals = require('signals');

var mouseID = 20;
function UnifiedPointers() {
	this.onPointerSelectSignal = new signals.Signal();
	this.onPointerDownSignal = new signals.Signal();
	this.onPointerUpSignal = new signals.Signal();
	this.onPointerMoveSignal = new signals.Signal();
	this.onPointerHoverSignal = new signals.Signal();
	this.onPointerDragSignal = new signals.Signal();

	Touch.onTouchStartSignal.add(this.onPointerDownSignal.dispatch);
	Touch.onTouchMoveSignal.add(this.onPointerDragSignal.dispatch);
	Touch.onTouchEndSignal.add(this.onPointerUpSignal.dispatch);
	Touch.onTouchTapSignal.add(this.onPointerSelectSignal.dispatch);

	var _this = this;
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
		_this.onPointerSelectSignal.dispatch(x, y, mouseID);
	});
}

module.exports = new UnifiedPointers();