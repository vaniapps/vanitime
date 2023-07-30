import durationToMinutes from "./durationToMinutes.js";

function generateLectures(lectureMap,vaniTime){
	let lectures = [];
	let vaniTimeMinutes = durationToMinutes(vaniTime);
	for(const topic in lectureMap){
		if(lectureMap[topic]["checked"] != "false")
		{
			for(const lecture in lectureMap[topic]["parts"]){
				{
					let currTime = durationToMinutes(lectureMap[topic]["parts"][lecture]["duration"]);
					if(Math.abs(currTime-vaniTimeMinutes)<3)// 3 minutes tolerance
						lectures.push([lecture,lectureMap[topic]["parts"][lecture]["name"],currTime]);
				}
			}
		}
	}
	return lectures;
}


const findRandomLecture = (lectureMap,vaniTime) => {
	let lectures = generateLectures(lectureMap,vaniTime);
	// console.log(lectures[0]);
	// for(var x of lectures)
	// {
	// 	if(isNaN(x[2]))
	// 	{
	// 		console.log(x);
	// 	}
	// }
	if(lectures.length==0)
	{
		throw new Error("No lectures found");
		return [];
	}
	const randomLecture = lectures[Math.floor(Math.random() * lectures.length)];
	return randomLecture;
	// return ["761017_-_Lecture_and_Conversation_at_Rotary_Club_-_Chandigarh", "Let Krishna Speak for Himself", 58];
};


export default findRandomLecture;
