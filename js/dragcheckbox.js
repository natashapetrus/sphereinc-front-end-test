$(function () {	
	$('.time')
	.mousedown(rangeMouseDown)
	.mouseup(rangeMouseUp)
	.mousemove(rangeMouseMove);
});

var dragStart = 0;
var dragEnd = 0;
var isDragging = false;
var arr1 = []; // all check boxes
var arr2 = []; // current check boxes
var flag = 0; //indicate drag up or down, if(flag==1) up; if(flag==2) down

function rangeMouseDown(e) {
	//check if it's right button of the mouse click
	if (isRightClick(e)) {
		return false;
	} else {
		var allCells = $(".time");
		dragStart = allCells.index($(this));
		isDragging = true;
		if (typeof e.preventDefault != 'undefined') { e.preventDefault(); } 
		document.documentElement.onselectstart = function () { return false; };
	} 
}

function rangeMouseUp(e) {
	//check if it's right button of the mouse click
	if (isRightClick(e)) {
		return false;
	} else {
		var allCells = $(".time");
		//to check if it's only click
		dragEnd = allCells.index($(this));
		if($.inArray(dragEnd,arr2) == -1){
			arr2.push(dragEnd);
			//selectRange();
		}
		arr1 = arr1.concat(arr2);
		arr1 = $.unique(arr1);
		for(var i = 0; i < arr1.length; i++){
			$(".time").eq(arr1[i]).find(':checkbox').prop('checked', true);
		}
		if(dragStart == dragEnd){
			$(".time").eq(dragStart).find(':checkbox').prop('checked', false);
		}
		//alert(arr1.length);
		
		isDragging = false;
		dragStart = 0;
		dragEnd = 0;
		arr2 = [];
	}
	document.documentElement.onselectstart = function () { return true; }; 
	
}

function rangeMouseMove(e) {
	if (isDragging) {
		var allCells = $(".time");
		dragEnd = allCells.index($(this));
		
		if(dragStart < dragEnd){
			if(flag == 1){
				for(var i = 0; i < arr2.length; i++){
					$(".time").eq(arr2[i]).find(':checkbox').prop('checked', false);
				}
				arr2 = [];
			}
			flag = 2;
			//drag back
			if($.inArray(dragEnd,arr2) != -1){
				var len = arr2.length;
				var last = arr2[len-1];
				if(dragEnd < last){
					$(".time").slice(dragEnd, last+1).find(':checkbox').prop('checked', false);
					for(var i = 0; i < last-dragEnd; i++){
						arr2.pop();
					}
				}
				//in case for drag down, then left, then right
				//else if (dragEnd > last){
				//	$(".time").slice(last, dragStart).find(':checkbox').prop('checked', false);
				//	for(var i = 0; i < dragStart-last; i++){
				//		arr2.pop();
				//	}
				//}
			}
			//drag extend
			else{
				for(var i = dragStart; i <= dragEnd; i++){
					if($.inArray(i,arr2) == -1)
						arr2.push(i);
				}
			}
			selectRange();
		}else if(dragStart > dragEnd){
			if(flag == 2){
				for(var i = 0; i < arr2.length; i++){
					$(".time").eq(arr2[i]).find(':checkbox').prop('checked', false);
				}
				arr2 = [];
			}
			flag = 1;
			//drag back
			if($.inArray(dragEnd,arr2) != -1){
				var len = arr2.length;
				var last = arr2[len-1];
				if(dragEnd > last){
					
					$(".time").slice(last, dragEnd+1).find(':checkbox').prop('checked', false);
					for(var i = 0; i < dragEnd-last; i++){
						arr2.pop();
					}
				}
				//in case for drag up, then right, then left
				//else{
					//alert("x");
				//	$(".time").slice(dragStart+1, last+1).find(':checkbox').prop('checked', false);
				//	for(var i = 0; i < dragStart-last; i++){
				//		arr2.pop();
				//	}
				//}
			}
			//drag extend
			else{
				for(var i = dragStart; i >= dragEnd; i--){
					if($.inArray(i,arr2) == -1)
						arr2.push(i);
				}
			}
			selectRange();
		}else{
			//drag back
			if($.inArray(dragEnd,arr2) != -1){
				var len = arr2.length;
				var last = arr2[len-1];
				if(dragEnd < last){
					$(".time").slice(dragEnd, last+1).find(':checkbox').prop('checked', false);
					for(var i = 0; i < last-dragEnd; i++){
						arr2.pop();
					}
				}else{
					$(".time").slice(last, dragEnd+1).find(':checkbox').prop('checked', false);
					for(var i = 0; i < dragEnd-last; i++){
						arr2.pop();
					}
				}
				$(".time").eq(dragEnd).find(':checkbox').prop('checked', false);
			}
			//drag extend
			else{
				if($.inArray(dragStart,arr2) == -1){
					arr2.push(dragStart);
				}
			}
		}
	}						
}

function selectRange() {
	//merge arr1 with arr2 and set checked to true
	var arr3 = arr1.concat(arr2);
	arr3 = $.unique(arr3);
	for(var i = 0; i < arr3.length; i++){
		$(".time").eq(arr3[i]).find(':checkbox').prop('checked', true);
	}
}

function isRightClick(e) {
	if (e.which) {
		return (e.which == 3);
	} else if (e.button) {
		return (e.button == 2);
	}
	return false;
}