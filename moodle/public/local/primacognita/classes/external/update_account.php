<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class update_account extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'firstname' => new external_value(PARAM_TEXT, 'Nombre',    VALUE_DEFAULT, ''),
            'lastname'  => new external_value(PARAM_TEXT, 'Apellidos', VALUE_DEFAULT, ''),
        ]);
    }

    public static function execute(
        string $firstname = '',
        string $lastname  = '',
    ): array {
        global $DB, $USER;

        $params = self::validate_parameters(self::execute_parameters(), [
            'firstname' => $firstname,
            'lastname'  => $lastname,
        ]);

        self::validate_context(\context_system::instance());
        require_capability('moodle/user:editownprofile', \context_system::instance());

        // Update name fields.
        if ($params['firstname'] !== '' || $params['lastname'] !== '') {
            $record               = new \stdClass();
            $record->id           = $USER->id;
            $record->timemodified = time();
            if ($params['firstname'] !== '') {
                $record->firstname = $params['firstname'];
                $USER->firstname   = $params['firstname'];
            }
            if ($params['lastname'] !== '') {
                $record->lastname = $params['lastname'];
                $USER->lastname   = $params['lastname'];
            }
            $DB->update_record('user', $record);
        }

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Si se guardó correctamente'),
        ]);
    }
}
