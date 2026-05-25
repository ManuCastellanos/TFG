<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class delete_question extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid'   => new external_value(PARAM_INT, 'Course module ID del quiz'),
            'slotid' => new external_value(PARAM_INT, 'ID del slot a eliminar (quiz_slots.id)'),
        ]);
    }

    public static function execute(int $cmid, int $slotid): array {
        global $DB, $CFG;
        require_once($CFG->dirroot . '/mod/quiz/locallib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid'   => $cmid,
            'slotid' => $slotid,
        ]);

        $cm = get_coursemodule_from_id('quiz', $params['cmid'], 0, false, MUST_EXIST);
        self::validate_context(\context_module::instance($cm->id));
        require_capability('moodle/course:manageactivities', \context_course::instance($cm->course));

        $quiz = $DB->get_record('quiz', ['id' => $cm->instance], '*', MUST_EXIST);
        $slot = $DB->get_record('quiz_slots', ['id' => $params['slotid']], '*', MUST_EXIST);

        if ((int) $slot->quizid !== (int) $quiz->id) {
            throw new \invalid_parameter_exception('El slot no pertenece a este quiz.');
        }

        $quizsettings = \mod_quiz\quiz_settings::create_for_cmid($cm->id);
        $structure = \mod_quiz\structure::create_for_quiz($quizsettings);
        $structure->remove_slot($slot->slot);

        \mod_quiz\grade_calculator::create($quizsettings)->recompute_quiz_sumgrades();

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Resultado de la operación'),
        ]);
    }
}
