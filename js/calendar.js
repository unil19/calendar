function calendar(container,mode,callBack,callBack2){
	this.container=container;
	if(typeof mode==="function"){
		this.mode=1;
		this.callBack=mode;
	}
	this.mode=mode||1;
	this.width=600;//需要考虑
	this.callBack=callBack||null;
	this.callBack2=callBack2||null;
	this.height=300;//需要考虑
	this.monthLength=[31,29,31,30,31,30,31,31,30,31,30,31];
	this.week=["日","一","二","三","四","五","六"];
	this.oCal=null;//日历主体
	this.oTb=null;//日历日期区域
	this.oYearSele=null;//年份选择按钮
	this.oMonthSele=null;//月选择按钮
	this.oYearNext=null;
	this.oYearPrev=null;
	this.oMonthNext=null;
	this.oMonthPrev=null;
	this.oYear="";//选中的年份
	this.oMonth="";//选中的月
	this.oDate="";//选中的日期
	this.oDateRange=[];
	this.init();
}
calendar.prototype={
	constructor:calendar,
	init:function(){
		this.styleInit();//样式初始化
		this.dateInit();//日期初始化
		this.eventInit();
	},
	styleInit:function(){//在容器中创建日历结构
		if (!this.container.style.position) {
			this.container.style.position="relative";
		};
		this.container.innerHTML='<div class="calendar"><div class="info"><div class="delete">→</div><div class="year clear"><div class="prev"><</div><div class="pare"><div class="yearShow"></div><select class="yearSelect"></select></div><div class="next">></div></div><div class="month clear"><div class="prev"><</div><div class="pare"><div class="monthShow"></div><select class="monthSelect"></select></div><div class="next">></div></div><div class="button">确定</div></div><table class="tab"><thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead><tbody></tbody></table></div>';
		var str1="",str2="",str3="";
		for (var i = 1950; i <=2050; i++) {//设置年限范围
			str1+="<option value='"+i+"年'>"+i+"年</option>";
		};
		for (var j = 0; j < 12; j++) {
			str2+="<option value='"+(j+1)+"月'>"+(j+1)+"月</option>";
		};
		for(var m=0; m<6;m++){
			str3+="<tr>";
			for (var n = 0; n < 7; n++) {
				str3+="<td></td>";
			};
			str3+="</tr>";
		}
		this.oCal=$(".calendar",this.container)[0];//找到最新插入的日历
		this.oInfo=$(".info",this.oCal)[0]
		this.oCalBo=$(".tab",this.oCal)[0]
		this.oTb=$("tbody",$(".tab",this.oCal)[0])[0];//加入日期表格
		this.oYearSele=$(".yearSelect",this.oCal)[0];
		this.oMonthSele=$(".monthSelect",this.oCal)[0];
		this.oYearNext=$(".next",this.oCal)[0];
		this.oYearPrev=$(".prev",this.oCal)[0];
		this.oMonthNext=$(".next",this.oCal)[1];
		this.oMonthPrev=$(".prev",this.oCal)[1];
		this.oYear=$(".yearShow",this.oCal)[0];
		this.oMonth=$(".monthShow",this.oCal)[0];
		this.oDate=$("td",$(".tab",this.oCal)[0]);
		this.oYearFa=$(".year",this.oCal)[0];
		this.oDele=$(".delete",this.oCal)[0];
		this.oCal.style.width=this.width+"px";
		this.oCal.style.height=this.height+"px";
		this.oYearSele.innerHTML=str1;
		this.oMonthSele.innerHTML=str2;
		this.oTb.innerHTML=str3;
		if(this.mode==3){
			this.oDele.style.display="block";
		}
		if(this.mode==4){
			this.oCalBo.style.display="none";
			this.oInfo.style.width=this.oCal.style.width=400+"px";
			this.oInfo.style.height=this.oCal.style.height=40+"px";
		}
	},
	dateInit:function(){//时间初始化为当前时间
		this.dateRender("now");
	},
	eventInit:function(){//添加事件函数
		var that=this;
		this.oYearSele.onchange=newDateRender;
		this.oMonthSele.onchange=newDateRender;
		this.oYearNext.onclick=function(){//下一年
			if(that.oYearSele.selectedIndex<that.oYearSele.options.length-1){
				that.oYearSele.selectedIndex++;
				newDateRender();
			}
		};
		this.oYearPrev.onclick=function(){//
			if(that.oYearSele.selectedIndex>0){
				that.oYearSele.selectedIndex--;
				newDateRender();
			};
		};
		this.oMonthNext.onclick=function(){
			if(that.oMonthSele.selectedIndex<that.oMonthSele.options.length-1){
				that.oMonthSele.selectedIndex++;
			}else if(that.oYearSele.selectedIndex<that.oYearSele.options.length-1){
				that.oMonthSele.selectedIndex=0;
				that.oYearSele.selectedIndex++;
			}
			newDateRender();
		};
		this.oMonthPrev.onclick=function(){
			if(that.oMonthSele.selectedIndex>0){
				that.oMonthSele.selectedIndex--;
			}else if(that.oYearSele.selectedIndex>0){
				that.oMonthSele.selectedIndex=11;
				that.oYearSele.selectedIndex--;
			};
			newDateRender();
		};
		this.oTb.onclick=function(ev){
			var e=ev||event;
			var target=e.target||e.srcElement;
			if(target.index>=that.dayAtFirst&&(target.index<that.dayAtFirst+that.monthLength[that.monthAt])){
				if(that.mode==1||that.mode==3){
					that.dateAt=target.index-that.dayAtFirst+1;
				};
				if(that.mode==2){
					var timeRange=new Date(that.yearAt,that.monthAt,target.index-that.dayAtFirst+1);
					if(that.oDateRange.length<2){
						that.oDateRange.push(timeRange)
					}else{
						that.oDateRange=[];
						that.oDateRange.push(timeRange)
					}
				}
				newDateRender();
			};
		};
		this.oDele.onclick=function(){
			that.oYearFa.style.display=(that.oYearFa.style.display=="none")?"block":"none";
			newDateRender();
		}
		function newDateRender(){
			var newYear=parseInt(that.oYearSele.options[that.oYearSele.selectedIndex].value);
			var newMonth=parseInt(that.oMonthSele.options[that.oMonthSele.selectedIndex].value);
			if(that.mode!=2){
				var newTime=newYear+","+newMonth+","+Math.min(that.dateAt,that.monthLength[newMonth-1]);
			};
			if(that.mode==2){
				var newTime=newYear+","+newMonth+","+1;
			};
			that.dateRender(newTime);
		};
	},
	dateRender:function(time){//根据时间渲染日期选中的主函数
		if(time==="now"){
			this.timeAt=new Date();
		}else{
			this.timeAt=new Date(time);
		}
		this.yearAt=this.timeAt.getFullYear();
		this.monthAt=this.timeAt.getMonth();
		this.dayAt=this.timeAt.getDay();
		this.dateAt=this.timeAt.getDate();
		this.oYear.innerHTML=this.yearAt+"年";
		this.oMonth.innerHTML=this.monthAt+1+"月";
		for (var i = 0; i < this.oYearSele.options.length; i++) {
			if(this.oYearSele.options[i].value==this.yearAt+"年"){
				this.oYearSele.options[i].selected=true;
			}
		};
		for (var i = 0; i < this.oMonthSele.options.length; i++) {
			if(this.oMonthSele.options[i].value==this.monthAt+1+"月"){
				this.oMonthSele.options[i].selected=true;
			}
		};
		if(this.mode==4){
			this.callBack&&this.callBack(this.yearAt,this.monthAt+1);
			return;
		}
		this.monthLength[1]=this.yearAt%4?28:29;
		this.timeAt.setDate(1);
		this.dayAtFirst=this.timeAt.getDay();
		for (var i = 0; i < this.oDate.length; i++) {
			this.oDate[i].index=i;
			this.oDate[i].style.background="#f5f5f5";
			this.oDate[i].style.color="#000";
			if(i<this.dayAtFirst){
				this.oDate[i].innerHTML=this.monthLength[this.monthAt-1>=0?this.monthAt-1:11]-this.dayAtFirst+i+1;
				this.oDate[i].style.color="gray";
				this.oDate[i].style.backgroundColor="#fff";
			}else if(i<this.dayAtFirst+this.monthLength[this.monthAt]){
				this.oDate[i].innerHTML=i+1-this.dayAtFirst;
				if(this.mode==1||this.mode==3){
					this.oDate[this.dateAt+this.dayAtFirst-1].style.background="#449c45";
					if(this.oYearFa.style.display!=="none"){
						this.callBack&&this.callBack(this.yearAt,this.monthAt+1,this.dateAt,this.week[this.dayAt])
					}else{
						this.callBack2&&this.callBack2(this.monthAt+1,this.dateAt);
					}
				};
				if(this.mode==2){
					var timePerDate=new Date(this.yearAt,this.monthAt,i-this.dayAtFirst+1)
					if(this.oDateRange.length==1&&timePerDate.getTime()==this.oDateRange[0].getTime()){
						this.oDate[i].style.background="#449c45";
						this.callBack&&this.callBack(this.oDateRange[0].getFullYear(),this.oDateRange[0].getMonth()+1,this.oDateRange[0].getDate(),this.week[this.oDateRange[0].getDay()])
					};
					if(this.oDateRange.length==2&&timePerDate.getTime()>=Math.min(this.oDateRange[0].getTime(),this.oDateRange[1].getTime())&&timePerDate<=Math.max(this.oDateRange[0].getTime(),this.oDateRange[1].getTime())){
						this.oDate[i].style.background="#449c45";
						this.oDateRange.sort(function(a,b){
							return a.getTime()-b.getTime()
						})
						this.callBack2&&this.callBack2(this.oDateRange[0].getFullYear(),this.oDateRange[0].getMonth()+1,this.oDateRange[0].getDate(),this.week[this.oDateRange[0].getDay()],this.oDateRange[1].getFullYear(),this.oDateRange[1].getMonth()+1,this.oDateRange[1].getDate(),this.week[this.oDateRange[1].getDay()])
					};
				}
			}else{
				this.oDate[i].innerHTML=i+1-this.dayAtFirst-this.monthLength[this.monthAt];
				this.oDate[i].style.color="gray";
				this.oDate[i].style.backgroundColor="#fff";
			};
		};
	}
}
function $(selector, content) { //封装获取元素的工具函数$
	var firstChar = selector.charAt(0);
	var obj = content || document;
	if (firstChar == "#") {
		return document.getElementById(selector.slice(1));
	}else if (firstChar == ".") {
		var allElement=obj.getElementsByTagName("*");//获取所有元素
		var arr=[]//定义返回数组
		for(var i=0; i<allElement.length;i++){//循环所有元素
			var className=allElement[i].className;
			arrClass=className.split(" ");
			for(var j=0; j<arrClass.length;j++){
				if(arrClass[j]==selector.slice(1)){
					arr.push(allElement[i]);
					break;
				}
			}
		}
		return arr;
	} else {
		return obj.getElementsByTagName(selector);
	};
};