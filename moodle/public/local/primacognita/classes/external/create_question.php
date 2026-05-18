<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class create_question extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'cmid'          => new external_value(PARAM_INT,  'Course module ID del quiz'),
            'qtype'         => new external_value(PARAM_TEXT, 'Tipo: multichoice | truefalse'),
            'name'          => new external_value(PARAM_TEXT, 'Nombre/título de la pregunta'),
            'questiontext'  => new external_value(PARAM_RAW,  'Texto de la pregunta (HTML)'),
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
            'correctanswer' => new external_value(PARAM_INT,  '1=verdadero 0=falso (truefalse)', VALUE_DEFAULT, 1),
        ]);
    }

    public static function execute(
        int $cmid, string $qtype, string $name, string $questiontext,
        array $answers = [], int $correctindex = 0, array $correctindices = [], int $correctanswer = 1,
    ): array {
        global $CFG, $DB;
        require_once($CFG->dirroot . '/mod/quiz/locallib.php');
        require_once($CFG->dirroot . '/lib/questionlib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'cmid'          => $cmid,
            'qtype'         => $qtype,
            'name'          => $name,
            'questiontext'  => $questiontext,
            'answers'        => $answers,
            'correctindex'   => $correctindex,
            'correctindices' => $correctindices,
            'correctanswer'  => $correctanswer,
        ]);

        $cm = get_coursemodule_from_id('quiz', $params['cmid'], 0, false, MUST_EXIST);
        self::validate_context(\context_module::instance($cm->id));
        require_capability('moodle/course:manageactivities', \context_course::instance($cm->course));

        $quiz    = $DB->get_record('quiz', ['id' => $cm->instance], '*', MUST_EXIST);
        $context = \context_course::instance($cm->course);

        // Find or create top-level category (parent=0) for this context
        $topcategory = $DB->get_record(
            'question_categories',
            ['contextid' => $context->id, 'parent' => 0],
            '*',
            IGNORE_MISSING
        );

        if (!$topcategory) {
            $topcategory             = new \stdClass();
            $topcategory->name       = 'top';
            $topcategory->info       = '';
            $topcategory->infoformat = FORMAT_HTML;
            $topcategory->contextid  = $context->id;
            $topcategory->parent     = 0;
            $topcategory->sortorder  = 0;
            $topcategory->stamp      = make_unique_id_code();
            $topcategory->id         = (int) $DB->insert_record('question_categories', $topcategory);
        }

        $topid    = (int) $topcategory->id;
        $category = $DB->get_record(
            'question_categories',
            ['contextid' => $context->id, 'parent' => $topid],
            '*',
            IGNORE_MISSING
        );

        if (!$category) {
            $category              = new \stdClass();
            $category->name        = 'Por defecto';
            $category->info        = '';
            $category->infoformat  = FORMAT_HTML;
            $category->contextid   = $context->id;
            $category->parent      = $topid;
            $category->sortorder   = 999;
            $category->stamp       = make_unique_id_code();
            $category->id          = (int) $DB->insert_record('question_categories', $category);
        }

        $qtype_instance = \question_bank::get_qtype($params['qtype']);

        $form = new \stdClass();
        $form->category        = $category->id . ',' . $context->id;
        $form->name            = $params['name'];
        $form->questiontext    = ['text' => $params['questiontext'], 'format' => FORMAT_HTML];
        $form->generalfeedback = ['text' => '', 'format' => FORMAT_HTML];
        $form->defaultmark     = 1;
        $form->penalty         = 0.3333333;
        $form->status          = 'ready';

        if ($params['qtype'] === 'multichoice') {
            if (count($params['answers']) < 2) {
                throw new \invalid_parameter_exception('Se necesitan al menos 2 respuestas para opción múltiple.');
            }
            $form->shuffleanswers           = 1;
            $form->answernumbering          = 'abc';
            $form->layout                   = 0;
            $form->showstandardinstruction  = 0;
            $form->correctfeedback          = ['text' => '', 'format' => FORMAT_HTML];
            $form->partiallycorrectfeedback = ['text' => '', 'format' => FORMAT_HTML];
            $form->incorrectfeedback        = ['text' => '', 'format' => FORMAT_HTML];

            // Determine correct indices: prefer correctindices array, fall back to correctindex
            $correctIndices = !empty($params['correctindices'])
                ? $params['correctindices']
                : [$params['correctindex']];
            $nCorrect = count($correctIndices);
            $form->single = $nCorrect === 1 ? 1 : 0;

            $form->answer   = [];
            $form->fraction = [];
            $form->feedback = [];
            foreach ($params['answers'] as $i => $text) {
                $form->answer[$i]   = ['text' => $text, 'format' => FORMAT_HTML];
                $form->fraction[$i] = in_array($i, $correctIndices) ? (1.0 / $nCorrect) : 0.0;
                $form->feedback[$i] = ['text' => '', 'format' => FORMAT_HTML];
            }
        } else if ($params['qtype'] === 'truefalse') {
            $form->correctanswer = $params['correctanswer'];
            $form->feedbacktrue  = ['text' => '', 'format' => FORMAT_HTML];
            $form->feedbackfalse = ['text' => '', 'format' => FORMAT_HTML];
        } else {
            throw new \invalid_parameter_exception('Tipo de pregunta no soportado: ' . $params['qtype']);
        }

        $question          = new \stdClass();
        $question->qtype   = $params['qtype'];
        $question->parent  = 0;
        $question->length  = 1;

        $question = $qtype_instance->save_question($question, $form);

        quiz_add_quiz_question($question->id, $quiz, 0, 1.0);
        quiz_update_sumgrades($quiz);

        // Get the slot number of the newly added question
        $slot = $DB->get_field_sql(
            "SELECT MAX(slot) FROM {quiz_slots} WHERE quizid = :quizid",
            ['quizid' => $quiz->id]
        );

        return [
            'questionid' => (int) $question->id,
            'slot'       => (int) $slot,
        ];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'questionid' => new external_value(PARAM_INT, 'ID de la pregunta creada'),
            'slot'       => new external_value(PARAM_INT, 'Posición en el quiz'),
        ]);
    }
}
