import {hoursToMinutes} from "./durationToMinutes"; 

function purportsList(booksData) {
  let books = [];
  if (booksData["BG"]["checked"] != "false") {
    let purports = [];
    for (const chapterIndex in booksData["BG"]["parts"]) {
      if (booksData["BG"]["parts"][chapterIndex]["checked"] != "false") {
        for (const verse in booksData["BG"]["parts"][chapterIndex]["parts"]) {
          purports.push([
            "BG_" + chapterIndex + "." + verse.slice(1),
            "Bhagavad Gita " + chapterIndex + "." + verse.slice(1),
            booksData["BG"]["parts"][chapterIndex]["parts"][verse]["words_count"],
          ]);
        }
      }
    }
    books.push(purports);
  } if (booksData["SB"]["checked"] != "false") {
    let purports = [];
    for (const cantoIndex in booksData["SB"]["parts"]) {
      if (booksData["SB"]["parts"][cantoIndex]["checked"] != "false") {
        for (const chapterIndex in booksData["SB"]["parts"][cantoIndex]["parts"]) {
          if (booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["checked"] != "false") {
            for (const verse in booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"]) {
              purports.push([
                "SB_" + cantoIndex + "." + chapterIndex + "." + verse.slice(1),
                "Srimad Bhagavatam " + cantoIndex + "." + chapterIndex + "." + verse.slice(1),
                booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"][verse]["words_count"],
              ]);
            }
          }
        }
      }
    }
    books.push(purports);
  } if (booksData["CC"]["checked"] != "false") {
    let purports = [];
    for (const lila in booksData["CC"]["parts"]) {
      if (booksData["CC"]["parts"][lila]["checked"] != "false") {
        for (const chapterIndex in booksData["CC"]["parts"][lila]["parts"]) {
          if (booksData["CC"]["parts"][lila]["parts"][chapterIndex]["checked"] != "false") {
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
    }
    books.push(purports);
  }
  return books[Math.floor(Math.random() * books.length)];
}

function findRandomPurports(booksMap, vaniTime, wordsPerMin = 50) {
  let counter = 0;
  const purportList = purportsList(booksMap);
	if(purportList.length==0) return []
	vaniTime = hoursToMinutes(vaniTime);
  let totalWords = wordsPerMin * vaniTime;
  while (true) {
    let start = Math.floor(Math.random() * purportList.length);
    if (counter == 20) {
      start = 0;
    }
    let wordsSumSoFar = purportList[start][2];
    let purports = [];
    purports.push(purportList[start])
    start += 1;
    while (wordsSumSoFar <= totalWords && start < purportList.length) {
      if(wordsSumSoFar+purportList[start][2] > totalWords) break 
      wordsSumSoFar += purportList[start][2];
      purports.push(purportList[start]);
      start += 1;
    }
    if ((wordsSumSoFar >= (totalWords - wordsPerMin*5) && wordsSumSoFar<=totalWords) || counter == 20) {
      return purports;
    }
    counter++;
  }
}

export default findRandomPurports;
