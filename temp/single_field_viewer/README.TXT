// $Id$

Readme file for the SINGLE_FIELD_VIEWER module for Drupal
---------------------------------------------------------

This module allows CCK fields to be displayed on separate pages. Site builder
can select fields, which will be used in this way.
For each field assigned to specific node type, themer can prepare proper templates.
If you are using pathauto module,
this module allows to create path patterns for each of fields displayed in
this mode. This module implements also basic support for tokens (built in
support for imagefield and emvideo title and description attributes).
Fields inherit view access right from node, so if node is unpublished or
node access denies viewing of node, CCK field will be unaccessible as well.

This module was created in order to replace old approach of media handling used
at our websites (it was image as node approach and nodereference as glue between
parent nodes (like articles) and child as images). In our case it was big impact
for performance (we got over 300 000 image nodes for only 70 000 "parent nodes")
This solution is quite lightweight (it doesn't requires views) and uses cck
content cache, so it works really fast.
This solution has some disadvantages. CCK field is not powerfull like node, so
you cannot do many things like comment such nodes and do other thins.
But if you need to display fields on separate pages, with various layout. You
need some basic support for tokens and pathauto, this module might serve you well.


Installation:
  Installation path is typical installation pattern. Please extract module
  tarball to modules directory (typicaly to sites/all/modules at your drupal
  installation). After doing this, please enable module at
  admin/build/modules panel.

Configuration:
  At content type configuration (ie: /admin/content/node-type/article ),
  at "Single field viewer module settings" please select cck fields which will
  be displayed on separate pages. After this, all of those fields be displayed
  under node/{node nid}/field/{field name}/{field delta}. If you are using
  pathauto module, you can setup path patterns for each of fields. You can
  use few additional tokens:
    single_field_viewer_field_delta - delta of field value
    single_field_viewer_field_name - name of field
    single_field_viewer_data_title - ie. imagefield field title attribute
    single_field_viewer_data_description - ie. imagefield description attribute


Content templating:
For each field selected in previous step, you should create template file at your theme.
Possible templates names:
1. single_field_viewer-{field machine name}.tpl.php, ie. single-field-viewer-field_node_images.tpl.php
2. single_field_viewer-{node type}-{field machine name}.tpl.php, ie. single-fied-viewer-article-field_node_images.tpl.php

In both cases, you have access to following variables in templates:
- $value -> Dispayed field instance (in array form)
- $node -> parent node of field
- $delta -> delta value of field value
- $field -> field name
- $is_front: Flags true when presented in the front page.
- $logged_in: Flags true when the current user is a logged-in member.
- $is_admin: Flags true when the current user is an administrator.*   



Extending:
  This module wasn't designed to be extensible, but if you need to increase set
  of token values you can use combo of hook_token_list and
  hook_single_field_viewer_token_values_alter hooks to implement additonal tokens.
  Please check module code for example of doing this.


Dependencies:
  SINGLE_FIELD_VIEWER module requires CCK module in order to work correctly.
  Pathauto and token modules are strongly recommended.
