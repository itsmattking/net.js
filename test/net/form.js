var form = window.net.form;

asyncTest('Posts serialized data from a plain object', function() {
	form.post({
		url: apiUrl('/net/form'),
		data: {abc: 123},
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=123', 'Returns successfully');
		}),
		error: noError()
	});
});

asyncTest('PUT serialized data from a plain object', function() {
	form.put({
		url: apiUrl('/net/form'),
		data: {abc: 123},
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=123', 'Returns successfully');
		}),
		error: noError()
	});
});

asyncTest('Encodes data properly when POSTing form', function() {
	form.post({
		url: apiUrl('/net/form'),
		data: {abc: "This is a string with spaces"},
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=' + encodeURIComponent("This is a string with spaces"), 'Returns successfully');
		}),
		error: noError()
	});
});

asyncTest('Encodes data properly when PUTing form', function() {
	form.put({
		url: apiUrl('/net/form'),
		data: {abc: "This is a string with spaces"},
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=' + encodeURIComponent("This is a string with spaces"), 'Returns successfully');
		}),
		error: noError()
	});
});

asyncTest('Accepts a form element with data', function() {
	var formElement = document.createElement('form');
	var inputElement = document.createElement('input');
	inputElement.setAttribute('name', 'abc');
	inputElement.setAttribute('value', 'This is a string with spaces');
	formElement.appendChild(inputElement);
	form.post({
		url: apiUrl('/net/form/encoded'),
		data: formElement,
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=' + encodeURIComponent("This is a string with spaces"), 'Returns successfully');
		}),
		error: noError()
	});
});

asyncTest('Accepts a FormData object with data', function() {
	var formElement = document.createElement('form');
	var inputElement = document.createElement('input');
	inputElement.setAttribute('name', 'abc');
	inputElement.setAttribute('value', 'This is a string with spaces');
	formElement.appendChild(inputElement);
	form.post({
		url: apiUrl('/net/form/encoded'),
		data: new FormData(formElement),
		success: asyncHandler(function(data) {
			ok(data.responseText === 'abc=' + encodeURIComponent("This is a string with spaces"), 'Returns successfully');
		}),
		error: noError()
	});
});
