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
            booksData["BG"]["parts"][chapterIndex]["parts"][verse]["wc"],
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
                booksData["SB"]["parts"][cantoIndex]["parts"][chapterIndex]["parts"][verse]["wc"],
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
                booksData["CC"]["parts"][lila]["parts"][chapterIndex]["parts"][verse]["wc"],
              ]);
            }
          }
        }
      }
    }
    books.push(purports);
  } if (booksData["OB"]["checked"] != "false") {
    let purports = [];
    for (const bookName in booksData["OB"]["parts"]) {
      if (booksData["OB"]["parts"][bookName]["checked"] != "false") {
        for (const chapterName in booksData["OB"]["parts"][bookName]["parts"]) {
          purports.push([
            chapterName.slice(1),
            chapterName.slice(1),
            booksData["OB"]["parts"][bookName]["parts"][chapterName]["wc"],
          ]);
        }
      }
    }
    books.push(purports);
  }
  console.log(books.length, Math.floor(Math.random() * books.length))
  return books[Math.floor(Math.random() * books.length)];
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

	if(left<=0) return arr[0]
	if(left >= arr.length-1) return arr[arr.length-1]


	if(arr[left][2] < target) return arr[left]
	return arr[left-1]

}

function findRandomPurports(booksMap, vaniTime, wordsPerMin = 50) {
  let counter = 0;
  const purportList = purportsList(booksMap);
  console.log(purportList)
	if(!purportList || purportList.length==0) return []
	vaniTime = hoursToMinutes(vaniTime);
  let totalWords = wordsPerMin * vaniTime;
  while (true) {
    let start = Math.floor(Math.random() * purportList.length);
    let purports = [];
    if (counter == 20) {
      console.log("linit execed")
      console.log(purportList)
      purportList.sort((a, b) => a[2] - b[2]);
      purports.push(binarySearch(purportList, totalWords))
      return purports;
    }
    let wordsSumSoFar = purportList[start][2];
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
