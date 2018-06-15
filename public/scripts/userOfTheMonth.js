const userOfTheMonth = function () {
	const getUserOfTheMonth = function() {
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
		let ansernumberUser = $.post("answer/user-answer-number", monthStart, monthEndDay);
		ansernumberUser.then((userPostedAnsers) => {
			console.out(userPostedAnsers);
		}).catch(() => {
			console.log("SOMETHING WENT WRONG!!!!");
		});
	};	

	return {
		getUserOfTheMonth: getUserOfTheMonth
	}
}();

