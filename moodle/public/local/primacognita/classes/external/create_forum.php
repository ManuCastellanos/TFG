<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined("MOODLE_INTERNAL") || die();

class create_forum extends external_api
{
    public static function execute_parameters(): external_function_parameters
    {
        return new external_function_parameters([
            "courseid" => new external_value(PARAM_INT, "ID del curso"),
            "sectionnum" => new external_value(
                PARAM_INT,
                "Número de sección",
                VALUE_DEFAULT,
                0,
            ),
            "name" => new external_value(PARAM_TEXT, "Nombre del foro"),
            "intro" => new external_value(
                PARAM_RAW,
                "Descripción HTML",
                VALUE_DEFAULT,
                "",
            ),
            "type" => new external_value(
                PARAM_TEXT,
                "Tipo de foro (general, news, single, eachuser, qanda, blog)",
                VALUE_DEFAULT,
                "general",
            ),
        ]);
    }

    public static function execute(
        int $courseid,
        int $sectionnum,
        string $name,
        string $intro = "",
        string $type = "general",
    ): array {
        global $CFG, $DB;
        require_once $CFG->dirroot . "/course/modlib.php";
        require_once $CFG->dirroot . "/mod/forum/lib.php";

        $params = self::validate_parameters(self::execute_parameters(), [
            "courseid" => $courseid,
            "sectionnum" => $sectionnum,
            "name" => $name,
            "intro" => $intro,
            "type" => $type,
        ]);

        $context = \context_course::instance($params["courseid"]);
        self::validate_context($context);
        require_capability("moodle/course:manageactivities", $context);

        $course = get_course($params["courseid"]);

        $data = new \stdClass();
        $data->course = $params["courseid"];
        $data->modulename = "forum";
        $data->module = $DB->get_record('modules', ['name' => $data->modulename], '*', MUST_EXIST)->id;
        $data->section = $params["sectionnum"];
        $data->name = $params["name"];
        $data->intro = $params["intro"];
        $data->introformat = FORMAT_HTML;
        $data->type = $params["type"];
        $data->visible = 1;

        $mod = add_moduleinfo($data, $course);
        return [
            "cmid" => (int) $mod->coursemodule,
            "forumid" => (int) $mod->instance,
        ];
    }

    public static function execute_returns(): external_single_structure
    {
        return new external_single_structure([
            "cmid" => new external_value(PARAM_INT, "ID del course module"),
            "forumid" => new external_value(PARAM_INT, "ID del foro"),
        ]);
    }
}
