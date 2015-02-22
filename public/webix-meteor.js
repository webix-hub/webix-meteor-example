/*
	MeteorJS data proxy for Webix
	Allows to use Meteor data collections in all places where normal http urls can be used
*/

webix.proxy.meteor = {
	$proxy:true,
	parseSource:function(){
		//decode string reference if necessary
		if (typeof this.source == "object"){
			if (this.source instanceof Meteor.Collection){
				this.collection = this.source;
				this.cursor = this.collection.find();
			} else if (this.source instanceof Meteor.Collection.Cursor){
				this.collection = this.source.collection;
				this.cursor = this.source;
			}
		} else {
			//[WARNING] there is no public method to convert collection name to the object
			this.cursor = Meteor.connection._mongo_livedata_collections[this.source];
			this.collection = this.cursor.collection; 
		}
	},
	/*
	some.load("meteor->ref");
	or
	some.load( webix.proxy("meteor", Books) )
	or
	some.load( webix.proxy("meteor", Books->find() ))
	or
	url:"meteor->ref"
	*/
	load:function(view, callback){
		this.parseSource();
		this.cursor.observe({
			//data in meteor collection added
			added: function(post) {
				//event can be triggered while initial data loading - ignoring
				if (view.waitData.state == "pending") return;

				//event triggered by data saving in the same component
				if (view.meteor_saving) return;

				post.id = post._id+"";
				delete post._id;

				//do not trigger data saving events
				webix.dp(view).ignore(function(){
					view.add(post);
				});
			},
			//data in meteor collection changed
			changed: function(post) {
				//event triggered by data saving in the same component
				if (view.meteor_saving) return;

				var id = post._id+"";
				delete post._id;

				//do not trigger data saving events
				webix.dp(view).ignore(function(){
					view.updateItem(id, post);
				});
			},
			//data in meteor collection removed
			removed: function(post) {
				//event triggered by data saving in the same component
				if (view.meteor_saving) return;

				//do not trigger data saving events
				webix.dp(view).ignore(function(){
					view.remove(post._id+"");
				});
			}
		});

		//initial data loading
		this.cursor.rewind();
		var data = this.cursor.fetch();
		var result = [];
		for (var i=0; i<data.length; i++){
			var record = data[i];
			record.id = record._id+"";
			delete record._id;
			result.push(record);
		}

		webix.ajax.$callback(view, callback, "", result, -1);
	},
	/*
	save:"meteor->ref"
	*/
	save:function(view, obj, dp, callback){
		this.parseSource();

		//flag to prevent triggering of onchange listeners on the same component
		view.meteor_saving = true;

		delete obj.data.id;
		if (obj.operation == "update"){
			//data changed
			this.collection.update(obj.id, obj.data);
			webix.delay(function(){
				callback.success("", { }, -1);
			});
		} else if (obj.operation == "insert"){
			//data added
			var id = this.collection.insert(obj.data);
			console.log(id);
			webix.delay(function(){
				callback.success("", { newid: id }, -1);
			});
		} else if (obj.operation == "delete"){
			//data removed
			this.collection.remove(obj.id);
			webix.delay(function(){
				callback.success("", {}, -1);
			});
		}

		view.meteor_saving = false;
	}
};



/*
	Helper for component.sync(reference)
*/

webix.attachEvent("onSyncUnknown", function(target, source){
	if (window.Meteor && source instanceof Meteor.Collection.Cursor){

		var proxy = webix.proxy("meteor", source);

		//due to some limitations in Webix 2.2 we can't use above proxy with DataStore directly
		//so will create intermediate data collection and use syn like
		//meteor -> data collection -> target view
		var data = new webix.DataCollection({
			url:proxy,
			save:proxy
		});

		target.sync(data);
	}
});


webix.protoUI({
	name:"reactive",
	$init:function(){
		this.$ready.push(this.render);
	},
	render:function(){
		this.$view.innerHTML="";
		if (this.config.data)
			UI.renderWithData(Template[this.config.template], this.config.data, this.$view);
		else
			UI.render(Template[this.config.template], this.$view);
	},
	setValue:function(data){
		this.config.data = data;
		this.render();
	}
}, webix.ui.view, webix.BaseBind);