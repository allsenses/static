// $(window).on("load",function(){
// 	document.querySelectorAll(".owl-carousel").forEach(function(e){
// 		if($(e).attr("data-loop")){
// 			$(e).owlCarousel({
// 				loop:eval($(e).attr("data-loop")),
// 				autoplay:eval($(e).attr("data-autoplay")),
// 				animateOut:$(e).attr("data-animateout"),
// 				margin:Number($(e).attr("data-margin")),
// 				nav:eval($(e).attr("data-nav")),
// 				dots:eval($(e).attr("data-dots")),
// 				items:Number($(e).attr("data-items")),
// 				center:eval($(e).attr("data-center")),
// 				autoplaySpeed:Number($(e).attr("data-autoplayspeed")),
// 			});
// 		}
// 	});
// })

import { Back } from "./modules/goback.js";
import { lang } from "./modules/lang.js";
import { Tag } from "./modules/tag.js";
import { Laptop, Mobile, Tablet } from "./modules/preview.js";
import { view } from "./modules/view.js";



const engine={
	directory:"",
	plugin:{},
	settings:{
		loop:true,
		autoplay:true,
		animateOut:"fadeOut",
		margin:0,
		nav:false,
		dots:false,
		items:1,
		center:true,
		autoplayTimeout:2000
	},
	target:null,
	element:null,
	iframe:null,
	slide:0,
	data:[],
	init:function(container,tools){
		var editor=new Tag("div");
		editor.className="allsenses-slider";
		editor.innerHTML='<div class="panel active"><div class="options"></div><div class="tools"></div><div class="bar"></div><a class="panel-switch active"><i class="fal fa-angle-right"></i></a></div><div class="content active"></div><div class="popup"><form></form></div>';
		$(container).append(editor);
		var iframeElem=new Tag("iframe");
		iframeElem.width="100%";
		iframeElem.height="100%";
		$(".allsenses-slider .content").append(iframeElem);
		
		engine.iframe=$(".allsenses-slider .content iframe")[0].contentWindow;
		
		let iframe=$(".allsenses-slider .content iframe");
		iframe.on("load",function(){
			engine.add.iframe.style("js/owl/owl.carousel.min.css");
			engine.add.iframe.style("js/owl/owl.theme.default.min.css");
			engine.add.iframe.style("css/app.css");
			engine.add.iframe.style("css/fontawesome/css/all.min.css");
			engine.add.iframe.style("css/slider.css");
			engine.add.iframe.style("/templates/default/css/style.css",true);
			engine.add.iframe.script("js/jquery.js",function(){
				engine.add.iframe.script("js/owl/owl.carousel.min.js");
				engine.iframe.$("body").on("click",function(event){
					engine.iframe.$("[data-active]").attr("data-active","false");
					engine.remove.tab("properties").content();
					engine.target=null;
					engine.element=null;
				})
			});
		});
		engine.iframe.location.reload();
		iframe[0].src="";
		
		$(".allsenses-slider .panel-switch").on("click",function(){
			$(this).toggleClass("active");
			$(".allsenses-slider .panel").toggleClass("active");
			$(".allsenses-slider .content").toggleClass("active");
		});
		
		engine.add.panel.option("fal fa-puzzle-piece","tools",true);
		engine.add.panel.option("fal fa-presentation","slides",false,view.slides);
		engine.add.panel.option("fal fa-cog","settings",false,view.settings);
		engine.add.panel.option("fal fa-sliders-h","properties",false);

		engine.add.bar("fal fa-arrow-left",Back);
		engine.add.bar("fal fa-laptop",Laptop);
		engine.add.bar("fal fa-tablet",Tablet);
		engine.add.bar("fal fa-mobile",Mobile);
		engine.add.bar("fas fa-play green",engine.preview);
		
		var notification=new Tag("div");
		notification.className="notification";
		editor.appendChild(notification);

		var load=new Tag("div");
		load.className="load active";
		load.innerHTML='<div class="progress"></div><img class="logo" src="'+engine.directory+'logo.svg">';
		editor.appendChild(load);

		$(window).on("engine-clear",function(){
			$(".fa-pause.green").removeClass("fa-pause").addClass("fa-play");
		})

		engine.load.tools(tools,function(loaded){
			var progress=loaded/tools.length*100;
			$(".load .progress").attr("style","width:"+progress+"%");
			if(loaded==tools.length){
				setTimeout(function(){
					let event=new Event("engine-loaded");
					window.dispatchEvent(event);
					$(".load").removeClass("active");
				},100)
			}
		});

		$(window).on("keydown",function(event){
			if(event.key=="Escape"){
				engine.hide.popup();
			}
		});
	},

	load:{
		tools:function(tools,progress,loaded){
			let modules=Object.assign([],tools);
			if(modules.length!=0){
				progress=progress || function(){};
				loaded=loaded || 0;
				let e=modules[0];
				let script=new Tag("script");
				script.type="module";
				script.src=engine.directory+"js/tools/"+e+"/"+e+".js";
				$(script).on("load",function(){
					loaded++;
					progress(loaded);
					modules.splice(0,1);
					engine.load.tools(modules,progress,loaded);
				});
				document.body.appendChild(script);
			}
		}
	},
	
	
	clear:function(){
		if(engine.data[engine.slide]){
			var slide=engine.data[engine.slide];
			engine.iframe.document.body.innerHTML="";
			var container=new Tag("div");
			container.className="main-slider";
			var div=new Tag("div");
			div.className="item";
			container.appendChild(div);
			$(div).attr("style","background-image:url("+slide.background+")");
			engine.render(engine.data[engine.slide].content,div);
			engine.iframe.document.body.appendChild(container);
	
			var event=new Event("engine-clear");
			window.dispatchEvent(event);
		}else{
			engine.iframe.document.body.innerHTML="";
		}
	},

	edit:function(target,element){
		engine.remove.tab("properties").content(true);
		engine.target=target;
		engine.element=element;
		var event=new Event("engine-edit");
		window.dispatchEvent(event);
	},
	
	render:function(data,container){
		data=data || engine.data[engine.slide].content;
		let id=0;
		data.forEach(function(e){
			e.id=id++;
			var obj=new Tag(e.type);
			obj.className=e.class.join(" ");
			obj.innerHTML=e.text;
			obj.src=e.src;
			obj.contentEditable=e.editable || false;
			if(e.editable){
				$(obj).on("input",function(){
					e.text=this.innerText;
				});
			}
			if(e.canFocus){
				$(obj).on("click",function(event){
					event.stopPropagation();
					engine.edit(e,obj);
				});
				$(obj).on("mouseover",function(event){
					event.stopPropagation();
					engine.iframe.$("[data-hover]").attr("data-hover","false");
					$(this).attr("data-hover","true");
				});
				$(obj).on("mouseout",function(event){
					$(this).attr("data-hover","false");
				});
				$(obj).on("click",function(){
					engine.iframe.$("[data-active]").attr("data-active","false");
					$(this).attr("data-active","true");
				});
			}
			engine.render(e.content,obj);
			
			$(container).append(obj);
		});
	},

	preview:function(){
		if($(this).find("i").hasClass("fa-play")){
			$(this).find("i").removeClass("fa-play");
			$(this).find("i").addClass("fa-pause");
			engine.iframe.document.body.innerHTML=engine.get.HTML();
			engine.iframe.$(".owl-carousel").owlCarousel({
				loop:engine.settings.loop,
				autoplay:engine.settings.autoplay,
				animateOut:engine.settings.animateOut,
				margin:engine.settings.margin,
				nav:engine.settings.nav,
				dots:engine.settings.dots,
				items:engine.settings.items,
				center:engine.settings.center,
				autoplayTimeout:engine.settings.autoplayTimeout
			});
		}else{
			$(this).find("i").removeClass("fa-pause");
			$(this).find("i").addClass("fa-play");
			engine.clear();
			view.slides();
		}
	},


	get:{
		JSON:function(){
			return engine.data;
		},
		HTML:function(data,container){
			data=data || engine.data;
			if(data==engine.data){
				container=new Tag("div");
				container.className="main-slider owl-carousel owl-theme";
			}
			data.forEach(function(e){
				if(e.type=="slide"){
					var obj=new Tag("div");
					obj.className="item";
					$(obj).attr("style","background-image:url("+e.background+")");
				}else{
					var obj=new Tag(e.type);
					obj.className=e.class.join(" ");
					obj.innerHTML=e.text;
					obj.src=e.src;
				}
				
				engine.get.HTML(e.content,obj);
				container.appendChild(obj);
			});
			if(data==engine.data){
				let script='<script>$(window).on("load",function(){$(".owl-carousel").owlCarousel({loop:'+engine.settings.loop+',autoplay:'+engine.settings.autoplay+',animateOut:"'+engine.settings.animateOut+'",margin:'+engine.settings.margin+',nav:'+engine.settings.nav+',dots:'+engine.settings.dots+',items:'+engine.settings.items+',center:'+engine.settings.center+',autoplayTimeout:'+engine.settings.autoplayTimeout+'});});</script>';
				return container.outerHTML+script;
			}
		}
	},

	hide:{
		popup:function(){
			$(".popup").removeClass("active");
			$(".panel").attr("style","");
			$(".content").attr("style","");
		}
	},
	
	remove:{
		tab:function(tabName){
			var self={};
			self.target=$('.allsenses-slider .panel [data-tab="'+tabName+'"]');
			
			self.content=function(active){
				self.target.html("");
				if(active){
					$('.allsenses-slider .panel [data-tab]').removeClass("active");
					self.target.addClass("active")
				}
			}
			
			return self;
		}
	},
	
	add:{
		style:function(sources){
			let style=new Tag("style");
			for(let i=0;i<sources.length;i++){
				style.innerHTML+='@import url("'+engine.directory+'js/tools/'+sources[i]+'.css");\n';
			}
			document.head.appendChild(style);
		},
		iframe:{
			script:function(src,callback){
				var script=new Tag("script");
				script.src=engine.directory+src;
				engine.iframe.document.head.appendChild(script);
				$(script).on("load",callback);
			},
			style:function(src,nodir){
				nodir=nodir || false;
				var link=new Tag("link");
				link.rel="stylesheet";
				if(nodir){
					link.href=src;
				}else{
					link.href=engine.directory+src;
				}
				engine.iframe.document.head.appendChild(link);
			}
		},
		panel:{
			option:function(icon,name,active,click){
				icon=icon || "fal fa-cogs";
				name=name || "Name";
				active=active || false;
				var a=new Tag("a");
				a.innerHTML='<i class="'+icon+'"></i>';
				var div=new Tag("div");
				if(active) div.className="active";
				div.setAttribute("data-tab",name);
				$(a).on("click",function(){
					$(".allsenses-slider .panel [data-tab]").removeClass("active");
					$(div).addClass("active");
				});
				$(a).on("click",click);
				$(".allsenses-slider .panel .options").append(a);
				$(".allsenses-slider .panel").append(div);
				return div;
			}
		},

		popup:function(title){
			let self={};
			$(".popup").addClass("active");
			$(".popup form").html('<div class="title">'+title+'</div>');
			$(".panel").attr("style","-webkit-filter:blur(4px)");
			$(".content").attr("style","-webkit-filter:blur(4px)");
			let target=new Tag("div");
			target.className="container";
			$(".popup form").append(target);
			self.tag=function(obj){
				let tag=engine.model.tag(obj);
				target.append(tag);
				return tag;
			}

			return self;
		},
		
		tab:function(tabName){
			var self={};
			self.target=$('.allsenses-slider .panel [data-tab="'+tabName+'"]');
			self.tool=function(icon,name,className){
				var a=new Tag("a");
				a.className="tool";
				a.innerHTML='<i class="'+icon+'"></i>'+name;
				$(a).on("click",function(){
					engine.add.content(new className());
				});
				self.target.append(a);
				return a;
			}
			
			self.slide=function(title,click,removeCallback){
				var div=new Tag("div");
				div.className="slide";
				div.innerHTML=title;
				var remove=new Tag("a");
				remove.className="remove";
				remove.innerHTML='<i class="fal fa-trash-alt"></i>';
				$(remove).on("click",removeCallback);
				div.appendChild(remove);
				$(div).on("click",click);
				self.target.append(div);
			},

			self.input=function(title,type,value,change){
				let tag=engine.model.input(title,type,value,change);
				self.target.append(tag.label);
				return tag.input;
			}

			self.checkbox=function(title,change){
				let tag=engine.model.checkbox(title,change);
				self.target.append(tag.label);
				return tag.input;
			}


			self.select=function(title,change){
				let tag=engine.model.select(title,change);
				self.target.append(tag.label);
				return tag.select;

			}

			self.button=function(title,click){
				let tag=engine.model.button(title,click);
				self.target.append(tag.div);
				return tag.button;
			}

			self.tag=function(obj){
				let tag=engine.model.tag(obj);
				self.target.append(tag);
				return tag;
			}
			
			return self;
		},

		bar:function(icon,click){
			icon=icon || "fal fa-cog";
			click=click || null;
			var a=new Tag("a");
			a.innerHTML='<i class="'+icon+'"></i>';
			$(a).on("click",click);
			$(".allsenses-slider .panel .bar").append(a);
		},
		
		content:function(instance){
			if(!engine.data[engine.slide]) return false;
			engine.data[engine.slide].content=[];
			engine.data[engine.slide].content.push(instance);
			engine.clear();
		},
	},
	notification:function(icon,text,strong,stop){
		icon=icon || "";
		text=lang.translate(text) || "";
		strong=lang.translate(strong) || "";
		stop=stop || false;
		text=text || "";

		$(".allsenses-slider .notification").html("");
		var div=new Tag("div");
		$(div).html('<i class="'+icon+'"></i><span>'+text+' <strong>'+strong+'</strong></span>');
		$(".allsenses-slider .notification")[0].appendChild(div);
		$(".allsenses-slider .notification").addClass("active");
		clearTimeout(this.timeout);
		this.timeout=setTimeout(function(){
			$(".allsenses-slider .notification").removeClass("active");
		},5000);
		if(stop){clearTimeout(this.timeout)}
	},

	model:{
		tool:class{
			constructor(){
				this.module="model";
				this.type="h1";
				this.lockClass=[];
				this.class=[];
				this.text="";
				this.src="";
				this.placeholder="Sample text";
				this.content=[];
				this.editable=true;
				this.container=false;
				this.textOptions=false;
				this.spellcheck=null;
				this.alt="";
				this.canDrag=false;
				this.canRemove=true;
				this.canFocus=true;
				this.style="";
				this.href="";
				this.data={};
				this.attr={};
			}
		},

		tag:function(obj){
			obj=obj || {};
			obj.tag=obj.tag || "input";
			obj.type=obj.type || "";
			obj.value=obj.value || null;
			obj.html=lang.translate(obj.html) || "";
			obj.placeholder=obj.placeholder || "";
			obj.src=obj.src || "";
			obj.class=obj.class || "";
			obj.data=obj.data || "";
			obj.disabled=obj.disabled || false;
			if(obj.tag=="checkbox"){
				var tag=new Tag("label");
				tag.innerHTML=obj.html;
				var input=new Tag("input");
				input.type="checkbox";
				input.checked=obj.checked || false;
				tag.appendChild(input);
				var i=new Tag("i");
				tag.appendChild(i);
				$(tag).attr("data-obj",obj.data);
				self.target.append(tag);
				return tag;
			}else{
				var tag=new Tag(obj.tag);
				if(obj.tag=="select"){
					tag.addOption=function(name,value){
						name=lang.translate(name);
						this.innerHTML+='<option value="'+value+'">'+name+'</option>';
					}
				}
				tag.disabled=obj.disabled;
				tag.type=obj.type;
				tag.value=obj.value;
				tag.innerHTML=obj.html;
				tag.placeholder=obj.placeholder;
				tag.className=obj.class;
				tag.src=obj.src;
				$(tag).attr("data-obj",obj.data);
				return tag;
			}
		},

		select:function(title,change){
			change=change || null;
			var select=new Tag("select");
			select.addOption=function(name,value){
				name=lang.translate(name);
				this.innerHTML+='<option value="'+value+'">'+name+'</option>';
			}
			$(select).on("change",change);
			var label=new Tag("label");
			label.innerHTML=lang.translate(title);
			label.appendChild(select);

			return {label,select};
		},

		input:function(title,type,value,change){
			var input=new Tag("input");
			input.type=type;
			input.value=value;
			$(input).on("change",change);

			var label=new Tag("label");
			label.innerHTML=lang.translate(title);
			label.appendChild(input);

			return {label,input};
		},

		checkbox:function(title,change){
			change=change || null;
			let label=new Tag("label","checkbox");
			label.innerHTML=lang.translate(title);
			let input=new Tag("input");
			input.type="checkbox";
			let span=new Tag("span");

			$(input).on("change",change);

			label.append(input);
			label.append(span);

			return {label,input};
		},

		button:function(title,click){
			var div=new Tag("div");
			div.className="text-center";
			var button=new Tag("a");
			button.className="button";
			button.innerHTML=lang.translate(title);
			$(button).on("click",click);
			div.appendChild(button);

			return {div,button};
		}
	}
}

Array.prototype.remove=function(value){
	if(this.includes(value)){
		return this.splice(this.indexOf(value),1);
	}
	return false;
}

String.prototype.toBoolean=function(){
	if(this=="true" || this==true || this=="1" || this==1) return true;
	return false;
}

export {engine};



// data-loop="true" 
// data-center="true" 
// data-autoplay="true" 
// data-items="1" 
// data-nav="false" 
// data-dots="false" 
// data-margin="0"