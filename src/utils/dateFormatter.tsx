const monthMap: any = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
}

const formatDate = (date: Date | string) => {
    date = new Date(date);
    let mm = date.getMonth();
    let dd = String(date.getDate()).padStart(2, "0");
    let month = monthMap[mm + 1];
    let year = date.getFullYear();
    let hours: string | number = date.getHours();
    let amOrPm = hours >= 12 ? "PM" : "AM";
    hours = (amOrPm == "AM") ? hours : (hours - 12);
    hours = String(hours).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month} ${dd}, ${year}`;
    // return `${month} ${dd}, ${year} ${hours}:${minutes} ${amOrPm}`;
}

export { formatDate }