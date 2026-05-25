<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class get_quiz_questions extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid' => new external_value(PARAM_INT, 'Course module ID del quiz'),
        ]);
    }

    public static function execute(int $cmid): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/mod/quiz/locallib.php');

        $params = self::validate_parameters(self::execute_parameters(), ['cmid' => $cmid]);

        $cm = get_coursemodule_from_id('quiz', $params['cmid'], 0, false, MUST_EXIST);
        $context = \context_module::instance($cm->id);
        self::validate_context($context);
        require_capability('moodle/course:manageactivities', \context_course::instance($cm->course));

        $quiz = $DB->get_record('quiz', ['id' => $cm->instance], '*', MUST_EXIST);

        $sql = "SELECT qs.slot, qs.id AS slotid, q.id AS questionid, q.qtype, q.name, q.questiontext
                  FROM {quiz_slots} qs
                  JOIN {question_references} qr ON qr.itemid = qs.id
                  JOIN {question_bank_entries} qbe ON qbe.id = qr.questionbankentryid
                  JOIN {question_versions} qv ON qv.questionbankentryid = qbe.id
                  JOIN {question} q ON q.id = qv.questionid
                 WHERE qs.quizid = :quizid
                   AND qr.component = 'mod_quiz'
                   AND qr.questionarea = 'slot'
                 ORDER BY qs.slot";
        $rows = $DB->get_records_sql($sql, ['quizid' => $quiz->id]);

        $result = [];
        foreach ($rows as $row) {
            $answers = [];
            $correctanswer = -1;

            if ($row->qtype === 'multichoice') {
                $ans_rows = $DB->get_records(
                    'question_answers',
                    ['question' => $row->questionid],
                    'id ASC',
                    'id, answer, fraction'
                );
                foreach ($ans_rows as $a) {
                    $answers[] = [
                        'text'      => (string) $a->answer,
                        'iscorrect' => (int) ($a->fraction > 0),
                    ];
                }
            } else if ($row->qtype === 'truefalse') {
                $tf = $DB->get_records(
                    'question_answers',
                    ['question' => $row->questionid],
                    'id ASC',
                    'id, answer, fraction'
                );
                foreach ($tf as $a) {
                    if ($a->fraction >= 1.0) {
                        $correctanswer = strtolower($a->answer) === 'true' ? 1 : 0;
                        break;
                    }
                }
            }

            $result[] = [
                'slot'          => (int) $row->slot,
                'slotid'        => (int) $row->slotid,
                'questionid'    => (int) $row->questionid,
                'qtype'         => (string) $row->qtype,
                'name'          => (string) $row->name,
                'questiontext'  => (string) $row->questiontext,
                'answers'       => $answers,
                'correctanswer' => $correctanswer,
            ];
        }

        return $result;
    }

    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(
            new external_single_structure([
                'slot'         => new external_value(PARAM_INT,  'Posición en el quiz'),
                'slotid'       => new external_value(PARAM_INT,  'ID del slot'),
                'questionid'   => new external_value(PARAM_INT,  'ID de la pregunta'),
                'qtype'        => new external_value(PARAM_TEXT, 'Tipo: multichoice | truefalse'),
                'name'         => new external_value(PARAM_RAW,  'Nombre/título de la pregunta'),
                'questiontext' => new external_value(PARAM_RAW,  'Texto de la pregunta'),
                'answers'      => new external_multiple_structure(
                    new external_single_structure([
                        'text'      => new external_value(PARAM_RAW, 'Texto de la respuesta'),
                        'iscorrect' => new external_value(PARAM_INT, '1 si es correcta'),
                    ])
                ),
                'correctanswer' => new external_value(PARAM_INT, '1=verdadero, 0=falso, -1=no aplica'),
            ])
        );
    }
}
