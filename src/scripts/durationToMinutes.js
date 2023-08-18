export function minutesToMinutes(duration,extraInfo=null){
	// remove extraInfo later
	let minutes = 0;
	// console.log(duration);
	let time = duration.split(":");
	minutes += parseInt(time[0]);
	// if(isNaN(minutes))
	// console.log(duration,extraInfo);
	return minutes;
}

export function hoursToMinutes(duration,extraInfo=null){
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

export function formatMinutes(duration) {
	if(duration == 0) return "0m"
	if (duration < 60) {
		return `${duration < 10 ? "0" : ""}${duration}m`;
	  } else if (duration >= 60 && duration < 1440) {
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;
		return `${hours < 10 ? "0" : ""}${hours}h:${minutes < 10 ? "0" : ""}${minutes}m`;
	  } else {
		const days = Math.floor(duration / 1440);
		const remainingMinutes = duration % 1440;
		const hours = Math.floor(remainingMinutes / 60);
		const minutes = remainingMinutes % 60;
		return `${days}d:${hours < 10 ? "0" : ""}${hours}h:${minutes < 10 ? "0" : ""}${minutes}m`;
	  }
  }

  export function formatMinutes2(duration) {
	if(duration == 0) return "0 Minutes"
	if (duration < 60) {
		return `${duration < 10 ? "0" : ""}${duration} Minutes`;
	  } else if (duration >= 60 && duration < 1440) {
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;
		return `${hours < 10 ? "0" : ""}${hours} H ${minutes < 10 ? "0" : ""}${minutes} M`;
	  } else {
		const days = Math.floor(duration / 1440);
		const remainingMinutes = duration % 1440;
		const hours = Math.floor(remainingMinutes / 60);
		const minutes = remainingMinutes % 60;
		return `${days} D ${hours < 10 ? "0" : ""}${hours} H ${minutes < 10 ? "0" : ""}${minutes} M`;
	  }
  }

  export function formatMinutes3(duration) {
	if(duration == 0) return "0m"
	if (duration < 60) {
		return `${duration < 10 ? "0" : ""}${duration}m`;
	  } else {
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;
		return `${hours < 10 ? "0" : ""}${hours}h ${minutes < 10 ? "0" : ""}${minutes}m`;
	  }
  }

export function convertTo12HourFormat(time24) {
	const [hours, minutes] = time24.split(":");
  	const parsedHours = parseInt(hours);
  
  if (parsedHours === 0) {
    return `12:${minutes.padStart(2, "0")} AM`;
  } else if (parsedHours < 12) {
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")} AM`;
  } else if (parsedHours === 12) {
    return `12:${minutes.padStart(2, "0")} PM`;
  } else {
    const twelveHourFormat = parsedHours - 12;
    return `${twelveHourFormat.toString().padStart(2, "0")}:${minutes.padStart(2, "0")} PM`;
  }
  }

export default minutesToMinutes