import { useEffect, useState, useReducer } from "react";

function getSaved(key, init) {
 const savedValue = JSON.parse(localStorage.getItem(key));

 if (savedValue) return savedValue;

 return init;
}

export function useLocal(key, init) {
 const [val, setVal] = useState(() => {
  return getSaved(key, init);
 });

 useEffect(() => {
  localStorage.setItem(key, JSON.stringify(val));
 }, [val]);

 return [val, setVal];
}

export function useLocalr(key, reducer, init) {
 const realVal = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : init;

 const [val, dispatch] = useReducer(reducer, realVal);

 useEffect(() => {
  localStorage.setItem(key, JSON.stringify(val));
 }, [val]);

 return [val, dispatch];
}
