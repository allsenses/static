import { engine } from "../init.js";

class Heading extends engine.model.tool{
	constructor(){
		super();
		this.module="heading";
		this.type="h1";
		this.text="Sample text";
	}
}

class Text extends engine.model.tool{
	constructor(){
		super();
		this.module="text";
		this.type="p";
		this.text="Sample text";
	}
}

class Container extends engine.model.tool{
	constructor(content){
		super();
		this.module="container";
		this.type="div";
		this.class=["grid-container"];
		this.editable=false;
		this.content=content || [];
	}
}

class Grid extends engine.model.tool{
	constructor(content){
		super();
		this.module="grid";
		this.type="div";
		this.class=["grid-x"];
		this.editable=false;
		this.content=content || [];
	}
}

class Cell extends engine.model.tool{
	constructor(content){
		super();
		this.module="cell";
		this.type="div";
		this.class=["cell","small-12","medium-6","large-6"];
		this.editable=false;
		this.content=content || [];
	}
}

class Image extends engine.model.tool{
	constructor(){
		super();
		this.module="image";
		this.type="img";
		this.src="/thumbs/noimage.jpg";
		this.editable=false;
	}
}

export {Heading,Text,Container,Grid,Cell,Image};