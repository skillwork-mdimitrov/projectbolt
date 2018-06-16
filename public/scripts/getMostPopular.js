
//Get the most Popular question
const getMostPopular = function () {
    let sessionID = sessionStorage.getItem('projectBoltSessionID');
    let getMostPopularQuestions = function() {
        return new Promise(function(resolve, reject) {
            $.getJSON("questions/get-most-popular/" + sessionID, function () {})
            .done(function (data) {
                resolve(data);
            })
            .fail(function (jqXHR) {
                unfoldingHeader.unfoldHeader("Failed to load the top 10 questions", "red");
                global.logAJAXErr(jqXHR);
                reject();
            });
        });

    };

    return {
        getMostPopularQuestions: getMostPopularQuestions
    }
}();