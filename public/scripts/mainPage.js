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
  const questionsTable = $('#questionsTable');
  const searchContainer = $('#searchContainer');
  const askQuestionBtn = $('#askQuestionBtn');
  const questionListBtn = $('#questionListBtn');
  const userProfileBtn = $('#userProfileBtn');
  const aboutPageBtn = $('#aboutPageBtn');
  const logoutBtn = $('#logoutBtn');

  // Remove the black background from all navigation bar items
  const rmBgNavBar = () => {
    $('.nav ul li').removeClass("blackBg");
  };

  return {
    questionsTable: questionsTable,
    searchContainer: searchContainer,
    askQuestionBtn: askQuestionBtn,
    questionListBtn: questionListBtn,
    userProfileBtn: userProfileBtn,
    aboutPageBtn: aboutPageBtn,
    logoutBtn: logoutBtn,

    rmBgNavBar: rmBgNavBar
  };
}();
// ============================================================== */

$(document).ready(function() {
  "use strict";
  /* ATTACH EVENT LISTENERS
  ============================================================== */

  // On 'Ask a question' button click, fade out the questions table and when done, fade in the searching functionality
  mainPage.askQuestionBtn.on("click", () =>
    mainPage.questionsTable.fadeOut("fast", () => {
      mainPage.searchContainer.fadeIn("fast");

      // Clear nav bar bg colours and set black for this button
      (() => {
        mainPage.rmBgNavBar();
        mainPage.askQuestionBtn.addClass("blackBg");
      })();
    })
  );

  // On 'Questions list' button click, fade out the searching and when done, fade in the questions table
  mainPage.questionListBtn.on("click", () => {
    mainPage.searchContainer.fadeOut("fast", () =>
      mainPage.questionsTable.fadeIn("fast", () =>
        mainPage.questionsTable.css("display", "flex"))); // cuz fadeIn sets it displays to block);

        // Clear nav bar bg colours and set black for this button
        (() => {
          mainPage.rmBgNavBar();
          mainPage.questionListBtn.addClass("blackBg");
        })();
  });

  mainPage.userProfileBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.aboutPageBtn.on("click", () => unfoldingHeader.unfoldHeader('To be implemented', 'orange'));

  mainPage.logoutBtn.on("click", () => global.logout());
});