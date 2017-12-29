$(function() {
	$('form').submit(function(ev) {
		ev.preventDefault();
		var form = $(this);
		$.ajax({
			url: form.attr('action'),
			type: 'POST',
			data: form.serialize(),
			success: function(obj) {
				var el = $('<li>');
				if($('#projects-list').length) {
					el
						.append($('<a>').attr('href', '/project/' + obj.id + '/tasks').text(obj.title + ' '))
						.append($('<a>').attr('href', '/project/' + obj.id).attr('class', 'delete').text('X'));
				} else {
					el
						.append($('<span>').text(obj.title + ' '))
						.append($('<a>').attr('href', '/task/' + obj.id).attr('class', 'delete').text('X'));
				}
				$('ul').append(el);
			}
		});
		form.find('input').val('')
	});
});
$('ul').delegate('a.delete', 'click', function(ev) {
	ev.preventDefault();
	var li = $(this).closest('li');
	$.ajax({
		url: $(this).attr('href'),
		type: 'DELETE',
		success: function() {
			li.remove();
		}
	});
});