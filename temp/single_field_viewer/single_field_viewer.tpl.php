<?php
//$Id$

/**
 * @file
 * Theme implementation to display a single field value.
 *
 * Available variables:
 * - $value -> field value instance
 * - $node -> parent node of field
 * - $delta -> delta value of field
 * - $field -> field name
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.*   
 */

print check_plain($value['value']);
