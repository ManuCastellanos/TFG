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
            'firstname'         => new external_value(PARAM_TEXT, 'Nombre',    VALUE_DEFAULT, ''),
            'lastname'          => new external_value(PARAM_TEXT, 'Apellidos', VALUE_DEFAULT, ''),
            'picturedraftitemid'=> new external_value(PARAM_INT,  'Draft item id de la foto de perfil (0 = sin cambio)', VALUE_DEFAULT, 0),
        ]);
    }

    public static function execute(
        string $firstname          = '',
        string $lastname           = '',
        int    $picturedraftitemid = 0,
    ): array {
        global $CFG, $DB, $USER;

        $params = self::validate_parameters(self::execute_parameters(), [
            'firstname'          => $firstname,
            'lastname'           => $lastname,
            'picturedraftitemid' => $picturedraftitemid,
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

        // Update profile picture.
        if ($params['picturedraftitemid'] > 0) {
            require_once($CFG->libdir . '/gdlib.php');
            $usercontext = \context_user::instance($USER->id);
            $newpicture  = process_new_icon($usercontext, 'user', 'icon', 0, $params['picturedraftitemid']);
            if ($newpicture !== false) {
                $DB->set_field('user', 'picture', $newpicture, ['id' => $USER->id]);
                $USER->picture = $newpicture;
            }
        }

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Si se guardó correctamente'),
        ]);
    }
}
