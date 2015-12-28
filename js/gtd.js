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
    +     '"child": [2],'
    +     '"father": -1,'
    +     '"count": 0'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "百度IFE项目",'
    +     '"child": [3,4],'
    +     '"father": -1,'
    +     '"count": 4'
    + '},'
    + '{'
    +     '"id": 2,'
    +     '"name": "默认子分类",'
    +     '"child": [],'
    +     '"father": 0,'
    +     '"count": 0'
    + '},'
    + '{'
    +     '"id": 3,'
    +     '"name": "task0001",'
    +     '"child": [],'
    +     '"father": 1,'
    +     '"count": 1'
    + '},'
    + '{'
    +     '"id": 4,'
    +     '"name": "task0002",'
    +     '"child": [],'
    +     '"father": 1,'
    +     '"count": 3'
    + '}'
+ ']';
var taskText = '['
    + '{'
    +     '"id": 0,'
    +     '"name": "to-do 1",'
    +     '"cate": 4,'
    +     '"finish": true,'
    +     '"date": "2015-05-28",'
    +     '"content": "开始 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 1,'
    +     '"name": "to-do 3",'
    +     '"cate": 4,'
    +     '"finish": true,'
    +     '"date": "2015-05-30",'
    +     '"content": "完成 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 2,'
    +     '"name": "to-do 2",'
    +     '"cate": 4,'
    +     '"finish": false,'
    +     '"date": "2015-05-28",'
    +     '"content": "重构 task0001 的编码任务。"'
    + '},'
    + '{'
    +     '"id": 3,'
    +     '"name": "to-do 4",'
    +     '"cate": 3,'
    +     '"finish": false,'
    +     '"date": "2015-06-29",'
    +     '"content": "完成 task0002 的编码任务。"'
    + '}'
+ ']';

window.onload = function() {
    localStorage.clear();          //remember to delete this line
	if(!localStorage.cate) {
		localStorage.cate = cateText;
        localStorage.task = taskText;
	} 
	cate = JSON.parse(localStorage.cate);
	task = JSON.parse(localStorage.task);

    displayCate();

}

function save() {
    localStorage.cate = JSON.stringify(cate);
    localStorage.task = JSON.stringify(task);
}

function displayCate() {
    var dis_cate = document.getElementById("dis-cate");
    var all_cate = document.getElementById("all");
    var all_num = all_cate.getElementsByTagName("span")[0];
    var task_num = 0;
    for(var i=0;i<cate.length;i++) {
        if(cate[i].father  === -1) {
            task_num += cate[i].count;
            var cate_div = document.createElement("div");
            var catep = document.createElement("p");
            catep.id = cate[i].id;
            catep.innerHTML = cate[i].name+"(<span>"+cate[i].count+"</span>)"
            EventUtil.addHandler(catep,"click",child_cate);
            EventUtil.addHandler(catep,"click",displayTask);
            cate_div.appendChild(catep);
            dis_cate.appendChild(cate_div);
        }
    }
    all_num.innerHTML = task_num;
}

function child_cate() {
    var cate_div = this.parentNode.getElementsByTagName("ul");
    if(cate_div.length === 0) {
        var cateul = document.createElement("ul");
        for(var i=0;i<cate.length;i++) {
            if(cate[i].father == this.id) {
                var child = document.createElement("li");
                child.innerHTML = cate[i].name;
                child.id = cate[i].id;
                EventUtil.addHandler(child,"click",displayTask);
                cateul.appendChild(child);
            }
        }
        if(cateul.innerHTML !== "") {
            if(this.nextSibling != "") {
                this.parentNode.insertBefore(cateul,this.nextSibling);
            } else {
                this.parentNode.appendChild(cateul);
            }
        }
    } else if(cate_div[0].style.display === "none"){
        cate_div[0].style.display = "block";
    } else {
        cate_div[0].style.display = "none";
    }
}
/*function dateSort(date) {
    return date.sort(function (a, b) {
        return a.replace(/-/g, '') - b.replace(/-/g, '');
    });
}*/

function displayTask() {
    var date_div = document.getElementById("task-by-date");
    if(date_div.innerHTML !== "") {
        date_div.innerHTML = "";
    }
    var date =[];
    var date_task =[];
    for(var i=0;i<task.length;i++) {
        //如果task的分类就是这个类
        if(task[i].cate == this.id && date.indexOf(task[i].date) == -1) {
            date.push(task[i].date);
        } else {
            for(var j=0;j<cate.length;j++) {
                //如果任务的分类是这个类的子类
                if(cate[j].id == this.id && cate[j].child.indexOf(task[i].cate) != -1 && date.indexOf(task[i].date) == -1) {
                    date.push(task[i].date);
                    break;
                }
            }
        }
    }
    date.sort();
    for(var i=0;i<date.length;i++) {
        var date_li = document.createElement("li");
        date_li.className = "date";
        date_li.innerHTML = date[i];
        date_div.appendChild(date_li);
        for(var j=0;j<task.length;j++) {
            if(task[j].date === date[i]) {
                var new_li = document.createElement("li");
                new_li.innerHTML = task[j].name;
                EventUtil.addHandler(new_li,"click",task_detail);
                date_div.appendChild(new_li);
            }
        }
    }
}
function task_detail() {
    var edit_div = document.getElementById("editDiv");
    edit_div.style.display = "none";    //将编辑区置为不可见
    var detail_div = document.getElementById("detailDiv");
    detail_div.style.display = "block";
    var detail_title = document.getElementById("detail-title").getElementsByTagName("h3")[0];
    var detail_date = document.getElementById("detail-date");
    var detail_content = document.getElementById("detail-content");
    for(var i=0;i<task.length;i++) {
        if(task[i].name === this.innerHTML) {
            detail_title.innerHTML = task[i].name;
            detail_date.innerHTML = task[i].date;
            detail_content.innerHTML = task[i].content;
        }
    }
    task_deal();
}
function task_deal() {
    var edit_btn = document.getElementById("task-edit");
    var get_btn = document.getElementById("task-get");
    EventUtil.addHandler(edit_btn,"click",task_edit);
}
function task_edit() {
    var edit_div = document.getElementById("editDiv");
    document.getElementById("detailDiv").style.display = "none";
    edit_div.style.display = "block";
    var title_edit = document.getElementById("edit-title");
    var date_edit = document.getElementById("edit-date");
    var content_edit = document.getElementById("edit-content");
    var task_name = this.parentNode.getElementsByTagName("h3")[0].innerHTML;
    for(var i=0;i<task.length;i++) {
        if(task[i].name === task_name) {
            title_edit.innerHTML = "任务名称：<input value="+task[i].name+">";
            date_edit.innerHTML = "任务时间：<input value="+task[i].date+">";
            content_edit.innerHTML = task[i].content;
            console.log(task[i].name,task[i].date,task[i].content);
        }
    }
    
}
