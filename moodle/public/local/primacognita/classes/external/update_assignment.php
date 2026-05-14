<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_assignment extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid'      => new external_value(PARAM_INT,  'ID del course module'),
            'name'      => new external_value(PARAM_TEXT, 'Nombre de la tarea'),
            'intro'     => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
            'duedate'   => new external_value(PARAM_INT,  'Fecha de entrega Unix (0 = sin fecha)', VALUE_DEFAULT, 0),
            'maxgrade'  => new external_value(PARAM_INT,  'Nota máxima', VALUE_DEFAULT, 10),
            'allowfile' => new external_value(PARAM_INT,  '1 = permite archivos', VALUE_DEFAULT, 1),
            'allowtext' => new external_value(PARAM_INT,  '1 = permite texto en línea', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(
        int $cmid, string $name, string $intro = '',
        int $duedate = 0, int $maxgrade = 10,
        int $allowfile = 1, int $allowtext = 0,
    ): array {
        global $CFG;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid'      => $cmid,
            'name'      => $name,
            'intro'     => $intro,
            'duedate'   => $duedate,
            'maxgrade'  => $maxgrade,
            'allowfile' => $allowfile,
            'allowtext' => $allowtext,
        ]);

        $cm     = get_coursemodule_from_id('assign', $params['cmid'], 0, false, MUST_EXIST);
        $context = \context_course::instance($cm->course);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($cm->course);

        $data = new \stdClass();
        $data->coursemodule = $params['cmid'];
        $data->modulename   = 'assign';
        $data->name         = $params['name'];
        $data->intro        = $params['intro'];
        $data->introformat  = FORMAT_HTML;
        $data->duedate      = $params['duedate'];
        $data->grade        = $params['maxgrade'];
        $data->assignsubmission_file_enabled       = $params['allowfile'];
        $data->assignsubmission_onlinetext_enabled = $params['allowtext'];

        update_moduleinfo($cm, $data, $course);
        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Operación exitosa'),
        ]);
    }
}
