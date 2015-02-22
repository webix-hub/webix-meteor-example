if (Meteor.isClient){
	Template.Window.rendered = function(){

		this.ui = webix.ui({
			view:"window",
			id:"my_win",
			position:"center",
			head:"Some edit form",
			body:{
				view:"form", 
				rows:[
					{ view:"text", id:"focus_input", label:"First Name"},
					{ view:"text", label:"Last Name"},
					{ view:"button", value:"Save results", click:function(){
						this.getTopParentView().hide();
					}}
				]
			}
		});

	};

		

	Template.Window.destroyed = function(){
		if (this.ui) this.ui.destructor();
	};

	Template.WindowHost.events({
		'click .win_button':function(){
			$$("my_win").show();
			$$("focus_input").focus();
		}
	});

}