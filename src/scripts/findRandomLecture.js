import {minutesToMinutes, hoursToMinutes} from "./durationToMinutes.js";

function generateLectures(lectureMap,vaniTime){
	let lectures = [];
	for(const topic in lectureMap){
		if(lectureMap[topic]["checked"] != "false")
		{
			for(const lecture in lectureMap[topic]["parts"]){
				{
					if(!lectureMap[topic]["parts"][lecture]["read"]){
						let currTime = minutesToMinutes(lectureMap[topic]["parts"][lecture]["duration"]);
						if (vaniTime-currTime >=0 && vaniTime-currTime<5) {
							lectures.push([lecture,lectureMap[topic]["parts"][lecture]["name"],currTime])
						}
					}
				}
			}
		}
	}
	return lectures
}

function generateAllLectures(lectureMap){
	let lectures = [];
	for(const topic in lectureMap){
		if(lectureMap[topic]["checked"] != "false")
		{
			for(const lecture in lectureMap[topic]["parts"]){
				{
					if(!lectureMap[topic]["parts"][lecture]["read"]){
						let currTime = minutesToMinutes(lectureMap[topic]["parts"][lecture]["duration"]);
						lectures.push([lecture,lectureMap[topic]["parts"][lecture]["name"],currTime])
					}
				}
			}
		}
	}
	return lectures;
}

function binarySearch(arr, target) {
	let left = 0;
	let right = arr.length - 1;
  
	while (left <= right) {
	  const mid = Math.floor((left + right) / 2);
	  const value = arr[mid][2];
  
	  if (value === target) {
		return arr[mid];
	  } else if (value < target) {
		left = mid + 1;
	  } else {
		right = mid - 1;
	  }
	}

	if(arr[left][2] < target) return arr[left]
	if(left != 0) return arr[left-1]
	return arr[left]
}


const findRandomLecture = (lectureMap,vaniTime) => {
	vaniTime = hoursToMinutes(vaniTime); 
	let lectures = generateLectures(lectureMap,vaniTime);
	if(lectures.length==0) {
		lectures = generateAllLectures(lectureMap);
		if(lectures.length == 0) return[]
		lectures.sort((a, b) => a[2] - b[2]);
		return binarySearch(lectures, vaniTime)
	}
	return lectures[Math.floor(Math.random() * lectures.length)]
};


export default findRandomLecture;
