import {minutesToMinutes} from "./durationToMinutes.js";

function generateLectures(lectureMap,vaniTime){
	let lectures = [];
	let vaniTimeMinutes = minutesToMinutes(vaniTime); 
	for(const topic in lectureMap){
		if(lectureMap[topic]["checked"] != "false")
		{
			for(const lecture in lectureMap[topic]["parts"]){
				{
					if(!lecture["read"]){
						let currTime = minutesToMinutes(lectureMap[topic]["parts"][lecture]["duration"]);
						if (Math.abs(currTime-vaniTimeMinutes)<5) {
							console.log(currTime, vaniTime, Math.abs(currTime-vaniTimeMinutes)) 
							lectures.push([lecture,lectureMap[topic]["parts"][lecture]["name"],currTime])
						}
					}
				}
			}
		}
	}
	return lectures;
}


const findRandomLecture = (lectureMap,vaniTime) => {
	let lectures = generateLectures(lectureMap,vaniTime);
	if(lectures.length==0)
	{
		throw new Error("No lectures found");
		return [];
	}
	const randomLecture = lectures[Math.floor(Math.random() * lectures.length)];
	return randomLecture;
};


export default findRandomLecture;
