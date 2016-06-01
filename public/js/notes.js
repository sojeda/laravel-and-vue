function findById(items, id) {
    for (var i in items) {
        if (items[i].id == id) {
            return items[i];
        }
    }
    return null;
}
Vue.filter('category', function(id) {
    var category = findById(this.categories, id);
    return category != null ? category.name : '';
});
Vue.component('select-category', {
    template: "#select_category_tpl",
    props: ['categories', 'id']
});
Vue.component('note-row', {
    template: "#note_row_tpl",
    props: ['note', 'categories'],
    data: function() {
        return {
            editing: false,
            errors: []
        };
    },
    methods: {
        remove: function() {
            this.$parent.notes.$remove(this.note);
        },
        edit: function() {
            this.editing = true;
        },
        update: function() {
            this.errors = [];
            var vm = this;
           
            $.ajax({
                url: '/api/v1/notes/' + vm.note.id,
                type: 'PUT',
                dataType: 'json',
                data: vm.note,
            }).done(function(data) {
                console.log("success");
                vm.$parent.notes.$set(this.$parent.notes.indexOf(vm.note),data.note);
            }).fail(function(jqXHR) {
                console.log("error");
                vm.errors = jqXHR.responseJSON.errors;
            });

             this.editing = false;
        }
    }
});
var vm = new Vue({
    el: 'body',
    data: {
        new_note: {
            note: '',
            category_id: ''
        },
        errors: [],
        notes: [],
        categories: [{
            id: 1,
            name: 'Laravel'
        }, {
            id: 2,
            name: 'Vue.js'
        }, {
            id: 3,
            name: 'Publicidad'
        }]
    },
    ready: function() {
        $.getJSON('/api/v1/notes', [], function(notes) {
            vm.notes = notes;
        });
    },
    methods: {
        createNote: function() {
            this.errors = [];
            $.ajax({
                url: '/api/v1/notes',
                type: 'POST',
                dataType: 'json',
                data: this.new_note,
                success: function(data) {
                    if (data.success) {
                        vm.notes.push(data.note);
                    }
                },
                error: function(jqXHR) {
                    vm.errors = jqXHR.responseJSON.errors;
                }
            });
            this.new_note = {
                note: '',
                category_id: ''
            };
        }
    },
    filters: {}
});