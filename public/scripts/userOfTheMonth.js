const userOfTheMonth = function () {
	const scriptFilename = "userOfTheMonth.js";

	const getUserOfTheMonth = function() {
		return new Promise((resolve, reject) => {
			//if this does not already exist, please use my method
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
						//Generating the needed sql string
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
			//Take current month and +1 it because javascript takes 0 as january
			var currentMonth = currentDate.getMonth() + 1;
			if (currentMonth == 13)
			{
				//if this is out of bounds, please correct
				currentMonth - 1;
			}
			//for testing, this is set to the current month, please set to - 2 if you want the previous one
			var lastmonth = currentMonth - 1;
			if (lastmonth <= 0)
			{
				lastmonth = 1;
			}
			//console.log(lastmonth);
			var tmpdate = new Date(currentDate.getFullYear(), lastmonth, 2, 00, 00, 01);
			//console.log(tmpdate);
			//2 o clock is javascripts way of putting 0 as the active hour (0 = -2, 1 = -1, 2 = 0);
			let monthStart = (new Date(currentDate.getFullYear(), lastmonth, 1, 02, 00, 00)).toSQLOString();
			//console.log(monthStart);
			let monthEnd = (new Date(currentDate.getFullYear(), lastmonth + 1, 0 , 02, 00, 00)).toSQLOString();
			let sessionID = sessionStorage.getItem('projectBoltSessionID');
			//console.log(monthEnd);
			let postData = {
				monthStart: monthStart, 
				monthEnd: monthEnd,
				sessionID: sessionID
			}
			//console.log(postData);
			//sending out the request for data
			function loop (userPostedAnsers) 
			{
				//now work with the given array ^^
				let userOfTheMonthID = userPostedAnsers[0].UserID
				//console.log(userOfTheMonthID);
				return userOfTheMonthID;
			};
			let ansernumberUser = $.post("answers/user-answer-number", postData);
			//Waiting for the promise and taking action
			global.logPromise(ansernumberUser, scriptFilename, "Requesting user answer stats");
			ansernumberUser.then((userPostedAnsers) => {
				resolve(loop(userPostedAnsers));
			}).catch((reason) => {
				reject(reason);
			});
		});
	};	

	return {
		getUserOfTheMonth: getUserOfTheMonth
	}
}();
