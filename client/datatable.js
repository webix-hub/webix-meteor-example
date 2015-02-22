if (Meteor.isClient){
	Template.Datatable.rendered = function(){
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

		this.ui = webix.ui({
			rows:[toolbar, table]
		}, this.find("#table_area"));

	};


	Template.Datatable.destroyed = function(){
		if (this.ui) this.ui.destructor();
	};
}