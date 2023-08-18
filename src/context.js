import React, { createContext, useEffect, useState } from "react";
import { useLocal } from "./lshooks";
import booksMapData from "./data/booksMap.json";
import lecturesMapData from "./data/lecturesMap.json";

export const UserHistory = createContext()
export const Lectures = createContext()
export const Books = createContext()
export const WordsPerMin = createContext()
export const IncompleteUserHistory = createContext()
export const CurrentBook = createContext()
export const VaniTime = createContext()
export const ContentMode = createContext()
export const Bookmarks = createContext()
export const LecturesTime = createContext()

export function ContextProvider({ children }) {
    const [userHistory, setUserHistory] = useLocal("user-history", {})
    const [booksMap, setBooksMap] = useLocal("books-data",booksMapData)
    const [lecturesMap, setLecturesMap] = useLocal("lectures-data",lecturesMapData)
    const [wordsPerMin, setWordsPerMin] = useLocal("words-per-min",50)
    const [incompleteUserHistory, setIncompleteUserHistory] = useLocal("incomplete-userhistory",false)
    let [currentBook, setCurrentBook] = useLocal("current-book",{
        "name": "",
        "part": "",
        "sub_part": "",
        "verse": ""
    })
    const [vaniTime, setVaniTime] = useLocal("vani-time","00:05")
    const [contentMode, setContentMode] = useLocal("content-mode","random_audio");
    const [bookmarksMap, setBookmarksMap] = useLocal("bookmarks", {})
    const [lecturesTime, setLecturesTime] = useLocal("lectures-time", {"heard": 0, "total": 0})
    

    return (
        <UserHistory.Provider value={[userHistory, setUserHistory]}>
        <Lectures.Provider value={[lecturesMap, setLecturesMap]}>
        <Books.Provider value={[booksMap, setBooksMap]}>
        <WordsPerMin.Provider value={[wordsPerMin, setWordsPerMin]}>
        <IncompleteUserHistory.Provider value={[incompleteUserHistory, setIncompleteUserHistory]}>
        <CurrentBook.Provider value={[currentBook, setCurrentBook]}>
        <VaniTime.Provider value={[vaniTime, setVaniTime]}>
        <ContentMode.Provider value={[contentMode, setContentMode]}>
        <Bookmarks.Provider value={[bookmarksMap, setBookmarksMap]}>
        <LecturesTime.Provider value={[lecturesTime, setLecturesTime]}>
            {children}
        </LecturesTime.Provider>
        </Bookmarks.Provider>
        </ContentMode.Provider>
        </VaniTime.Provider>
        </CurrentBook.Provider>
        </IncompleteUserHistory.Provider>
        </WordsPerMin.Provider>
        </Books.Provider>
        </Lectures.Provider>
        </UserHistory.Provider>
    )
}