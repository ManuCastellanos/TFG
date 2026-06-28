<?php
defined('MOODLE_INTERNAL') || die();

function xmldb_local_primacognita_upgrade($oldversion) {
    global $DB;

    if ($oldversion < 2025010110) {
        if (!$DB->record_exists('user_info_category', ['name' => 'PrimaCognita'])) {
            $category            = new stdClass();
            $category->name      = 'PrimaCognita';
            $category->sortorder = 999;
            $categoryid = $DB->insert_record('user_info_category', $category);
        } else {
            $categoryid = $DB->get_field('user_info_category', 'id', ['name' => 'PrimaCognita']);
        }

        $fields = [
            ['shortname' => 'pc_superpoder',     'name' => 'Mi superpoder',         'sortorder' => 1],
            ['shortname' => 'pc_cumpleanos',     'name' => 'Cumpleaños',            'sortorder' => 2],
            ['shortname' => 'pc_animal',         'name' => 'Animal favorito',       'sortorder' => 3],
            ['shortname' => 'pc_talento',        'name' => 'Lo que mejor se me da', 'sortorder' => 4],
            ['shortname' => 'pc_tutor1_nombre',  'name' => 'Tutor 1 - Nombre',      'sortorder' => 5],
            ['shortname' => 'pc_tutor1_email',   'name' => 'Tutor 1 - Email',       'sortorder' => 6],
            ['shortname' => 'pc_tutor1_telefono','name' => 'Tutor 1 - Teléfono',    'sortorder' => 7],
            ['shortname' => 'pc_tutor2_nombre',  'name' => 'Tutor 2 - Nombre',      'sortorder' => 8],
            ['shortname' => 'pc_tutor2_email',   'name' => 'Tutor 2 - Email',       'sortorder' => 9],
            ['shortname' => 'pc_tutor2_telefono','name' => 'Tutor 2 - Teléfono',    'sortorder' => 10],
        ];

        foreach ($fields as $f) {
            if ($DB->record_exists('user_info_field', ['shortname' => $f['shortname']])) {
                continue;
            }
            $field                    = new stdClass();
            $field->shortname         = $f['shortname'];
            $field->name              = $f['name'];
            $field->datatype          = 'text';
            $field->categoryid        = $categoryid;
            $field->sortorder         = $f['sortorder'];
            $field->required          = 0;
            $field->locked            = 0;
            $field->visible           = 0;
            $field->forceunique       = 0;
            $field->signup            = 0;
            $field->defaultdata       = '';
            $field->defaultdataformat = 0;
            $field->param1            = 255;
            $field->param2            = 0;
            $field->param3            = '';
            $field->param4            = '';
            $field->param5            = '';
            $DB->insert_record('user_info_field', $field);
        }

        upgrade_plugin_savepoint(true, 2025010110, 'local', 'primacognita');
    }

    return true;
}
