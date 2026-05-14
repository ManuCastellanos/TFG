<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class create_quiz extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid'    => new external_value(PARAM_INT,  'ID del curso'),
            'sectionnum'  => new external_value(PARAM_INT,  'Número de sección', VALUE_DEFAULT, 0),
            'name'        => new external_value(PARAM_TEXT, 'Nombre del quiz'),
            'intro'       => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
            'timeopen'    => new external_value(PARAM_INT,  'Fecha apertura Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timeclose'   => new external_value(PARAM_INT,  'Fecha cierre Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timelimit'   => new external_value(PARAM_INT,  'Límite de tiempo en segundos (0 = sin límite)', VALUE_DEFAULT, 0),
            'maxattempts' => new external_value(PARAM_INT,  'Máximo intentos (-1 = ilimitado)', VALUE_DEFAULT, -1),
        ]);
    }

    public static function execute(
        int $courseid, int $sectionnum, string $name,
        string $intro = '', int $timeopen = 0, int $timeclose = 0,
        int $timelimit = 0, int $maxattempts = -1,
    ): array {
        global $CFG;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid'    => $courseid,
            'sectionnum'  => $sectionnum,
            'name'        => $name,
            'intro'       => $intro,
            'timeopen'    => $timeopen,
            'timeclose'   => $timeclose,
            'timelimit'   => $timelimit,
            'maxattempts' => $maxattempts,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($params['courseid']);

        $data = new \stdClass();
        $data->course       = $params['courseid'];
        $data->modulename   = 'quiz';
        $data->section      = $params['sectionnum'];
        $data->name         = $params['name'];
        $data->intro        = $params['intro'];
        $data->introformat  = FORMAT_HTML;
        $data->timeopen     = $params['timeopen'];
        $data->timeclose    = $params['timeclose'];
        $data->timelimit    = $params['timelimit'];
        $data->attempts     = $params['maxattempts'];
        $data->grademethod  = 1; // QUIZ_GRADEHIGHEST
        $data->visible      = 1;

        $mod = add_moduleinfo($data, $course);
        return ['cmid' => (int) $mod->coursemodule, 'quizid' => (int) $mod->instance];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'cmid'   => new external_value(PARAM_INT, 'ID del course module'),
            'quizid' => new external_value(PARAM_INT, 'ID del quiz'),
        ]);
    }
}
