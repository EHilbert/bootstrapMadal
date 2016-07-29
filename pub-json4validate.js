/*
  validateType校验类型：       
		email：邮箱校验,
		url: url地址,
		date: 日期,
		dateISO: 日期格式 (YYYY-MM-DD)",
		number: 数值,
		creditcard: 信用卡号码,
		digits:整数
		ip：IP地址 ,
		abc:字母数字或下划线,
		username:3-20位字母或数字开头，允许字母数字下划线 ,
		card:身份证号码(15-18位),
		qq:QQ号码,
		zipCode:邮政编码
	    realName:姓名只能为2-30个汉字, 
	    userName:登录名只能包括中文字、英文字母、数字和下划线  
		mobile:手机号码, 
		simplePhone:电话号码   
		phone:格式为:固话为区号(3-4位)号码(7-9位),手机为:13,15,17,18号段
		decimals:数字格式  非负数 小数点后保留两位   

 
    读取的json文件格式
 [ 
    {
	    "name":"href",//校验字段的name属性值（必选）
	    "nameCn":"链接",//字段中文名称（非必选）
	    "required":true,//是否需要校验，是：true，否：false（必选）
	    "isStar":false,//是否加*，是：true，否：false（非必选）
	    "validateType":"url",//校验类型（非必选）
	    "minValue":0,//最小长度（非必选）
	    "maxValue":100,//最大长度（非必选）
	    "tips":""//自定义提示消息（非必选）
	    "digits":""//小数个数
	    "ex":"-1",//逃逸值
    }
 ]
 
 使用方式：
 <script>
 
 	$().ready(function() {
 	
		 //加载验证配置
		 var validateJson=setValidate(webPath+'/js/system/user/validate.json');
		 $("#organInfoFrom").validate(validateJson);
		 
		 
		 //点击保存按时进行数据校验
		 $("#submitBtn").click(function() {
			//数据校验
			if(!$("#organInfoFrom").valid()){
		        return false;
		    }else{
		    	//验证成功进行下一步操作
		    }
	     });
     
	});
	
 <script>
*/
(function($){
	/** 默认校验信息 */
	$.messages={
			required : "必填信息",
			remote : "请修正该信息",
			email : "请输入正确格式的电子邮件",
			url : "请输入合法的网址",
			date : "请输入合法的日期",
			dateISO : "请输入合法的日期 (ISO).",
			number : "请输入合法的数字",
			digits : "只能输入整数",
			creditcard : "请输入合法的信用卡号",
			equalTo : "请再次输入相同的值",
			accept : "请输入拥有合法后缀名的字符串",
			maxlength : $.validator.format("请输入一个长度最多是 {0} 的字符串"),
			minlength : $.validator.format("请输入一个长度最少是 {0} 的字符串"),
			rangelength : $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
			range : $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
			max : $.validator.format("请输入一个最大为 {0} 的值"),
			min : $.validator.format("请输入一个最小为 {0} 的值"),
			ip : "请输入合法的IP地址",
			abc : "请输入字母数字或下划线",
			username : "3-20位字母或数字开头，允许字母数字下划线",
			noEqualTo : "请再次输入不同的值",
			gt : "请输入更大的值",
			lt : "请输入更小的值",
			isFloat : "只能包含数字、小数点等字符",
			decimals : "数字格式  非负数 小数点后保留两位",
			realName : "姓名只能为2-30个汉字",
			userName : "登录名只能包括中文字、英文字母、数字和下划线",
			mobile : "请正确填写您的手机号码",
			simplePhone : "请正确填写您的电话号码",
			phone : "格式为:固话为区号(3-4位)号码(7-9位),手机为:13,15,17,18号段",	
			zipCode : "请正确填写您的邮政编码",
			qq : "请正确填写您的QQ号码",
			card : "请输入正确的身份证号码(15-18位)"
	}
}(jQuery));
/** 校验设置 */
function setValidate(jsonUrl){
	var rules='';//校验规则
	var messages='';//校验消息
	$.ajax({
		url:jsonUrl,//json文件路径
		cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
		type: 'POST',//请求方式
		async:false,//设置同步
		dataType: 'json',//数据类型
		timeout: 300000,//请求相应退出时间
		error: function(json){
			alert('Error loading JSON document'+json);//读取错误消息
		},success: function(json){//读取成功后解析数据
			$.each(json,function(i,e){
				
				rules+= '\"'+e.name+'\":{\"required\":'+e.required+',';
				if(!!e.validateType){
					rules+='\"'+e.validateType+'\":true,';
				}
				if(!!e.minValue){
					rules+='\"minlength\":'+e.minValue+','
				}
				if(!!e.maxValue){
					rules+='\"maxlength\":'+e.maxValue+','
				}
				rules=rules.substring(0,rules.length-1);
				rules+='},'
				if(e.required&&!!e.tips&&!!e.validateType){
					messages += '\"'+e.name+'\":{\"required\":\"'+e.nameCn+'不能为空\",\"'+e.validateType+'\":\"'+e.nameCn+e.tips+'\"},';
				}else if(e.required&&!e.tips&&!!e.validateType){
					messages += '\"'+e.name+'\":{\"required\":\"'+e.nameCn+'不能为空\",\"'+e.validateType+'\":\"'+e.nameCn+$.messages[e.validateType]+'\"},';
				}else if(e.required&&!!e.tips){
					messages += '\"'+e.name+'\":{\"required\":\"'+e.nameCn+e.tips+'\"},';
				}else if(e.required){
					messages += '\"'+e.name+'\":{\"required\":\"'+e.nameCn+'不能为空\"},';
				}
			})
			rules=rules.substring(0,rules.length-1);
			messages=messages.substring(0,messages.length-1)
		}
	})
	var validate= '{"rules":{'+rules+'},"messages":{'+messages+'}}';//拼接校验数据
	var validateJson=$.parseJSON( validate );//字符串转化成json
	//var validateJson = eval('(' + rules + ')');
	//var validateJson=JSON.parse( rules );
	return validateJson;
}


