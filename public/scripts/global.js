/* global NAMESPACE
 ==============================================================
 * A script for abstract, reusable functions                 */

const global = function() {

  /* @return {true} if the field is NOT empty
  ============================================================== */
  const fieldNotEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length > 0;
    }
  };

  /* @return {true} if the field is IS empty
  ============================================================== */
  const fieldIsEmpty = function(field) {
    "use strict";
    if(typeof field === "string") {
      console.log("fieldNotEmpty expects form elements such as 'input', 'select', 'textarea'");
      return false;
    }
    else {
      return field.val().length === 0;
    }
  };

  /* Remove element from array by value
  * const myArr = ["one", "two", "three", "four"];
  * rmElemFromArray(myArr, "two");
  ============================================================== */
  const rmElemFromArray = function remove(array, element) {
    "use strict";
    const value = array.indexOf(element);

    if (value !== -1) {
      array.splice(value, 1);
      return true;
    }
    else {
      return false;
    }
  };

  const redirect = function redirect(route) {
    if(window.location.href.includes("localhost")) {
      window.location.href = "http://localhost:3000/"+route;
    }
    else {
      window.location.href = "https://projectboltrenew.azurewebsites.net/"+route;
    }
  };

  const logout = function logout() { 
    sessionStorage.removeItem("projectBoltSessionID");
    window.location.reload();
  };

  return {
    fieldNotEmpty: fieldNotEmpty,
    fieldIsEmpty: fieldIsEmpty,
    rmElemFromArray: rmElemFromArray,
    redirect: redirect,
    logout: logout
  }
}();
//  ============================================================== */