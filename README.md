Net.js
======

Net.js is a minimalist network communications library for browsers.

Why?
----

To simplify fetching remote URLs via AJAX, as well as talking to JSON APIs, in one succinct interface, without dependencies on other libraries.

Usage
=====

net.js is easy to use! Just include it in your page.

    <script src="path/to/net.js"></script>
	
This makes the global 'net' object available to your scripts.

If you prefer using net.js with require.js, just add it as a dependency and away you go:

    define('mymodule', ['net'], function(net) {
	    // Your code...
	});
	
Callbacks and Promises
======================

Net.js supports two styles of requests: traditional callbacks and promises.

Example: Callback Style
-----------------------

    net.ajax.get({
	  url: '/my-endpoint',
	  success: function(req) {
        // successful response
	  },
	  error: function(req) {
        // error response
	  }
	});

Example: Promise Style
----------------------

The promises support in net.js is simplistic. Just chain your functions using .then(), passing a
success function and fail function.

    net.ajax.get({
	  url: '/my-endpoint'
    }).then(
	  function(req) {
        // successful response
      },
	  function(req) {
        // error response
      }
    );

Each set of functions are run in the order specified. By calling .chain() on a promise, each
successive function will get back the data return from the previous set.

    net.ajax.get({
	  url: '/my-endpoint'
    }).chain().then(
	  function(req) {
        // successful response
		// do something with the request, then
	    var myObject = { item: req.responseText };
		return myObject;
      },
	  function(req) {
        // error response
      }
    ).then(
	  function(myObject) {
		// got the return value from the previous function
      }
	);

Request Types
=============

Net.js has a few base types of requests you can make.

AJAX
----

A simple wrapper around XMLHttpRequest that exposes a few convenience methods (these are self explanatory):

    net.ajax.get
	net.ajax.post
	net.ajax.put
	net.ajax.delete

A more generic method for making your own requests is also available:

    net.ajax.request
	
Making a Request
----------------

There are a few basic options to get started:

* url - where to make a request
* success - what to do on success
* error - what to do on error

Here's an example:

    net.ajax.get({
      url: '/some/path',
	  success: function(req) {
        // req is the raw request instance from native AJAX calls.
	    // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest
	  },
	  error: function() {
        console.log('Error making request!');
	  }
	});
	

When making a raw request, you have to also add:

* method - GET, POST, PUT, etc.

Here's an example:

    net.ajax.request({
	  method: 'GET',
      url: '/some/path',
	  success: function(req) {
        // do something with the request, like
	    console.log(req.responseText);
	  }
	});


You can optionally set arbitrary headers on the request. This may come
in handy for setting custom headers, or setting up HTTP Auth headers.

	net.ajax.get({
	  headers: {
        'X-Custom-Header': 'custom-value'
	  }
	});


JSON
----

The JSON client is similar to AJAX, but does a little processing on the request
to serialize and deserialize JSON objects. Instead of passing back the request, it expects
the endpoint you are talking with to return a JSON object, and it will deserialize
it and pass it to your success function.


	net.json.get({
      url: '/my-data.json',
	  success: function(data) {
        console.log(data); // a deserialized JSON object
	  }
	});
	

When issuing POST or PUT, you simply supply a data object. The JSON client will serialize
it and issue the request to your endpoint as Content-Type: application/json, and the body
of the request will contain the serialized JSON.


	net.json.post({
  	  url: '/save-data',
      data: myData, // an object to be serialized
      success: function(data) {
        console.log(data); // JSON client expects JSON responses, and will return it to you.
      }
	})


Form
----

The form client is a convenience method to encode and serialize data as form POST or PUT requests.


    net.form.post({
  	  url: '/save-data',
      data: myData, // an object to be serialized as form data
      success: function(req) { // still returns the raw request object.
        console.log(req);
      }
    });
    
If `data` is a plain object, it will send the form POST/PUT as a urlencoded request. If `data` is a `form` element or a `FormData` object, it will send it as a multipart/form-data post (handy for file uploads).


Developing
==========

You'll need node installed to develop net.js. Just clone the repo and run `npm install` to get set up.

`grunt` is used to manage build and development tasks:

* `grunt` (with no arguments) starts up the test API server, testing/linting/compiling on file changes.
* `grunt build` does the test/lint/compile once and exits.

