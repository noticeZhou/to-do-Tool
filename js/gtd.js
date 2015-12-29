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
    +     '"date": "2015-05-28",'
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

var choosed_cate = -1;
window.onload = function() {
    //localStorage.clear();          //remember to delete this line
	if(!localStorage.cate) {
		localStorage.cate = cateText;
        localStorage.task = taskText;
	} 
	cate = JSON.parse(localStorage.cate);
	task = JSON.parse(localStorage.task);

    displayCate();
    makeAll();
    var make_all = document.getElementById("all");
    EventUtil.addHandler(make_all,"click",makeAll);

    display_detail(task[0].name,task[0].date,task[0].content,task[0].id);
    choose();
}
//保存数据到localStorge
function save() {
    localStorage.cate = JSON.stringify(cate);
    localStorage.task = JSON.stringify(task);
}
//展示所有的task
function makeAll() {
    reset();
    choosed_cate = -1;
    var date = [];
    for(var i=0,len=task.length;i<len;i++) {
        if( date.indexOf(task[i].date) === -1 ) {
            date.push(task[i].date);
        }
    }
    display_byDate(date);
}
//展示分类----父类
function displayCate() {
    reset();
    var dis_cate = document.getElementById("dis-cate");
    if(dis_cate.innerHTML != "") {
        dis_cate.innerHTML = "";
    }
    var all_cate = document.getElementById("all");
    var all_num = all_cate.getElementsByTagName("span")[0];
    var task_num = 0;
    for(var i=0;i<cate.length;i++) {
        if(cate[i].father  === -1) {
            task_num += cate[i].count;
            var cate_div = document.createElement("div");
            var catep = document.createElement("p");     //分类列表
            catep.id = cate[i].id;
            catep.innerHTML = cate[i].name+"(<span>"+cate[i].count+"</span>)"
            if(i>0) {
                var del_img = document.createElement("img");
                del_img.src = "img/del.png";
                catep.appendChild(del_img);
                EventUtil.addHandler(catep,"mouseover",del_cate);
            }
            EventUtil.addHandler(catep,"click",child_cate);   
            EventUtil.addHandler(catep,"click",displayTask);   
            cate_div.appendChild(catep);
            dis_cate.appendChild(cate_div);
        }
    }
    all_num.innerHTML = task_num;  //所有任务的总数量
    var cate_btn = document.getElementById("add-class");
    EventUtil.addHandler(cate_btn,"click",add_cate);
}
//展示子类的事件函数
function child_cate() {
    reset();
    choosed_cate = this.id;

    var cate_div = this.parentNode.getElementsByTagName("ul");
    if(cate_div.length === 0) {
        var cateul = document.createElement("ul");
        for(var i=0;i<cate.length;i++) {
            if(cate[i].father == this.id) {
                var child = document.createElement("li");
                child.innerHTML = cate[i].name+"&nbsp;("+cate[i].count+")";
                var del_img = document.createElement("img");
                del_img.src = "img/del.png";
                child.appendChild(del_img);
                child.id = cate[i].id;
                EventUtil.addHandler(child,"click",displayTask);
                EventUtil.addHandler(child,"mouseover",del_cate);
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
//删除分类
var cate_id;   //点击删除按钮所在的分类id
function del_cate() {
    var del_btn = this.getElementsByTagName("img")[0];
    del_btn.style.display = "inline-block";
    EventUtil.addHandler(this,"mouseout",function() {
        del_btn.style.display = "none";
    });
    EventUtil.addHandler(del_btn,"click",function(event) {
        //删除事件对象的其他点击事件
        cate_id = EventUtil.getTarget(event).parentNode.id;
        var det_div = document.getElementById("det-div");
        det_div.style.display = "block";
        var cancel_btn = document.getElementById("cate-exit");
        var conf_btn = document.getElementById("cate-ok");
        EventUtil.addHandler(conf_btn,"click",conf_del);
        EventUtil.addHandler(cancel_btn,"click",function(){
            document.getElementById("det-div").style.display = "none";
        })
    });
}
//确定删除一个类
function conf_del() {
    document.getElementById("det-div").style.display = "none";
    document.getElementById("task-by-date").style.display = "none";
    for(var i=1,len=cate.length;i<len;i++) {  //cate.length在不断变化，所以一开始赋初值以不受影响
        if(cate[i].id == cate_id) {
            cate.splice(i,1);     //在cate数组中删除当前分类
            break;
        }
    }
    for(var len1=task.length,j=len1-1;j>=0;j--) { 
        if(task[j].cate == cate_id) {
            task.splice(j,1);              //如果有直接属于该类的task，则删除他们
            for(var len2=cate.length,m=len2-1;m>=0;m--) {
                 //如果删除的这个task属于cate[m]的一个子类。cate[m].count-1
                if(cate[m].child.indexOf(Number(cate_id)) !== -1) {
                    cate[m].count -= 1;
                    break;
                }
            }
        }else {
            for(var k=0;k<cate.length;k++) {
                //如果该类的子类下有task，也删除掉
                if(cate[k].child.indexOf(task[j].cate) != -1 && cate[k].id == cate_id) {
                    task.splice(j,1);
                }
            }
        }
    }
    displayCate();    
}
function add_cate() {
    var cate_div = document.getElementById("cate-div");
    var overlay = document.getElementById("overlay");
    var cate_parent = document.getElementById("cate-parent");
    cate_parent.innerHTML = "<option>无</option>";
    for(var i=1,len=cate.length;i<len;i++) {
        if(cate[i].father === -1) {
            var new_op = document.createElement("option");
            new_op.innerHTML = cate[i].name;
            cate_parent.appendChild(new_op);
        }
    }
    cate_div.style.display = "block";
    overlay.style.display = "block";
    var cate_save = document.getElementById("cate-save");
    var cate_exit = document.getElementById("cate-eit");
    console.log(cate_exit);
    var flag = false,name_flag = true;
    EventUtil.addHandler(cate_save,"click",function(event){
        EventUtil.stopProagation(event);
        if(flag === false) {
            flag = true;
            var cate_name = document.getElementById("class-name");
            for(var i=0,len=cate.length;i<len;i++) {
                if (cate_name.value === cate[i].name) {
                    name_flag = false;
                    alert("不能使用已有的分类名称");
                    break;
                }
                if(cate[i].name === cate_parent.value) {
                    var father = cate[i].id;
                    break;
                }
            }
            if(name_flag === true) {
                if(!father) {
                    var father = -1;
                    var new_cate={
                        "id": cate.length,
                        "name": cate_name.value,
                        "child": [],
                        "father": father,
                        "count": 0
                    };
                    cate.push(new_cate);
                    save();
                    cate_div.style.display = "none";
                    overlay.style.display = "none";
                    displayCate();
                }
            } 
        }   
    });
    EventUtil.addHandler(cate_exit,"click",function() {
        cate_div.style.display = "none";
        overlay.style.display = "none";
    })
}
//以日期date数组作为参数，展示相应的任务列表 
function display_byDate(date) {
    var date_div = document.getElementById("task-by-date");
    if(date_div.innerHTML !== "") {
        date_div.innerHTML = "";
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
                new_li.id = "task"+task[j].id;
                new_li.innerHTML = task[j].name;
                EventUtil.addHandler(new_li,"click",task_detail);
                if(task[j].finish === true){
                    new_li.className = "finish";
                }
                date_div.appendChild(new_li);
            }
        }
    }
    var task_div = document.getElementById("add-div");
    EventUtil.addHandler(task_div,"click",add_task);
}
//展示父类的所有事件的事件函数
function displayTask() {
    reset();
    choosed_cate = this.id;
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
    display_byDate(date);
}
//用来展示task的公共方法
function display_detail(title,date,content,id){
    var edit_div = document.getElementById("editDiv");
    edit_div.style.display = "none";    //将编辑区置为不可见
    var detail_div = document.getElementById("detailDiv");
    detail_div.style.display = "block";
    var detail_title = document.getElementById("detail-title").getElementsByTagName("h3")[0];
    var detail_date = document.getElementById("detail-date");
    var detail_content = document.getElementById("detail-content");
    detail_title.innerHTML = title;
    detail_title.id = id;
    detail_date.innerHTML = date;
    detail_content.innerHTML = content;
    
    var edit_btn = document.getElementById("task-edit");
    var get_btn = document.getElementById("task-get");
    EventUtil.addHandler(edit_btn,"click",task_edit);
    EventUtil.addHandler(get_btn,"click",task_get);
}
function task_detail() {
    var task_id = this.id.replace(/\D/g,'');
    for(var i=0;i<task.length;i++) {
        if(task[i].id == task_id) {
            display_detail(task[i].name,task[i].date,task[i].content,"detail"+task[i].id);
        }
    }
}

function task_edit() {
    var edit_div = document.getElementById("editDiv");
    var detail_div = document.getElementById("detailDiv");
    detail_div.style.display = "none";
    edit_div.style.display = "block";
    var title_edit = document.getElementById("edit-title");
    var date_edit = document.getElementById("edit-date");
    var content_edit = document.getElementById("edit-content");
    var task_name = this.parentNode.getElementsByTagName("h3")[0].innerHTML;
    for(var i=0;i<task.length;i++) {
        if(task[i].name === task_name) {
            var tname = task[i].name.replace(/\s/g,'&nbsp;');
            title_edit.innerHTML = "任务名称：<input type='text' value="+tname+">";
            date_edit.innerHTML = "任务时间：<input type='text' value="+task[i].date+">";
            content_edit.innerHTML = task[i].content;
            break;
        }
    }
    var cancel_btn = document.getElementById("cancel-btn");
    EventUtil.addHandler(cancel_btn,"click",function(event){
        EventUtil.preventDefault(event);
        display_detail(tname,task[i].date,task[i].content,"detail"+task[i].id);
    })
    var ok_btn = document.getElementById("ok-btn");
    EventUtil.addHandler(ok_btn,"click",function(){
        var title = title_edit.getElementsByTagName("input")[0].value;
        var date = date_edit.getElementsByTagName("input")[0].value;
        task[i].name = title;
        task[i].date = date;
        task[i].content = content_edit.value;
        save();
        display_detail(title,date,content_edit.value,"detail"+task[i].id);
    })
}

function task_get() {
    var task_id = this.parentNode.getElementsByTagName("h3")[0].id;
    task_id = task_id.replace(/\D/g,'');
    var get_div = document.getElementById("ok-div");
    get_div.style.display = "block";
    console.log(get_div);
    var ok_btn = document.getElementById("task-ok");
    var exit_btn = document.getElementById("task-exit");
    for(var i=0;i<task.length;i++) {
        if(task[i].id == task_id) {
            break;
        }
    }

    EventUtil.addHandler(ok_btn,"click",function() {
        task[i].finish = true;
        var current_task = document.getElementById("task"+task[i].id);
        current_task.className = "finish";
        save();
        get_div.style.display = "none";
    });

    EventUtil.addHandler(exit_btn,"click",function(){
        get_div.style.display = "none";
    });
}

function add_task() {
    document.getElementById("detailDiv").style.display = "none";
    var edit_div = document.getElementById("editDiv");
    edit_div.style.display = "block";
    var title_edit = document.getElementById("edit-title");
    var date_edit = document.getElementById("edit-date");
    var cate_edit = document.getElementById("edit-cate");
    cate_edit.style.display = "block";
    var cate_select = cate_edit.getElementsByTagName("select")[0];
    for(var i=0;i<cate.length;i++) {
        if(cate[i].child === [] || cate[i].father !== -1){
            var new_op = document.createElement("option");
            new_op.innerHTML = cate[i].name;
            cate_select.appendChild(new_op);      
        }
    }
    title_edit.innerHTML = "任务名称：<input type='text' placeholder='请输入不超过15个字'>";
    date_edit.innerHTML = "任务时间：<input type='text' placeholder='请输入形如2015-05-12的日期'>";
    document.getElementById("edit-content").value = "";

    var conf_btn = document.getElementById("ok-btn");
    var cancel_btn = document.getElementById("cancel-btn");
    EventUtil.addHandler(cancel_btn,"click",function() {
        edit_div.style.display = "none";
        cate_edit.style.display = "none";
        cate_select.innerHTML = "";
        document.getElementById("detailDiv").style.display = "block";
        display_detail(task[0].name,task[0].date,task[0].content,task[0].id);
    })
    EventUtil.addHandler(conf_btn,"click",conf_task);
}

function conf_task() {
    var edit_div = document.getElementById("editDiv");
    var title_edit = document.getElementById("edit-title").getElementsByTagName("input")[0];
    var title = title_edit.value.replace(/\s/g,'&nbsp;');

    var date_edit = document.getElementById("edit-date").getElementsByTagName("input")[0];
    var cate_edit = document.getElementById("edit-cate");
    var cate_select = cate_edit.getElementsByTagName("select")[0];
    for(var i=0,len=cate.length;i<len;i++) {
        if(cate[i].name === cate_select.value){
            var new_cate = cate[i].id;
            cate[i].count++;  //所在类的task数量+1
            if(cate[i].father !== -1) {
                for(var j=0,len=cate.length;j<len;j++) {
                    if(cate[j].id === cate[i].father) {
                        cate[j].count++;  //如果该类有父类，则将父类的task数量+1
                    }
                }
            }
            break;
        }
    }
    var new_task = {
        "id": task.length,
        "name": title,
        "cate": new_cate,
        "finish": false,
        "date": date_edit.value,
        "content": document.getElementById("edit-content").value
    }
    task.push(new_task);
    save();
    edit_div.style.display = "none";
    cate_edit.style.display = "none";
    cate_select.innerHTML = "";
    document.getElementById("detailDiv").style.display = "block";
    display_detail(task[task.length-1].name,task[task.length-1].date,task[task.length-1].content,task.length-1);
    displayCate();
    makeAll();
}

//任务列表筛选
function choose() {
    var all_tasks = document.getElementById("all-tasks");
    var yes_tasks = document.getElementById("yes-tasks");
    var no_tasks = document.getElementById("no-tasks");
    var child = [];

    EventUtil.addHandler(yes_tasks,"click",function() {
        for(var i=0,len=cate.length;i<len;i++) {
            if(cate[i].id == choosed_cate) {
                child = cate[i].child;
            }
        }
        all_tasks.className = "";
        no_tasks.className = "";
        yes_tasks.className = "active";
        dis_choose(true,child);
    });
    EventUtil.addHandler(no_tasks,"click",function() {
        for(var i=0,len=cate.length;i<len;i++) {
            if(cate[i].id == choosed_cate) {
                child = cate[i].child;
            }
        }
        all_tasks.className = "";
        no_tasks.className = "active";
        yes_tasks.className = "";
        dis_choose(false,child);
    });
    EventUtil.addHandler(all_tasks,"click",function() {
        for(var i=0,len=cate.length;i<len;i++) {
            if(cate[i].id == choosed_cate) {
                child = cate[i].child;
            }
        }
        all_tasks.className = "active";
        no_tasks.className = "";
        yes_tasks.className = "";
        dis_choose("all",child);
    });
}


function dis_choose(status,child) {
    var date = [];
    var task_list = document.getElementById("task-by-date");
    task_list.innerHTML = "";
    for(var i=0,len=task.length;i<len;i++) {
        if((task[i].finish === status || status === "all") && (task[i].cate == choosed_cate || 
            choosed_cate === -1 || child.indexOf(task[i].cate) != -1)) {
            if(date.indexOf(task[i].date) === -1) {
                date.push(task[i].date);
                var task_date = document.createElement("li");
                task_date.innerHTML = task[i].date;
                task_date.className = "date";
                task_list.appendChild(task_date);
                var new_li = document.createElement("li");
                new_li.id="task"+task[i].id;
                EventUtil.addHandler(new_li,"click",task_detail);
                new_li.innerHTML = task[i].name;
                if(task[i].finish === true) {
                    new_li.className = "finish";
                } 
                task_list.appendChild(new_li);
            }else {
                var current_date = task_list.getElementsByTagName("li");
                for(var j=0;j<current_date.length;j++) {
                    if(current_date[j].innerHTML == task[i].date) {
                        var new_task = document.createElement("li");
                        if(task[i].finish === true){
                            new_task.className = "finish";
                        }
                        new_task.innerHTML = task[i].name;
                        new_task.id="task"+task[i].id;
                        EventUtil.addHandler(new_task,"click",task_detail);
                        current_date[j+1].parentNode.insertBefore(new_task,current_date[j+1]);
                    }
                }
            }
        }
    }
}

function reset() {
    var all_tasks = document.getElementById("all-tasks");
    var yes_tasks = document.getElementById("yes-tasks");
    var no_tasks = document.getElementById("no-tasks");
    all_tasks.className = "active";
    no_tasks.className = "";
    yes_tasks.className = "";
}