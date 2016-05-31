<?php

use App\Category;
use App\Note;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\WithoutMiddleware;

class ApiNoteTest extends TestCase
{
	use DatabaseTransactions;

    protected $note = 'This is a note';

    public function test_list_notes()
    {
    	$category = factory(Category::class)->create();
    	$notes = factory(Note::class)->times(2)->create([
    		'category_id' => "$category->id"
    		]);

        $this->get('api/v1/notes')
        ->assertResponseOk() // URL procesada con exito (200)
        ->seeJsonEquals($notes->toArray());
    }

    public function test_can_create_a_note()
    {
        $category = factory(Category::class)->create();
        $this->post('api/v1/notes',[
            'note' => $this->$note,
            'category_id' => "$category->id",
            ]);

        $this->seeInDatabase('notes',[
            'note' => $this->note,
            'category_id' => "$category->id",
            ]);

        $this->seeJsonEquals([
            'success' => true,
            'note_id' => Note::first(),
            ]);
    }
} 
