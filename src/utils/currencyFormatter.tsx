function formatNumber(num: number) {
    if (num < 1000) return num;
    let numAsString = String(num);
    let numberOfDigits = numAsString.length;
    let left = "";
    let right = "";
    let numberOfLeftCharacters = numberOfDigits % 3 == 0 ? 3 : numberOfDigits % 3;
    left = numAsString.slice(0, numberOfLeftCharacters);
    right = numAsString.slice(numberOfLeftCharacters);
    right = right.replace(/(.{3})/g, "$1,")
    let result = left + "," + right;
    return result.replace(/,$/, "");
}

export default formatNumber;