import durationToMinutes from "./durationToMinutes";
function purpotsList(booksData,vaniTime,wordsPerMin){
	let purports = [];
	let vaniTimeMinutes = durationToMinutes(vaniTime);
	// if(booksData["BG"]["checked"]!="false")
	// {
	// 	// loop through
	// 	for(const chapterIndex in booksData["BG"]["parts"])
	// 	{
	// 		if(booksData["BG"]["parts"][chapterIndex][])
	// 	}
	// }
}
function findRandomPurports(booksMap,vaniTime,wordsPerMin = 150){
	const purportList = purpotsList(booksMap,vaniTime,wordsPerMin);
	const randomPurport = purportList[Math.floor(Math.random() * purportList.length)];
	return randomPurport;
}
export default findRandomPurports;
