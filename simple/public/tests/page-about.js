suite('About Tests', function() {
	test('should have valid link', function() {
		assert($('a[href="/contact"]').length);
	});
});