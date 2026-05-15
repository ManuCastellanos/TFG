<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class create_url extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid'    => new external_value(PARAM_INT,  'ID del curso'),
            'sectionnum'  => new external_value(PARAM_INT,  'Número de sección', VALUE_DEFAULT, 0),
            'name'        => new external_value(PARAM_TEXT, 'Nombre del enlace'),
            'externalurl' => new external_value(PARAM_URL,  'URL externa'),
            'intro'       => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
        ]);
    }

    public static function execute(
        int $courseid, int $sectionnum, string $name,
        string $externalurl, string $intro = '',
    ): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid'    => $courseid,
            'sectionnum'  => $sectionnum,
            'name'        => $name,
            'externalurl' => $externalurl,
            'intro'       => $intro,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($params['courseid']);

        $data = new \stdClass();
        $data->course       = $params['courseid'];
        $data->modulename   = 'url';
        $data->module = $DB->get_record('modules', ['name' => $data->modulename], '*', MUST_EXIST)->id;
        $data->section      = $params['sectionnum'];
        $data->name         = $params['name'];
        $data->externalurl  = $params['externalurl'];
        $data->intro        = $params['intro'];
        $data->introformat  = FORMAT_HTML;
        $data->display      = 0;
        $data->visible      = 1;

        $mod = add_moduleinfo($data, $course);
        return ['cmid' => (int) $mod->coursemodule];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'cmid' => new external_value(PARAM_INT, 'ID del course module'),
        ]);
    }
}
