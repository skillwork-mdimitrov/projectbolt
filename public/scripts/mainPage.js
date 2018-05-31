/* JSHint quality control
 ============================================================== */
/*jshint esversion: 6 */
/*jslint devel: true*/
/*globals unfoldingHeader, global, $:false*/

/* mainPage NAMESPACE
 ============================================================== */
const mainPage = function() {
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
  mainPage.askQuestionBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.questionListBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.userProfileBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.aboutPageBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.logoutBtn.on("click", () => global.logout());
});