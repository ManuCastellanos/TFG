<?php
namespace local_primacognita\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die();

class get_user_profile extends external_api {

    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([]);
    }

    public static function execute(): array {
        global $CFG, $DB, $USER;

        require_once($CFG->dirroot . '/user/profile/lib.php');
        require_once($CFG->libdir  . '/badgeslib.php');

        self::validate_context(\context_system::instance());

        // Load custom profile fields into $USER object.
        $userobj = $DB->get_record('user', ['id' => $USER->id], '*', MUST_EXIST);
        profile_load_data($userobj);

        $get = static function ($field) use ($userobj): string {
            $key = 'profile_field_' . $field;
            return isset($userobj->$key) ? (string) $userobj->$key : '';
        };

        $about = [
            'superpoder' => $get('pc_superpoder'),
            'cumpleanos' => $get('pc_cumpleanos'),
            'animal'     => $get('pc_animal'),
            'talento'    => $get('pc_talento'),
        ];

        // Family — only meaningful for students but always read.
        $family = [];
        $t1_nombre  = $get('pc_tutor1_nombre');
        $t1_email   = $get('pc_tutor1_email');
        $t1_telefono= $get('pc_tutor1_telefono');
        if ($t1_nombre !== '' || $t1_email !== '' || $t1_telefono !== '') {
            $family[] = ['nombre' => $t1_nombre, 'email' => $t1_email, 'telefono' => $t1_telefono];
        }
        $t2_nombre  = $get('pc_tutor2_nombre');
        $t2_email   = $get('pc_tutor2_email');
        $t2_telefono= $get('pc_tutor2_telefono');
        if ($t2_nombre !== '' || $t2_email !== '' || $t2_telefono !== '') {
            $family[] = ['nombre' => $t2_nombre, 'email' => $t2_email, 'telefono' => $t2_telefono];
        }

        // Badges.
        $badge_count  = 0;
        $recent_badges = [];
        try {
            $badges = badges_get_user_badges($USER->id, 0, 0, 3);
            $badge_count = count($badges);
            foreach ($badges as $badge) {
                $recent_badges[] = [
                    'id'   => (int) $badge->id,
                    'name' => (string) $badge->name,
                ];
            }
        } catch (\Throwable $e) {
            // badges may not be enabled — silently ignore.
        }

        // Recent graded activity (last 5 grade entries for the user).
        $recent_activity = [];
        $sql = "SELECT gg.id, gi.itemname, gi.grademax, gg.finalgrade, gg.timemodified
                  FROM {grade_grades} gg
                  JOIN {grade_items}  gi ON gi.id = gg.itemid
                 WHERE gg.userid = :userid
                   AND gg.finalgrade IS NOT NULL
                   AND gi.itemtype != 'course'
                   AND gi.itemname IS NOT NULL
              ORDER BY gg.timemodified DESC";
        $rows = $DB->get_records_sql($sql, ['userid' => $USER->id], 0, 5);
        foreach ($rows as $row) {
            $recent_activity[] = [
                'itemname'   => (string) $row->itemname,
                'grade'      => number_format((float) $row->finalgrade, 2, '.', ''),
                'grademax'   => number_format((float) $row->grademax, 2, '.', ''),
                'dategraded' => (int) $row->timemodified,
            ];
        }

        // Student count (useful for teachers).
        $student_count = 0;
        $courses = enrol_get_users_courses($USER->id, true, ['id']);
        if (!empty($courses)) {
            $courseids = array_column($courses, 'id');
            list($insql, $params) = $DB->get_in_or_equal($courseids, SQL_PARAMS_NAMED, 'c');
            $sql = "SELECT COUNT(DISTINCT ue.userid) AS cnt
                      FROM {user_enrolments} ue
                      JOIN {enrol} e ON e.id = ue.enrolid AND e.courseid $insql
                     WHERE ue.status = 0 AND ue.userid != :myid";
            $params['myid'] = $USER->id;
            $result = $DB->get_record_sql($sql, $params);
            $student_count = (int) ($result->cnt ?? 0);
        }

        return [
            'about'           => $about,
            'family'          => $family,
            'badge_count'     => $badge_count,
            'recent_badges'   => $recent_badges,
            'recent_activity' => $recent_activity,
            'student_count'   => $student_count,
        ];
    }

    public static function execute_returns(): external_single_structure {
        return new external_single_structure([
            'about' => new external_single_structure([
                'superpoder' => new external_value(PARAM_TEXT, 'Mi superpoder'),
                'cumpleanos' => new external_value(PARAM_TEXT, 'Cumpleaños'),
                'animal'     => new external_value(PARAM_TEXT, 'Animal favorito'),
                'talento'    => new external_value(PARAM_TEXT, 'Lo que mejor se me da'),
            ]),
            'family' => new external_multiple_structure(
                new external_single_structure([
                    'nombre'   => new external_value(PARAM_TEXT, 'Nombre del tutor'),
                    'email'    => new external_value(PARAM_TEXT, 'Email del tutor'),
                    'telefono' => new external_value(PARAM_TEXT, 'Teléfono del tutor'),
                ])
            ),
            'badge_count'     => new external_value(PARAM_INT,  'Total de insignias obtenidas'),
            'recent_badges'   => new external_multiple_structure(
                new external_single_structure([
                    'id'   => new external_value(PARAM_INT,  'ID de la insignia'),
                    'name' => new external_value(PARAM_TEXT, 'Nombre de la insignia'),
                ])
            ),
            'recent_activity' => new external_multiple_structure(
                new external_single_structure([
                    'itemname'   => new external_value(PARAM_TEXT, 'Nombre de la actividad'),
                    'grade'      => new external_value(PARAM_TEXT, 'Nota obtenida'),
                    'grademax'   => new external_value(PARAM_TEXT, 'Nota máxima'),
                    'dategraded' => new external_value(PARAM_INT,  'Fecha de calificación (timestamp)'),
                ])
            ),
            'student_count'   => new external_value(PARAM_INT, 'Total de alumnos (útil para profesores)'),
        ]);
    }
}
