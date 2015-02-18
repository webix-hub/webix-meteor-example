Books = new Mongo.Collection("books");

if (Meteor.isServer){
	if (!Books.find().count()){
		Books.insert({
			author:"Anthony Doerr",
			name:"All the Light We Cannot See"
		});

		Books.insert({
			author:"Paula Hawkins",
			name:"The girl on the train"
		});
	}
}