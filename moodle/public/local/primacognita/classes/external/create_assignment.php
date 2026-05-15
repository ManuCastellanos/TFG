<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class create_assignment extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid'                 => new external_value(PARAM_INT,  'ID del curso'),
            'sectionnum'               => new external_value(PARAM_INT,  'Número de sección (0-indexed)', VALUE_DEFAULT, 0),
            'name'                     => new external_value(PARAM_TEXT, 'Nombre de la tarea'),
            'intro'                    => new external_value(PARAM_RAW,  'Descripción HTML', VALUE_DEFAULT, ''),
            'allowsubmissionsfromdate' => new external_value(PARAM_INT,  'Fecha de apertura Unix (0 = ya abierto)', VALUE_DEFAULT, 0),
            'duedate'                  => new external_value(PARAM_INT,  'Fecha de entrega Unix (0 = sin fecha)', VALUE_DEFAULT, 0),
            'cutoffdate'               => new external_value(PARAM_INT,  'Fecha límite Unix (0 = sin límite)', VALUE_DEFAULT, 0),
            'maxgrade'                 => new external_value(PARAM_INT,  'Nota máxima', VALUE_DEFAULT, 10),
            'gradepass'                => new external_value(PARAM_INT,  'Nota para aprobar (0 = no configurada)', VALUE_DEFAULT, 0),
            'allowfile'                => new external_value(PARAM_INT,  '1 = permite archivos', VALUE_DEFAULT, 1),
            'allowtext'                => new external_value(PARAM_INT,  '1 = permite texto en línea', VALUE_DEFAULT, 0),
            'maxfilesubmissions'       => new external_value(PARAM_INT,  'Número máximo de archivos por entrega', VALUE_DEFAULT, 1),
            'acceptedfiletypes'        => new external_value(PARAM_TEXT, 'Tipos de archivo aceptados (ej: .pdf,.docx)', VALUE_DEFAULT, ''),
            'submissiondrafts'         => new external_value(PARAM_INT,  '1 = requiere clic en enviar', VALUE_DEFAULT, 0),
            'sendnotifications'        => new external_value(PARAM_INT,  '1 = notificar al profesor al recibir entrega', VALUE_DEFAULT, 0),
            'activitydraftitemid'      => new external_value(PARAM_INT,  'Draft item id para archivos adicionales de la actividad', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(
        int $courseid, int $sectionnum, string $name,
        string $intro = '', int $allowsubmissionsfromdate = 0, int $duedate = 0,
        int $cutoffdate = 0, int $maxgrade = 10, int $gradepass = 0,
        int $allowfile = 1, int $allowtext = 0, int $maxfilesubmissions = 1,
        string $acceptedfiletypes = '', int $submissiondrafts = 0,
        int $sendnotifications = 0, int $activitydraftitemid = 0,
    ): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/course/modlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'courseid'                 => $courseid,
            'sectionnum'               => $sectionnum,
            'name'                     => $name,
            'intro'                    => $intro,
            'allowsubmissionsfromdate' => $allowsubmissionsfromdate,
            'duedate'                  => $duedate,
            'cutoffdate'               => $cutoffdate,
            'maxgrade'                 => $maxgrade,
            'gradepass'                => $gradepass,
            'allowfile'                => $allowfile,
            'allowtext'                => $allowtext,
            'maxfilesubmissions'       => $maxfilesubmissions,
            'acceptedfiletypes'        => $acceptedfiletypes,
            'submissiondrafts'         => $submissiondrafts,
            'sendnotifications'        => $sendnotifications,
            'activitydraftitemid'      => $activitydraftitemid,
        ]);

        $context = \context_course::instance($params['courseid']);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', $context);

        $course = get_course($params['courseid']);

        $data = new \stdClass();
        $data->course      = $params['courseid'];
        $data->modulename  = 'assign';
        $data->module      = $DB->get_record('modules', ['name' => $data->modulename], '*', MUST_EXIST)->id;
        $data->section     = $params['sectionnum'];
        $data->name        = $params['name'];
        $data->intro       = $params['intro'];
        $data->introformat = FORMAT_HTML;

        $data->allowsubmissionsfromdate = $params['allowsubmissionsfromdate'];
        $data->duedate                  = $params['duedate'];
        $data->cutoffdate               = $params['cutoffdate'];
        $data->grade                    = $params['maxgrade'];
        $data->gradepass                = $params['gradepass'];

        $data->assignsubmission_file_enabled            = $params['allowfile'];
        $data->assignsubmission_onlinetext_enabled      = $params['allowtext'];
        $data->assignsubmission_file_maxfilesubmissions = $params['maxfilesubmissions'];
        $data->assignsubmission_file_filetypeslist      = $params['acceptedfiletypes'];
        $data->assignsubmission_file_maxsizebytes       = 209715200; // 200 MB fijo

        $data->submissiondrafts           = $params['submissiondrafts'];
        $data->sendnotifications          = $params['sendnotifications'];
        $data->requiresubmissionstatement = 0;
        $data->sendlatenotifications      = 0;
        $data->sendstudentnotifications   = 1;
        $data->gradingduedate             = 0;
        $data->teamsubmission             = 0;
        $data->requireallteammemberssubmit = 0;
        $data->blindmarking               = 0;
        $data->maxattempts                = -1;
        $data->attemptreopenmethod        = 'none';
        $data->markingworkflow            = 0;
        $data->markingallocation          = 0;
        $data->visible                    = 1;

        if ($params['activitydraftitemid'] > 0) {
            $data->files = $params['activitydraftitemid'];
        }

        $mod = add_moduleinfo($data, $course);
        return ['cmid' => (int) $mod->coursemodule, 'assignmentid' => (int) $mod->instance];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'cmid'         => new external_value(PARAM_INT, 'ID del course module'),
            'assignmentid' => new external_value(PARAM_INT, 'ID de la tarea'),
        ]);
    }
}
