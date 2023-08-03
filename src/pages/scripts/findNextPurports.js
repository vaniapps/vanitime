import {hoursToMinutes} from "./durationToMinutes";

function purportsList(booksData, bookName) {
  const purports = [];

  if (bookName === "BG") {
    for (const chapterIndex in booksData["BG"]["parts"]) {
      for (const verse in booksData["BG"]["parts"][chapterIndex]["parts"]) {
        purports.push([
          "BG_" + chapterIndex + "." + verse,
          "Bhagavad Gita " + chapterIndex + "." + verse,
          booksData["BG"]["parts"][chapterIndex]["parts"][verse]["words_count"],
        ]);
      }
    }
  } else if (bookName === "SB") {
    for (const cantoIndex in booksData["SB"]["parts"]) {
      for (const chapterIndex in booksData["SB"]["parts"][cantoIndex]["parts"]) {
        for (const verse in booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"]) {
          purports.push([
            "SB_" + cantoIndex + "." + chapterIndex + "." + verse,
            "Srimad Bhagavatam " + cantoIndex + "." + chapterIndex + "." + verse,
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
            "CC_" + lila + "." + chapterIndex + "." + verse,
            "Caitanya Caritamrta " + lila + "." + chapterIndex + "." + verse,
            booksData["CC"]["parts"][lila]["parts"][chapterIndex]["parts"][verse]["words_count"],
          ]);
        }
      }
    }
  }

  return purports;
}

function findNextPurports(booksMap, startingPurport, vaniTime, wordsPerMin = 50) {
  const purportList = purportsList(booksMap, startingPurport.split("_")[0]);
  let totalWords = wordsPerMin * hoursToMinutes(vaniTime);
  let wordsSumSoFar = 0;
  const startingIndex = purportList.findIndex(purport => purport[0] === startingPurport);
	console.log(startingIndex,purportList[startingIndex]);
  if (startingIndex === -1) {
    console.error("Starting purport not found.");
    return [];
  }

  let currentIndex = startingIndex;
  const selectedPurports = [];

  while (wordsSumSoFar < totalWords && currentIndex < purportList.length) {
    selectedPurports.push(purportList[currentIndex]);
    wordsSumSoFar += purportList[currentIndex][2];
    currentIndex++;
  }
	console.log(selectedPurports);
  return selectedPurports;
}

export default findNextPurports;
