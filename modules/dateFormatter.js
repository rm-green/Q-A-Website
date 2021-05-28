/**
 * @module dateFormatter formats the date from JS POSIX time to a human readable format
 * @param object object containing a date value (mutates)
 */

const trimlength = 5

export default function formatDateObject(object) {
	const oldDate = new Date(object.date)
	const newDate = `${oldDate.getDate()}/${oldDate.getMonth()+1}/${oldDate.getFullYear()} 
	${oldDate.toLocaleTimeString().slice(0, trimlength)}`
	object.date = newDate
}
