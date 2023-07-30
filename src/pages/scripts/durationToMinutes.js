function durationToMinutes(duration,extraInfo=null){
	// remove extraInfo later
	let minutes = 0;
	// console.log(duration);
	let time = duration.split(":");
	minutes += parseInt(time[0])*60;
	minutes += parseInt(time[1]);
	// if(isNaN(minutes))
	// console.log(duration,extraInfo);
	return minutes;
}
export default durationToMinutes;