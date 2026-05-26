<?php
defined('MOODLE_INTERNAL') || die();

$functions = [
    'local_primacognita_create_section' => [
        'classname'    => 'local_primacognita\external\create_section',
        'methodname'   => 'execute',
        'description'  => 'Crea una sección en el curso.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:update',
    ],
    'local_primacognita_update_section' => [
        'classname'    => 'local_primacognita\external\update_section',
        'methodname'   => 'execute',
        'description'  => 'Actualiza nombre/resumen de una sección.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:update',
    ],
    'local_primacognita_create_assignment' => [
        'classname'    => 'local_primacognita\external\create_assignment',
        'methodname'   => 'execute',
        'description'  => 'Crea una tarea (assign) en el curso.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_update_assignment' => [
        'classname'    => 'local_primacognita\external\update_assignment',
        'methodname'   => 'execute',
        'description'  => 'Actualiza una tarea existente.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_create_resource' => [
        'classname'    => 'local_primacognita\external\create_resource',
        'methodname'   => 'execute',
        'description'  => 'Crea un recurso de archivo (mod_resource).',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_create_url' => [
        'classname'    => 'local_primacognita\external\create_url',
        'methodname'   => 'execute',
        'description'  => 'Crea un recurso URL (mod_url).',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_create_quiz' => [
        'classname'    => 'local_primacognita\external\create_quiz',
        'methodname'   => 'execute',
        'description'  => 'Crea un quiz vacío.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_update_quiz' => [
        'classname'    => 'local_primacognita\external\update_quiz',
        'methodname'   => 'execute',
        'description'  => 'Actualiza metadatos de un quiz existente.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_create_forum' => [
        'classname'    => 'local_primacognita\external\create_forum',
        'methodname'   => 'execute',
        'description'  => 'Crea un foro en el curso.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_get_quiz_questions' => [
        'classname'    => 'local_primacognita\external\get_quiz_questions',
        'methodname'   => 'execute',
        'description'  => 'Devuelve las preguntas de un quiz.',
        'type'         => 'read',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_create_question' => [
        'classname'    => 'local_primacognita\external\create_question',
        'methodname'   => 'execute',
        'description'  => 'Crea una pregunta y la añade a un quiz.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_delete_question' => [
        'classname'    => 'local_primacognita\external\delete_question',
        'methodname'   => 'execute',
        'description'  => 'Elimina una pregunta (slot) de un quiz.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_update_question' => [
        'classname'    => 'local_primacognita\external\update_question',
        'methodname'   => 'execute',
        'description'  => 'Actualiza el texto y respuestas de una pregunta existente.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:manageactivities',
    ],
    'local_primacognita_delete_section' => [
        'classname'    => 'local_primacognita\external\delete_section',
        'methodname'   => 'execute',
        'description'  => 'Elimina una sección del curso.',
        'type'         => 'write',
        'capabilities' => 'moodle/course:update',
    ],
];

$services = [
    'PrimaCognita API' => [
        'functions'       => array_keys($functions),
        'restrictedusers' => 0,
        'enabled'         => 1,
        'shortname'       => 'primacognita',
    ],
];
