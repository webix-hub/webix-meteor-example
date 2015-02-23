if (Meteor.isClient){
	Template.DataLoading.rendered = function(){
		
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
			autoheight:true
		};

		this.ui = webix.ui({
			rows:[toolbar, table]
		}, this.find("#table_area"));

		//create data tracker, will reload data after any changes
		this.autorun(function(){
			var books = Books.find().fetch();
			if (books){
				$$("dtable").clearAll();
				$$("dtable").parse(books);
			}
		});

	};

	Template.DataLoading.events({
		'click input':function(){
			Books.insert({ name:"New Book", author:"" });
		}
	});


	Template.DataLoading.destroyed = function(){
		if (this.ui) this.ui.destructor();
	};
}