<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class delete_section extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid'  => new external_value(PARAM_INT, 'ID del curso'),
            'sectionid' => new external_value(PARAM_INT, 'ID de la sección'),
        ]);
    }

    public static function execute(int $courseid, int $sectionid): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/course/lib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid'  => $courseid,
            'sectionid' => $sectionid,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:update', $context);

        $course = get_course($params['courseid']);

        $sectionrecord = $DB->get_record(
            'course_sections',
            ['id' => $params['sectionid'], 'course' => $params['courseid']],
            '*',
            MUST_EXIST
        );

        $ok = course_delete_section($course, $sectionrecord, true);

        if (!$ok) {
            throw new \moodle_exception('cannotdeletesection', 'error');
        }

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Operación exitosa'),
        ]);
    }
}
