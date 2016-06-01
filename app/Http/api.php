<?php 

Route::resource('notes', 'NoteController', [
	'parameters' => [
		'notes' => 'note' #El parametro notes se va  representar por la variable note
		]
	]);

