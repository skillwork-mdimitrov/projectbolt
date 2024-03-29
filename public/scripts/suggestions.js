/* suggestions NAMESPACE
 ============================================================== */
const suggestions = function() {  
    const scriptFilename = "suggestions.js";
    // ID of the query input field 
    const inputId = "questionBox";

    // Minimum similarity before adding to suggestions
    const minimumSuggestionSimilarity = 0.30;
    // Maximum similarity before blocking from insert
    const maximumQuestionSimilarity = 0.80;
    const maximumAnswerSimilarity = 0.75;

    // The element that dynamically shows suggestions to user
    let autoCompleter;
    let busyUpdatingSuggestions = false;

    const initAutoComplete = function() {        
        autoCompleter = new Awesomplete(document.getElementById(inputId), {
            minChars: 1,
            sort: false,
            filter: function (text, input)
            {
                return true;    // This disables the filter functionality
            }
        });

        $("#"+inputId).on("input", function() {
            if ($("#"+inputId).val().length > 0)
            {
                updateSuggestions();
            }        
        });
    };

    const getNewSuggestions = function(query) {
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem('projectBoltSessionID');
            let newSuggestions = [];
            
            busyUpdatingSuggestions = true;
            let getQuestionSimilaritiesPromise = $.post("questions/get-similarity", { query: query, sessionID: sessionID });
            global.logPromise(getQuestionSimilaritiesPromise, scriptFilename, "Requesting question similarity ratings");

            getQuestionSimilaritiesPromise.then((similarities) => {
                // Sort the suggestions in descending order based on similarity rating
                let sortedSimilarities = similarities.ratings.sort(function(a, b) {
                    return b.rating - a.rating;
                });
                
                $.each( sortedSimilarities, function( index, value ) {
                    if (value.rating > minimumSuggestionSimilarity) {
                        newSuggestions.push(value.target);
                    }                    
                });  
            }).catch(() => {    
                newSuggestions.push("Error retrieving suggestions");
            }).always(() => {
                resolve(newSuggestions);
                busyUpdatingSuggestions = false;
            });
        });
    };

    const getBestQuestionSimilarity = function(query) {
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem('projectBoltSessionID');
            
            let getQuestionSimilaritiesPromise = $.post("questions/get-similarity", { query: query, sessionID: sessionID });
            global.logPromise(getQuestionSimilaritiesPromise, scriptFilename, "Requesting question similarity ratings");

            getQuestionSimilaritiesPromise.then((similarities) => {     
                resolve(similarities.bestMatch);                
            }).catch(() => {    
                reject();
            });
        });
    }

    const getBestAnswerSimilarity = function(query, questionID) {
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem('projectBoltSessionID');
            
            let getAnswerSimilaritiesPromise = $.post("answers/get-similarity", { query: query, questionID: questionID, sessionID: sessionID });
            global.logPromise(getAnswerSimilaritiesPromise, scriptFilename, "Requesting answer similarity ratings");

            getAnswerSimilaritiesPromise.then((similarities) => {                
                resolve(similarities.bestMatch);
            }).catch(() => {    
                reject();
            });
        });
    }

    const updateSuggestions = function() {     
        if (!busyUpdatingSuggestions) {
            getNewSuggestions($("#"+inputId).val()).then((newSuggestions) => {
                autoCompleter.list = newSuggestions;
                autoCompleter.evaluate(); 
            });  
        }           
    };

    return {
        inputId: inputId,
        minimumSuggestionSimilarity: minimumSuggestionSimilarity,
        maximumQuestionSimilarity: maximumQuestionSimilarity,
        maximumAnswerSimilarity: maximumAnswerSimilarity,
        initAutoComplete: initAutoComplete,
        getBestQuestionSimilarity: getBestQuestionSimilarity,
        getBestAnswerSimilarity: getBestAnswerSimilarity,
        updateSuggestions: updateSuggestions
    }
}();