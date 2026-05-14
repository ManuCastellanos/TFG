<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class create_section extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'ID del curso'),
            'name'     => new external_value(PARAM_TEXT, 'Nombre de la sección', VALUE_DEFAULT, ''),
            'summary'  => new external_value(PARAM_RAW,  'Resumen HTML de la sección', VALUE_DEFAULT, ''),
        ]);
    }

    public static function execute(int $courseid, string $name = '', string $summary = ''): array {
        global $CFG;
        require_once($CFG->dirroot . '/course/lib.php');

        $params  = self::validate_parameters(self::execute_parameters(), [
            'courseid' => $courseid,
            'name'     => $name,
            'summary'  => $summary,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:update', $context);

        $course  = get_course($params['courseid']);
        $section = course_create_section($course);

        if ($params['name'] !== '' || $params['summary'] !== '') {
            course_update_section($course, $section, [
                'name'          => $params['name'],
                'summary'       => $params['summary'],
                'summaryformat' => FORMAT_HTML,
            ]);
            $section = get_fast_modinfo($course)->get_section_info($section->section);
        }

        return ['sectionid' => $section->id, 'sectionnum' => (int) $section->section];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'sectionid'  => new external_value(PARAM_INT, 'ID de la sección creada'),
            'sectionnum' => new external_value(PARAM_INT, 'Número de la sección'),
        ]);
    }
}
