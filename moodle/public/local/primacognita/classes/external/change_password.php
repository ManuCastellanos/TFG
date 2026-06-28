<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class change_password extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'currentpassword' => new external_value(PARAM_RAW, 'Contraseña actual'),
            'newpassword'     => new external_value(PARAM_RAW, 'Nueva contraseña'),
        ]);
    }

    public static function execute(string $currentpassword, string $newpassword): array {
        global $CFG, $USER;

        require_once($CFG->libdir . '/moodlelib.php');

        $params = self::validate_parameters(self::execute_parameters(), [
            'currentpassword' => $currentpassword,
            'newpassword'     => $newpassword,
        ]);

        self::validate_context(\context_system::instance());

        // Load the full user object (needed for password functions).
        $userobj = get_complete_user_data('id', $USER->id);
        if (!$userobj) {
            throw new \moodle_exception('invaliduser', 'error');
        }

        // Verify current password.
        if (!validate_internal_user_password($userobj, $params['currentpassword'])) {
            throw new \moodle_exception('invalidlogin', 'local_primacognita', '', null, 'Contraseña actual incorrecta');
        }

        // Validate new password against site policy.
        $errmsg = '';
        if (!check_password_policy($params['newpassword'], $errmsg)) {
            throw new \moodle_exception('errorpasswordpolicy', 'auth', '', $errmsg);
        }

        // Change the password.
        update_internal_user_password($userobj, $params['newpassword']);

        return ['success' => true];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'success' => new external_value(PARAM_BOOL, 'Si se cambió la contraseña'),
        ]);
    }
}
