/* global NAMESPACE
 ==============================================================
 * A script for abstract, reusable functions                 */

const global = function() {

  /* @return {true} if the field is NOT empty
  ============================================================== */
  const fieldNotEmpty = function(field) {
    return field.val().length > 0;
  };

  /* @return {true} if the field is IS empty
  ============================================================== */
  const fieldIsEmpty = function(field) {
    return field.val().length === 0;
  };

return {
  fieldNotEmpty: fieldNotEmpty,
  fieldIsEmpty: fieldIsEmpty
}
}();
//  ============================================================== */