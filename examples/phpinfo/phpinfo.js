

if(Meteor.isServer) {


	PHP.render("phpinfo();", function(output) {

		console.log(output);

	});

}