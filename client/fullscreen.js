if (Meteor.isClient){
	Template.FullScreen.rendered = function(){
		var proxy = webix.proxy("meteor", Books);

		//datatable
		var table = {
			view:"datatable",
			id:"dtable", select:true, multiselect:true,
			editable:true, editaction:"dblclick",
			columns:[{
				id:"name", editor:"text", fillspace:1
			},{
				id:"author", editor:"text", fillspace:1
			}],
			autoheight:true,
			scrollX:false,
			url: 	proxy,
			save:   proxy
		};

		var toolbar = {
			view:"toolbar",
			elements:[
				{ view:"label", label:"Dbl-Click to edit any row"},
				{ view:"button", value:"Add", width:100, click:function(){
					var row = $$("dtable").add({ name:"", author:"" });
					$$("dtable").editCell(row, "name")
				}},
				{ view:"button", value:"Remove", width:100, click:function(){
					var id = $$("dtable").getSelectedId();
					if (id)
						$$("dtable").remove(id);
					else
						webix.message("Please select any row first");
				}}
			]
		};

		var templates = {
			cols:[
				{ header:"Webix Data Binding (select row in table)", body:{
					id:"t1", view:"reactive", template: "info" }
				},
				{ header:"Meteor Data Binding", body:{
					id:"t2", view:"reactive", template: "allinfo" }
				}
			]
		};


		this.ui = webix.ui({
			type:"wide", rows:[ toolbar, table, templates]
		});

		// show data in template when row selected in the datatable
		$$("t1").bind( $$("dtable") );

	};

		

	Template.FullScreen.destroyed = function(){
		if (this.ui) this.ui.destructor();
	};
}


//configure auto-updates for allinfo template
Template.allinfo.helpers({
	books:function(){
		return Books.find();
	}
});