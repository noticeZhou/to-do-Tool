/*
 *created by andy on 2015/12/28
 */
//use localStorage and Json to storage data
// cate 表示分类，包含子类和父类
var cate,task;
var cateText = '['
    + '{'
    +     '"id": 0,'
    +     '"name": "默认分类",'
    +     '"child": [0]'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "百度IFE项目",'
    +     '"child": [1, 3]'
    + '},'
    + '{'
    +     '"id": 0,'
    +     '"name": "默认子分类",'
    +     '"child": [],'
    +     '"father": 0'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "task0001",'
    +     '"child": [0, 1, 2],'
    +     '"father": 1'
    + '},'
    + '{'
    +     '"id": 3,'
    +     '"name": "task0002",'
    +     '"child": [3],'
    +     '"father": 1'
    + '}'
+ ']';


window.onload = function() {
	console.log(cateText);
	if(!localStorage.cate) {
		localStorage.cate = cateText;
	} else {
		localStorage.cate = JSON.parse(cateText[0]);
	}
	cate = JSON.parse(localStorage.cate);
	console.log(cate);
}

