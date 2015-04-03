/**
 * flyandi:php library for Meteor
 * @version: v1.0.0
 * @author: Andy Schwarz
 *
 * Created by Andy Schwarz. Please report any bug at http://github.com/flyandi/meteor-php
 *
 * Copyright (c) 2015 Andy Schwarz http://github.com/flyandi
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

 /**
  * ::php
  */

PHP = {

	_version: '1.0.0',

	_config: Meteor.settings && Meteor.settings.php ? Meter.settings.php : {},

	/** 
	 * ::helpers
	 */

	isServer: function() {
		return Meteor.isServer;
	},

	isClient: function() {
		return Meteor.isClient;
	},

	get: function(name) {
		return Meteor.settings.php[name] || false;
	},

	/**
	 * ::render
	 */

	render: function() {

		var code = arguments[0],
			params = Array.prototype.slice.call(arguments).slice(1);

		code = code.replace(/{(\d+)}/g, function(match, index) {

			var result = typeof(params[index]) != "function" && typeof(index) != "undefined" ? params[index] : match;

			return typeof(result) == "number" ? result : '"' + result + '"';
		});

		console.log(code);

		PHP.interact(
			code, 
			"-r", 
			typeof(params[params.length -1]) == "function" ? params[params.length -1] : null
		);
	
	},


	/**
	 * ::interact
	 */

	interact: function(input, params, callback) {

		if(Meteor.isServer) {
			this._interact(input, params, callback);
		}
	},


};

/**
 * ::(client)
 */

if(Meteor.isClient) {


	Template.registerHelper("PHP", {

		render: PHP.render

	});
};


/**
 * ::(server)
 */

if(Meteor.isServer) {

	PHP._process = Npm.require('child_process');

	PHP._interact = function(input, params, callback) {

		var cmd = this._process.spawn("php", [params, input]),
			results = false,
			errors = false;

		cmd.stdout.on('data', function(output){
			results = output;
		});

		cmd.stderr.on('data', function(err){
			errors = err;
		});

		cmd.on('close', function() {
			if(typeof(callback) == "function") {
				callback(results.toString(), errors.toString());
			}
		});
	};
		

}

