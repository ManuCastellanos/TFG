<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_user_profile extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'superpoder'     => new external_value(PARAM_TEXT, 'Mi superpoder',         VALUE_DEFAULT, ''),
            'cumpleanos'     => new external_value(PARAM_TEXT, 'Cumpleaños',            VALUE_DEFAULT, ''),
            'animal'         => new external_value(PARAM_TEXT, 'Animal favorito',       VALUE_DEFAULT, ''),
            'talento'        => new external_value(PARAM_TEXT, 'Lo que mejor se me da', VALUE_DEFAULT, ''),
            'tutor1_nombre'  => new external_value(PARAM_TEXT, 'Tutor 1 - Nombre',      VALUE_DEFAULT, ''),
            'tutor1_email'   => new external_value(PARAM_TEXT, 'Tutor 1 - Email',       VALUE_DEFAULT, ''),
            'tutor1_telefono'=> new external_value(PARAM_TEXT, 'Tutor 1 - Teléfono',    VALUE_DEFAULT, ''),
            'tutor2_nombre'  => new external_value(PARAM_TEXT, 'Tutor 2 - Nombre',      VALUE_DEFAULT, ''),
            'tutor2_email'   => new external_value(PARAM_TEXT, 'Tutor 2 - Email',       VALUE_DEFAULT, ''),
            'tutor2_telefono'=> new external_value(PARAM_TEXT, 'Tutor 2 - Teléfono',    VALUE_DEFAULT, ''),
        ]);
    }

    public static function execute(
        string $superpoder      = '',
        string $cumpleanos      = '',
        string $animal          = '',
        string $talento         = '',
        string $tutor1_nombre   = '',
        string $tutor1_email    = '',
        string $tutor1_telefono = '',
        string $tutor2_nombre   = '',
        string $tutor2_email    = '',
        string $tutor2_telefono = '',
    ): array {
        global $CFG, $USER;

        require_once($CFG->dirroot . '/user/profile/lib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'superpoder'      => $superpoder,
            'cumpleanos'      => $cumpleanos,
            'animal'          => $animal,
            'talento'         => $talento,
            'tutor1_nombre'   => $tutor1_nombre,
            'tutor1_email'    => $tutor1_email,
            'tutor1_telefono' => $tutor1_telefono,
            'tutor2_nombre'   => $tutor2_nombre,
            'tutor2_email'    => $tutor2_email,
            'tutor2_telefono' => $tutor2_telefono,
        ]);

        self::validate_context(\context_system::instance());

        $userobj = new \stdClass();
        $userobj->id = $USER->id;
        $userobj->profile_field_pc_superpoder      = $params['superpoder'];
        $userobj->profile_field_pc_cumpleanos      = $params['cumpleanos'];
        $userobj->profile_field_pc_animal          = $params['animal'];
        $userobj->profile_field_pc_talento         = $params['talento'];
        $userobj->profile_field_pc_tutor1_nombre   = $params['tutor1_nombre'];
        $userobj->profile_field_pc_tutor1_email    = $params['tutor1_email'];
        $userobj->profile_field_pc_tutor1_telefono = $params['tutor1_telefono'];
        $userobj->profile_field_pc_tutor2_nombre   = $params['tutor2_nombre'];
        $userobj->profile_field_pc_tutor2_email    = $params['tutor2_email'];
        $userobj->profile_field_pc_tutor2_telefono = $params['tutor2_telefono'];

        profile_save_data($userobj);

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Si se guardó correctamente'),
        ]);
    }
}
