/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* index NAMESPACE
 ============================================================== */
const index = function() {
  "use strict";
  // DOM selectors
  const askQuestionBtn = $('#askQuestionBtn');
  const questionListBtn = $('#questionListBtn');
  const userProfileBtn = $('#userProfileBtn');
  const aboutPageBtn = $('#aboutPageBtn');
  const logoutBtn = $('#logoutBtn');

  return {
    askQuestionBtn: askQuestionBtn,
    questionListBtn: questionListBtn,
    userProfileBtn: userProfileBtn,
    aboutPageBtn: aboutPageBtn,
    logoutBtn: logoutBtn
  };
}();
// ============================================================== */

$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
  ============================================================== */
  index.askQuestionBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  index.questionListBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  index.userProfileBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  index.aboutPageBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  index.logoutBtn.on("click", () => global.logout());
});