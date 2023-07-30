
function durationToMinutes(duration,extraInfo){
	// remove extraInfo later
	let minutes = 0;
	let time = duration.split(":");
	minutes += parseInt(time[0])*60;
	minutes += parseInt(time[1]);
	// if(isNaN(minutes))
	// console.log(duration,extraInfo);
	return minutes;
}
function generateLectures(lectureMap){
	let lectures = [];
	for(const topic in lectureMap){
		if(lectureMap[topic]["checked"] == "true")
		{
			for(const lecture in lectureMap[topic]["parts"]){
				lectures.push([lecture,lectureMap[topic]["parts"][lecture]["name"],durationToMinutes(lectureMap[topic]["parts"][lecture]["duration"],lectureMap[topic]["parts"][lecture])]);
			}
		}
	}
	return lectures;
}


const findRandomLecture = (lectureMap) => {
	let lectures = generateLectures(lectureMap);
	// console.log(lectures[0]);
	// for(var x of lectures)
	// {
	// 	if(isNaN(x[2]))
	// 	{
	// 		console.log(x);
	// 	}
	// }
	const randomLecture = lectures[Math.floor(Math.random() * lectures.length)];
	return randomLecture;
	// return ["761017_-_Lecture_and_Conversation_at_Rotary_Club_-_Chandigarh", "Let Krishna Speak for Himself", 58];
};


export default findRandomLecture;
