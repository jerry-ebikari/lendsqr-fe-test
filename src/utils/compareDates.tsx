const compareDates = (date1: string | Date, date2: string | Date) =>{
    date1 = new Date(date1);
    date2 = new Date(date2);
    return (
        (date1.getFullYear() == date2.getFullYear()) &&
        (date1.getMonth() == date2.getMonth()) &&
        (date1.getDay() == date2.getDay())
    )
}

export default compareDates;