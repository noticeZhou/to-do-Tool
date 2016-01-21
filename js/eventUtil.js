var EventUtil={
	addHandler:function(element,type,handler){
		if (element.addEventListener) {            //DOM2级方法
	        element.addEventListener(type, handler);
	    } else if (element.attachEvent) {          //针对IE8及以下浏览器
	        element.attachEvent("on" + type, handler);
	    }else{
	        element["on"+type] = handler;            //DOM0级方法
	    }
	},
	removeHandler:function(element,type,handler){
		if (element.removeEventListenr) {              //DOM2级方法
	        element.removeEventListenr(event, listener);
	    } else if (element.detachEvent) {              //针对IE8及以下浏览器
	        element.detachEvent("on" + event, listener);
	    }else{
	        element["on"+event] = null;            //DOM0级方法
	    }
	},

	getEvent: function(event){
		return event ? event :window.event;
	},

	getTarget: function(event){           //事件真正的目标
		return event.target || event.srcElement;
	},

	preventDefault: function(event){       //取消事件的默认行为
        if(event.preventDefault){
        	event.preventDefault();
        }else{
        	event.returnValue = false;
        }
	},
	stopProagation: function(event){       //取消事件进一步冒泡或者捕获
		if(event.stopProagation){
			event.stopProagation();
		}else{
			event.cancelBubble = true;
		}
	}
}