<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_question extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid'          => new external_value(PARAM_INT,  'Course module ID del quiz'),
            'questionid'    => new external_value(PARAM_INT,  'ID de la pregunta a actualizar'),
            'questiontext'  => new external_value(PARAM_RAW,  'Nuevo texto de la pregunta (HTML)'),
            'answers'       => new external_multiple_structure(
                new external_value(PARAM_RAW, 'Texto de una respuesta'),
                'Respuestas (solo multichoice)',
                VALUE_DEFAULT,
                []
            ),
            'correctindex'   => new external_value(PARAM_INT, 'Índice respuesta correcta (multichoice, un solo correcto)', VALUE_DEFAULT, 0),
            'correctindices' => new external_multiple_structure(
                new external_value(PARAM_INT, 'Índice de una respuesta correcta'),
                'Índices de respuestas correctas (multichoice, permite varias)',
                VALUE_DEFAULT,
                []
            ),
            'correctanswer' => new external_value(PARAM_INT, '1=verdadero 0=falso (truefalse)', VALUE_DEFAULT, 1),
        ]);
    }

    public static function execute(
        int $cmid, int $questionid, string $questiontext,
        array $answers = [], int $correctindex = 0, array $correctindices = [], int $correctanswer = 1,
    ): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/lib/questionlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid'           => $cmid,
            'questionid'     => $questionid,
            'questiontext'   => $questiontext,
            'answers'        => $answers,
            'correctindex'   => $correctindex,
            'correctindices' => $correctindices,
            'correctanswer'  => $correctanswer,
        ]);

        $cm = get_coursemodule_from_id('quiz', $params['cmid'], 0, false, MUST_EXIST);
        self::validate_context(\context_module::instance($cm->id));
        require_capability('moodle/course:manageactivities', \context_course::instance($cm->course));

        $question = $DB->get_record('question', ['id' => $params['questionid']], '*', MUST_EXIST);

        // Update question text
        $DB->set_field('question', 'questiontext', $params['questiontext'], ['id' => $question->id]);
        $DB->set_field('question', 'name', substr(strip_tags($params['questiontext']), 0, 80), ['id' => $question->id]);
        $DB->set_field('question', 'timemodified', time(), ['id' => $question->id]);

        if ($question->qtype === 'multichoice') {
            if (count($params['answers']) < 2) {
                throw new \invalid_parameter_exception('Se necesitan al menos 2 respuestas para opción múltiple.');
            }

            $correctIndices = !empty($params['correctindices'])
                ? $params['correctindices']
                : [$params['correctindex']];
            $nCorrect = count($correctIndices);
            $single   = $nCorrect === 1 ? 1 : 0;

            $DB->set_field('qtype_multichoice_options', 'single', $single, ['questionid' => $question->id]);

            // Delete existing answers and recreate
            $DB->delete_records('question_answers', ['question' => $question->id]);

            foreach ($params['answers'] as $i => $text) {
                $answer                 = new \stdClass();
                $answer->question       = $question->id;
                $answer->answer         = $text;
                $answer->answerformat   = FORMAT_HTML;
                $answer->fraction       = in_array($i, $correctIndices) ? (1.0 / $nCorrect) : 0.0;
                $answer->feedback       = '';
                $answer->feedbackformat = FORMAT_HTML;
                $DB->insert_record('question_answers', $answer);
            }
        } else if ($question->qtype === 'truefalse') {
            // For truefalse, update fractions in question_answers
            $tf_answers = $DB->get_records('question_answers', ['question' => $question->id], 'id ASC');
            foreach ($tf_answers as $ans) {
                $label    = strtolower(strip_tags($ans->answer));
                $isTrue   = strpos($label, 'true') !== false || strpos($label, 'verdad') !== false;
                $fraction = ($isTrue && $params['correctanswer'] == 1) || (!$isTrue && $params['correctanswer'] == 0)
                    ? 1.0
                    : 0.0;
                $DB->set_field('question_answers', 'fraction', $fraction, ['id' => $ans->id]);
            }
            $DB->set_field('qtype_truefalse_options', 'trueanswer',
                $DB->get_field_sql(
                    "SELECT id FROM {question_answers} WHERE question = ? ORDER BY id ASC LIMIT 1",
                    [$question->id]
                ),
                ['question' => $question->id]
            );
        }

        // Bump question version so Moodle picks up the changes
        $DB->set_field_select(
            'question_versions',
            'version',
            $DB->get_field_sql(
                "SELECT MAX(version) + 1 FROM {question_versions} WHERE questionbankentryid = (SELECT questionbankentryid FROM {question_versions} WHERE questionid = ? LIMIT 1)",
                [$question->id]
            ),
            "questionid = ?",
            [$question->id]
        );

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Indica si la actualización fue exitosa'),
        ]);
    }
}
