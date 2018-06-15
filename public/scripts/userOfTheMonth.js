const userOfTheMonth = function () {
	const scriptFilename = "userOfTheMonth.js";

	const getUserOfTheMonth = function() {
		return new Promise((resolve, reject) => {
			if (!Date.prototype.toSQLString) 
			{
				//Run function if the default doesn't exist
				(
					function() 
					{
						//Padding out the month / date / hours and minutes
						function pad(number) 
						{
							if (number < 10) 
							{
								return '0' + number;
							}
							return number;
						}
						//generating output string
						Date.prototype.toSQLOString = function() 
						{
							return pad(this.getUTCMonth() + 1) +
								'-' + pad(this.getUTCDate()) +
								'-' + this.getUTCFullYear() +
								' ' + pad(this.getUTCHours()) +
								':' + pad(this.getUTCMinutes());
						};
					}()
				);
			}
			//save date
			var currentDate = new Date();
			var currentMonth = currentDate.getMonth() + 1;
			if (currentMonth == 13)
			{
				currentMonth - 1;
			} 
			var lastmonth = currentMonth - 1;
			if (lastmonth == 0)
			{
				lastmonth = 1;
			}
			var monthEndDay = new Date(currentDate.getYear, lastmonth + 1, 0);
			let monthStart = (new Date(currentDate.getYear, lastmonth, 1, 00, 00, 00)).toSQLOString();
			let monthEnd = (new Date(currentDate.getYear, lastmonth, monthEndDay, 00, 00, 00)).toSQLOString();
			let sessionID = sessionStorage.getItem('projectBoltSessionID');

			let postData = {
				monthStart: monthStart, 
				monthEnd: monthEnd,
				sessionID: sessionID
			}

			let ansernumberUser = $.post("answers/user-answer-number", postData);
			global.logPromise(ansernumberUser, scriptFilename, "Requesting user answer stats");

			ansernumberUser.then((userPostedAnsers) => {
				resolve(userPostedAnsers);
			}).catch((reason) => {
				reject(reason);
			});
		});
	};	

	return {
		getUserOfTheMonth: getUserOfTheMonth
	}
}();

