if (Meteor.isClient){
	Template.Template.rendered = function(){
		var templates = {
			cols:[
				{ header:"Webix Data Binding (select row in table)", body:{
					id:"t1", view:"reactive", template: "info", data:{
						name:"Test", author:"Record"
					}}
				},
				{ header:"Meteor Data Binding", height:300, body:{
					id:"t2", view:"reactive", template: "allinfo" }
				}
			]
		};


		this.ui = webix.ui({
			type:"wide", rows:[ templates]
		}, this.find("#template_area"));
		
	};

		

	Template.Template.destroyed = function(){
		if (this.ui) this.ui.destructor();
	};
}


//configure auto-updates for allinfo template
Template.allinfo.helpers({
	books:function(){
		return Books.find();
	}
});