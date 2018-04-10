function Drag(el, rmNode, options) {
	this.mobileEventType = ['touchstart', 'touchmove', 'touchend'];
	this.pcEventType = ['mousedown', 'mousemove', 'mouseup'];

	this.defaultOptions = {
		supernatant:{
			boxShadow : "0 4px 10px #DEDADA",
			background: '#fff',
			opacity: '0.8'
		},
		select: {
			background: '#efefef'
		}
	}
	this.options = _mergeOptions(this.defaultOptions, options);
	this.getChildNodes(el);
	this.rectHeight = this.childNodes[0].offsetHeight;
	this.mouseEvent(el);
}
Drag.prototype.mouseEvent = function(el) {
	//判断是否是手机	
	if(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)) {
		this.dragEvent(el, this.mobileEventType);
	} else {
		this.dragEvent(el, this.pcEventType);
	}
}
Drag.prototype.dragEvent = function(el, eventName) {
	var that = this;
	//获取模型元素位置信息
	this.childNodeStyleTop = [];
	this.childNodeStyleLeft = that.childNodes[0].offsetLeft;
	var parentToBody = this.childNodes[0].offsetTop;
	this.childNodes.forEach(function(el) {
		that.childNodeStyleTop.push(el.offsetTop - parentToBody);
	}) 

	this.parentNode.style.position = 'relative';
	
	this.addEvent(this.parentNode, eventName[0], function(e) {
		var e = e || window.event;
		e.preventDefault();
		that.mouseDownX = e.x || e.touches[0].clientX;
		that.mouseDownY = e.y || e.touches[0].clientY;
		that.target = e.target || e.srcElement;
		//更新子节点位置
		that.newChildNode = [].filter.call(that.parentNode.childNodes, function(item) {
			return (item.nodeType === 1)
		});

		that.index = that.newChildNode.indexOf(e.target);
		//克隆节点并插入
		that.cloneNode = that.target.cloneNode(true);
		that.parentNode.insertBefore(that.cloneNode, that.newChildNode[0]);
		//更新克隆节点位置并设置CSS样式
		update(that);
		//添加move,up事件
		that.addEvent(document, eventName[1], mouseMoveHandle(that))
		that.addEvent(document, eventName[2], mouseUpHandle(that, eventName))
	})
}
function update(that) {
	that.cloneNode.style.position = 'absolute';
	that.cloneNode.style.top = that.childNodeStyleTop[that.index]+'px';
	that.cloneNode.style.left = that.childNodeStyleLeft;
	that.cloneNode.style.boxShadow = that.options.supernatant.boxShadow;
	that.cloneNode.style.background = that.options.supernatant.background;
	that.cloneNode.style.opacity = that.options.supernatant.opacity;
	that.target.style.background = that.options.select.background;
}
function mouseMoveHandle(that) {
	mouseMove = function(e) {
		var e = e || window.event;
		that.moveX = (e.x || e.touches[0].clientX) - that.mouseDownX;
		that.moveY = (e.y || e.touches[0].clientY) - that.mouseDownY;
		//插入位置
		that.insertIndex = that.index + Math.round(that.moveY/that.rectHeight);
		//异步插入节点
		setTimeout(insert(that), 0)
	}
	return mouseMove;
}
function insert(that){
	//克隆节点随鼠标位置移动
		that.cloneNode.style.transform = 'translate3d(' + that.moveX + 'px,' + that.moveY + 'px,' + 0 + ')';
		//防止溢出并插入节点
		if(that.insertIndex >= 0 && that.insertIndex <= that.childNodes.length){
			if(that.moveY > 0) {
				that.parentNode.insertBefore(that.target, that.newChildNode[that.insertIndex + 1]);
			} else {
				that.parentNode.insertBefore(that.target, that.newChildNode[that.insertIndex]);
			}
		} else {
			return;
		}
}
function mouseUpHandle(that, eventName) {
	var mouseUp = function(e) {
		var e = e || window.event;
		e.preventDefault();
		that.target.style.background = '';
		//鼠标抬起移除克隆节点并移除事件监听
		that.parentNode.removeChild(that.cloneNode)
		rmListener(document, eventName[1], mouseMove);
		rmListener(document, eventName[2], mouseUp);
		
	}
	return mouseUp;
}

function rmListener(el, type, fn) {
	if(window.addEventListener) {
		el.removeEventListener(type, fn, false);
	} else {
		el.detachEvent('on' + type, fn)
	}
}

Drag.prototype.addEvent = function(el, type, fn) {
	if(window.addEventListener) {
		el.addEventListener(type, fn, false);
	} else if(el.attachEvent) {
		el.attachEvent('on' + type, fn);
	} else {
		el['on' + type] = fn;
	}
}
Drag.prototype.getDom = function(el) {
	var dom = document.querySelector(el);
	return dom;
}
Drag.prototype.getChildNodes = function(el) {
	this.parentNode = this.getDom(el);
	var childNodesList = this.parentNode.childNodes;
	this.childNodes = [].filter.call(childNodesList, function(item) {
		return (item.nodeType === 1)
	})
}
function _mergeOptions(defaultOptions, options) {
	if(!options){
		return defaultOptions;
	} else {
		for(var item in options) {
			defaultOptions[item] = options[item];
		}
	}
	return defaultOptions;
}