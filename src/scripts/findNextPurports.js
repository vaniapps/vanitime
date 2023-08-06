import {hoursToMinutes} from "./durationToMinutes";

function purportsList(booksData, bookName) {
  const purports = [];

  if (bookName === "BG") {
    for (const chapterIndex in booksData["BG"]["parts"]) {
      for (const verse of Object.keys(booksData["BG"]["parts"][chapterIndex]["parts"])) {
        purports.push([
          "BG_" + chapterIndex + "." + verse.slice(1),
          "Bhagavad Gita " + chapterIndex + "." + verse.slice(1),
          booksData["BG"]["parts"][chapterIndex]["parts"][verse]["words_count"],
        ]);
      }
    }
  } else if (bookName === "SB") {
    for (const cantoIndex in booksData["SB"]["parts"]) {
      for (const chapterIndex in booksData["SB"]["parts"][cantoIndex]["parts"]) {
        for (const verse in booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"]) {
          purports.push([
            "SB_" + cantoIndex + "." + chapterIndex + "." + verse.slice(1),
            "Srimad Bhagavatam " + cantoIndex + "." + chapterIndex + "." + verse.slice(1),
            booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"][verse]["words_count"],
          ]);
        }
      }
    }
  } else if (bookName === "CC") {
    for (const lila in booksData["CC"]["parts"]) {
      for (const chapterIndex in booksData["CC"]["parts"][lila]["parts"]) {
        for (const verse in booksData["CC"]["parts"][lila]["parts"][chapterIndex]["parts"]) {
          purports.push([
            "CC_" + lila + "_" + chapterIndex + "." + verse.slice(1),
            "Caitanya Caritamrta " + lila + "." + chapterIndex + "." + verse.slice(1),
            booksData["CC"]["parts"][lila]["parts"][chapterIndex]["parts"][verse]["words_count"],
          ]);
        }
      }
    }
  }

  return purports;
}

function findNextPurports(booksMap, currentBook, vaniTime, wordsPerMin = 50) {
  let startingPurport=currentBook["name"]+"_"+currentBook["part"]+ (currentBook["name"]=="CC" ? "_" : ".") + currentBook["sub_part"] + (currentBook["sub_part"] ? "." : "")+currentBook["verse"]
  console.log(startingPurport)
  const purportList = purportsList(booksMap, startingPurport.split("_")[0]);
  let totalWords = wordsPerMin * hoursToMinutes(vaniTime);
  let wordsSumSoFar = 0;
  const startingIndex = purportList.findIndex(purport => purport[0] === startingPurport);
  if (startingIndex === -1) {
    console.error("Starting purport not found.");
    return [];
  }

  let currentIndex = startingIndex;
  const selectedPurports = [];
  selectedPurports.push(purportList[currentIndex])
  wordsSumSoFar += purportList[currentIndex][2];
  currentIndex++;
  while (wordsSumSoFar < totalWords && currentIndex < purportList.length) {
    if(wordsSumSoFar+purportList[currentIndex][2] > totalWords) break 
    selectedPurports.push(purportList[currentIndex]);
    wordsSumSoFar += purportList[currentIndex][2];
    currentIndex++;
  }
	console.log(selectedPurports);
  return selectedPurports;
}

export function findNextPurport(booksMap, currentVerse) {
  let startingPurport=currentVerse
  const purportList = purportsList(booksMap, startingPurport.split("_")[0]);
  const startingIndex = purportList.findIndex(purport => purport[0] === startingPurport);
  if (startingIndex === -1) {
    console.error("Starting purport not found.");
    return "";
  }

  let currentIndex = startingIndex;
  if(currentIndex == purportList.length - 1) return ""
  return purportList[currentIndex+1][0]
}

export function findPreviousPurport(booksMap, currentVerse) {
  let startingPurport=currentVerse
  const purportList = purportsList(booksMap, startingPurport.split("_")[0]);
  const startingIndex = purportList.findIndex(purport => purport[0] === startingPurport);
  if (startingIndex === -1) {
    console.error("Starting purport not found.");
    return "";
  }

  let currentIndex = startingIndex;
  if(currentIndex == 0) return ""
  return purportList[currentIndex-1][0]
}

export default findNextPurports;
