<?php
namespace local_primacognita;

defined('MOODLE_INTERNAL') || die();

class access {

    private const TEACHER_SHORTNAMES = ['editingteacher', 'teacher'];

    /**
     * ¿$teacherid imparte docencia en al menos un curso en el que $studentid
     * está matriculado como alumno?
     */
    public static function teacher_shares_course_with_student(int $teacherid, int $studentid): bool {
        global $DB;

        if ($teacherid === $studentid) {
            return true;
        }

        $teachercourses = enrol_get_users_courses($teacherid, true, ['id']);
        if (empty($teachercourses)) {
            return false;
        }

        list($insql, $inparams) = $DB->get_in_or_equal(self::TEACHER_SHORTNAMES, SQL_PARAMS_NAMED, 'r');
        $teacherroleids = array_keys($DB->get_records_select('role', "shortname $insql", $inparams, '', 'id'));
        if (empty($teacherroleids)) {
            return false;
        }
        $studentroleid = $DB->get_field('role', 'id', ['shortname' => 'student']);

        foreach ($teachercourses as $course) {
            $context = \context_course::instance($course->id);

            $hasteacherrole = false;
            foreach ($teacherroleids as $roleid) {
                if (user_has_role_assignment($teacherid, $roleid, $context->id)) {
                    $hasteacherrole = true;
                    break;
                }
            }
            if (!$hasteacherrole) {
                continue;
            }

            if (!is_enrolled($context, $studentid, '', true)) {
                continue;
            }

            if ($studentroleid && !user_has_role_assignment($studentid, $studentroleid, $context->id)) {
                continue;
            }

            return true;
        }

        return false;
    }
}
