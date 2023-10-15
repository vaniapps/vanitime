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
export const MediaFavorites = createContext()
export const LecturesTime = createContext()
export const CheckAlerts = createContext()
export const CurrentVersesMap = createContext()
export const CurrentLecture = createContext()
export const Settings = createContext()
export const Goal = createContext()

export function ContextProvider({ children }) {
    const [userHistory, setUserHistory] = useLocal("user-history", {})
    const [booksMap, setBooksMap] = useLocal("books-data",booksMapData)
    const [lecturesMap, setLecturesMap] = useLocal("lectures-data",lecturesMapData)
    const [wordsPerMin, setWordsPerMin] = useLocal("words-per-min",100)
    const [incompleteUserHistory, setIncompleteUserHistory] = useLocal("incomplete-userhistory","")
    let [currentBook, setCurrentBook] = useLocal("current-book",{
        "name": "",
        "part": "",
        "sub_part": "",
        "verse": ""
    })
    const [vaniTime, setVaniTime] = useLocal("vani-time","00:05")
    const [contentMode, setContentMode] = useLocal("content-mode","random_audio");
    const [bookmarksMap, setBookmarksMap] = useLocal("bookmarks", {
        "Read-Later": {"children": [], "isChecked": false},
        "Default-bookmarks": {"children": [], "isChecked": false},
        "Default-highlights": {"children": [], "isChecked": false},
        "Default-notes": {"children": [], "isChecked": false}
    })
    const [mediaFavoritesMap, setMediaFavoritesMap] = useLocal("media-favorites",{})
    const [lecturesTime, setLecturesTime] = useLocal("lectures-time", {"heard": 0, "total": 0})
    const [checkAlerts, setCheckAlerts] = useLocal("check-alerts", {"purports": false, "lecture": false})
    const [currentVersesMap, setCurrentVersesMap] = useLocal("current-verses-map", {})
    const [currentLecture, setCurrentLecture] = useLocal("current-lecture", "")
    const [settings, setSettings] = useLocal("settings", {
        "theme": "light",
        "font_style": "Arial, Helvetica, sans-serif",
        "font_size": "16",
        "check_alerts": "manual",
        "highlights_color": "#66B2FF",
        "highlights_folder": "Default-highlights",
        "notes_folder": "Default-notes",
        "bookmarks_folder": "Default-bookmarks",
        "bookmark_type": "Read-Later",
        "home_page": "vanitime"
    })
    const [goal, setGoal] = useLocal("goal", {
        "books" : {
                    "day": -1,
                    "week": -1,
                    "month": -1
                },
        "lectures": {
            "day": -1,
            "week": -1,
            "month": -1
        }
    })
    

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
        <CheckAlerts.Provider value={[checkAlerts, setCheckAlerts]}>
        <CurrentVersesMap.Provider value={[currentVersesMap, setCurrentVersesMap]}>
        <CurrentLecture.Provider value={[currentLecture, setCurrentLecture]}>
        <Settings.Provider value={[settings, setSettings]}>
        <Goal.Provider value={[goal, setGoal]}>
        <MediaFavorites.Provider value={[mediaFavoritesMap, setMediaFavoritesMap]}>
            {children}
        </MediaFavorites.Provider>
        </Goal.Provider>
        </Settings.Provider>
        </CurrentLecture.Provider>
        </CurrentVersesMap.Provider>
        </CheckAlerts.Provider>
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