suite('Global Tests', function() {
	test('should have valid header', function() {
		assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
	});
});