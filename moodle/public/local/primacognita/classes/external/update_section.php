<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_section extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'sectionid' => new external_value(PARAM_INT,  'ID de la sección'),
            'name'      => new external_value(PARAM_TEXT, 'Nuevo nombre', VALUE_DEFAULT, ''),
            'summary'   => new external_value(PARAM_RAW,  'Nuevo resumen HTML', VALUE_DEFAULT, ''),
            'visible'   => new external_value(PARAM_INT,  '1 visible, 0 oculta', VALUE_DEFAULT, 1),
        ]);
    }

    public static function execute(int $sectionid, string $name = '', string $summary = '', int $visible = 1): array {
        global $DB, $CFG;
        require_once($CFG->dirroot . '/course/lib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'sectionid' => $sectionid,
            'name'      => $name,
            'summary'   => $summary,
            'visible'   => $visible,
        ]);

        $section = $DB->get_record('course_sections', ['id' => $params['sectionid']], '*', MUST_EXIST);
        $context = \context_course::instance($section->course);
        self::validate_context($context);
        require_capability('moodle/course:update', $context);

        $course = get_course($section->course);
        course_update_section($course, $section, [
            'name'          => $params['name'],
            'summary'       => $params['summary'],
            'summaryformat' => FORMAT_HTML,
            'visible'       => (bool) $params['visible'],
        ]);

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Operación exitosa'),
        ]);
    }
}
