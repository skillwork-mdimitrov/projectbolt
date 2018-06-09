/* suggestions NAMESPACE
 ============================================================== */
const suggestions = function() {  
    // ID of the query input field 
    const inputId = "questionBox";

    // Minimum similarity before adding to suggestions
    const minimumSuggestionSimilarity = 0.50;
    // Maximum similarity before blocking from insert
    const maximumQuestionSimilarity = 0.80;

    // The element that dynamically shows suggestions to user
    let autoCompleter;

    const initAutoComplete = function() {
        autoCompleter = new Awesomplete(document.getElementById(inputId), {
            minChars: 1,
            sort: false,
            filter: function (text, input)
            {
                return true;    // This disables the filter functionality
            }
        });
    };

    const getNewSuggestions = function(query) {
        return new Promise((resolve, reject) => {
            let sessionID = sessionStorage.getItem('projectBoltSessionID');
            let newSuggestions = [];
            
            $.post("questions/get-similarity", { query: query, sessionID: sessionID }, function() {})
            .done(function(similarities) {
                // Sort the suggestions in descending order based on similarity rating
                let sortedSimilarities = similarities.ratings.sort(function(a, b) {
                    return b.rating - a.rating;
                });
                
                $.each( sortedSimilarities, function( index, value ) {
                    if (value.rating > minimumSuggestionSimilarity) {
                        newSuggestions.push(value.target);
                    }                    
                });  
                
                resolve(newSuggestions);
            })
            .fail(function(message) {                 
                reject(message.responseText);
            })
        });
    };

    const updateSuggestions = function() {        
        getNewSuggestions($("#"+inputId).val()).then((newSuggestions) => {
            autoCompleter.list = newSuggestions;
            autoCompleter.evaluate(); 
        }).catch((reason) => {
            unfoldingHeader.unfoldHeader("Failed aqcuiring new suggestions, see console for details", "red", true);
            console.log("Failed aqcuiring new suggestions: " + reason);  
        });   
    };

    return {
        inputId: inputId,
        minimumSuggestionSimilarity: minimumSuggestionSimilarity,
        maximumQuestionSimilarity: maximumQuestionSimilarity,
        initAutoComplete: initAutoComplete,
        updateSuggestions: updateSuggestions
    }
}();

$(document).ready(function() {
    suggestions.initAutoComplete();

    // On every addition to the input field, update the suggestions
    $("#"+suggestions.inputId).on("input", function() {
        if ($("#"+suggestions.inputId).val().length > 0)
        {
            suggestions.updateSuggestions();
        }        
    });
});


