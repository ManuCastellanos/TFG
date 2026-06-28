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
            'courseid'               => new external_value(PARAM_INT,  'ID del curso'),
            'sectionnum'             => new external_value(PARAM_INT,  'Número de sección', VALUE_DEFAULT, 0),
            'name'                   => new external_value(PARAM_TEXT, 'Nombre del quiz'),
            'intro'                  => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
            'timeopen'               => new external_value(PARAM_INT,  'Fecha apertura Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timeclose'              => new external_value(PARAM_INT,  'Fecha cierre Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'timelimit'              => new external_value(PARAM_INT,  'Límite de tiempo en segundos (0 = sin límite)', VALUE_DEFAULT, 0),
            'maxattempts'            => new external_value(PARAM_INT,  'Máximo intentos (0 = ilimitado)', VALUE_DEFAULT, 0),
            'shufflequestions'       => new external_value(PARAM_INT,  '1 = mezclar preguntas', VALUE_DEFAULT, 1),
            'shuffleanswers'         => new external_value(PARAM_INT,  '1 = mezclar respuestas', VALUE_DEFAULT, 1),
            'showresultsimmediately' => new external_value(PARAM_INT,  '1 = mostrar resultados al finalizar', VALUE_DEFAULT, 0),
            'visible'                => new external_value(PARAM_INT,  '1 = visible para los alumnos', VALUE_DEFAULT, 1),
            'password'               => new external_value(PARAM_TEXT, 'Contraseña de acceso (vacío = sin contraseña)', VALUE_DEFAULT, ''),
            'quizdraftitemid'        => new external_value(PARAM_INT,  'Draft item id para archivos del intro', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(
        int $courseid, int $sectionnum, string $name,
        string $intro = '', int $timeopen = 0, int $timeclose = 0,
        int $timelimit = 0, int $maxattempts = 0,
        int $shufflequestions = 1, int $shuffleanswers = 1,
        int $showresultsimmediately = 0, int $visible = 1,
        string $password = '', int $quizdraftitemid = 0,
    ): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid'               => $courseid,
            'sectionnum'             => $sectionnum,
            'name'                   => $name,
            'intro'                  => $intro,
            'timeopen'               => $timeopen,
            'timeclose'              => $timeclose,
            'timelimit'              => $timelimit,
            'maxattempts'            => $maxattempts,
            'shufflequestions'       => $shufflequestions,
            'shuffleanswers'         => $shuffleanswers,
            'showresultsimmediately' => $showresultsimmediately,
            'visible'                => $visible,
            'password'               => $password,
            'quizdraftitemid'        => $quizdraftitemid,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($params['courseid']);

        $data = new \stdClass();
        $data->course       = $params['courseid'];
        $data->modulename   = 'quiz';
        $data->module = $DB->get_record('modules', ['name' => $data->modulename], '*', MUST_EXIST)->id;
        $data->section      = $params['sectionnum'];
        $data->name         = $params['name'];
        $data->intro        = $params['intro'];
        $data->introformat  = FORMAT_HTML;
        $data->timeopen     = $params['timeopen'];
        $data->timeclose    = $params['timeclose'];
        $data->timelimit    = $params['timelimit'];
        $data->attempts     = $params['maxattempts'];
        $data->shufflequestions = $params['shufflequestions'];
        $data->shuffleanswers   = $params['shuffleanswers'];

        $data->quizpassword       = $params['password'];
        $data->visible            = $params['visible'];

        $data->grade              = 10;
        $data->grademethod        = 1;
        $data->questionsperpage   = 1;
        $data->navmethod          = 'free';
        $data->overduehandling    = 'autosubmit';
        $data->preferredbehaviour = 'deferredfeedback';
        $data->visible            = 1;
        $data->completion         = 1;
        $data->completionview     = 1;

        $reviewall = 0x11110;
        $data->reviewattempt = $reviewall;
        if ($params['showresultsimmediately']) {
            $data->reviewcorrectness      = $reviewall;
            $data->reviewmarks            = $reviewall;
            $data->reviewspecificfeedback = $reviewall;
            $data->reviewgeneralfeedback  = $reviewall;
            $data->reviewrightanswer      = $reviewall;
            $data->reviewoverallfeedback  = $reviewall;
        } else {
            $data->reviewcorrectness      = 0;
            $data->reviewmarks            = 0;
            $data->reviewspecificfeedback = 0;
            $data->reviewgeneralfeedback  = 0;
            $data->reviewrightanswer      = 0;
            $data->reviewoverallfeedback  = 0;
        }

        if ($params['quizdraftitemid'] > 0) {
            $data->files = $params['quizdraftitemid'];
        }

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
