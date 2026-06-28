<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_quiz extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid'      => new external_value(PARAM_INT,  'ID del course module'),
            'name'      => new external_value(PARAM_TEXT, 'Nombre del quiz'),
            'intro'     => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
            'timeopen'  => new external_value(PARAM_INT,  'Fecha apertura Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timeclose' => new external_value(PARAM_INT,  'Fecha cierre Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timelimit' => new external_value(PARAM_INT,  'Límite en segundos (0 = sin límite)', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(
        int $cmid, string $name, string $intro = '',
        int $timeopen = 0, int $timeclose = 0, int $timelimit = 0,
    ): array {
        global $CFG;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid'      => $cmid,
            'name'      => $name,
            'intro'     => $intro,
            'timeopen'  => $timeopen,
            'timeclose' => $timeclose,
            'timelimit' => $timelimit,
        ]);

        $cm      = get_coursemodule_from_id('quiz', $params['cmid'], 0, false, MUST_EXIST);
        $context = \context_course::instance($cm->course);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($cm->course);

        $data = new \stdClass();
        $data->coursemodule  = $params['cmid'];
        $data->modulename    = 'quiz';
        $data->name          = $params['name'];
        $data->intro         = $params['intro'];
        $data->introformat   = FORMAT_HTML;
        $data->timeopen      = $params['timeopen'];
        $data->timeclose     = $params['timeclose'];
        $data->timelimit     = $params['timelimit'];
        $data->reviewattempt = 0x11110;

        update_moduleinfo($cm, $data, $course);
        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Operación exitosa'),
        ]);
    }
}
