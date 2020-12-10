const MILLIS_IN_A_SECOND = 1000;
const MILLIS_IN_A_MINUTE = MILLIS_IN_A_SECOND * 60;
const MILLIS_IN_AN_HOUR = MILLIS_IN_A_MINUTE * 60;
const MILLIS_IN_A_DAY = MILLIS_IN_AN_HOUR * 24;
export const RELEASE_TIME = new Date("2020-12-01T07:00:00.000+01:00").getTime();
export function logSanta() {
    console.log(`
%cHO! HO! HO!%c   ,      ,      ,
             (/     (/     (/
  \\@/  ._,--'\\) ,--'\\) ,--'\\)
  ]Pst/  /|"/>  /|"/>  /|"/>
	`, "color: #842222", "color: black");
}
export function getCountdownTime() {
    const milliseconds = RELEASE_TIME - Date.now();
    if (milliseconds <= 0)
        return `00 00:00:00`;
    const days = Math.floor(milliseconds / MILLIS_IN_A_DAY).toString();
    const hours = Math.floor((milliseconds % MILLIS_IN_A_DAY) / MILLIS_IN_AN_HOUR)
        .toString()
        .padStart(2, "0");
    const minutes = Math.floor((milliseconds % MILLIS_IN_AN_HOUR) / MILLIS_IN_A_MINUTE)
        .toString()
        .padStart(2, "0");
    const seconds = Math.floor((milliseconds % MILLIS_IN_A_MINUTE) / MILLIS_IN_A_SECOND)
        .toString()
        .padStart(2, "0");
    return `${days} ${hours}:${minutes}:${seconds}`;
}
