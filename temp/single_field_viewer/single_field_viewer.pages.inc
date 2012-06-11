<?php
// $Id$

/**
 * @file
 *   This file includes all page callback for single_field_viewer module.
 */

/**
 * This is implementation callback for path node/%node/field/%field_name/%delta.
 * It only call template for field to return rendered html.
 *
 * @see singe_field_viewer_menu
 *
 * @param stdClass $node
 *   node with fields values to be displayed
 * @param string $field_name
 *   Field name
 * @param int $delta
 *  Delta of field value
 * @return string
 *   HTML rendered content.
 */
function single_field_viewer_page_callback($node, $field_name, $delta) {
  if (
    isset($node->$field_name) &&
    isset($node->{$field_name}[$delta])
  ) {
    return theme(
      'single_field_viewer',
      $node,
      $field_name,
      $delta
    );
  }
  else {
    drupal_not_found();
  }
}