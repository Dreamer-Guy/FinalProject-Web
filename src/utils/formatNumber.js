const THOUSANDS_SEPARATOR = ',';
const DIGIT_DECIMALS = 2;

const formatNumber={
    decimal:(number)=>{
        return number
        ?.toFixed(DIGIT_DECIMALS)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
    },
    int:(number)=>{
        return Math.round(number)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);
    }
}

export default formatNumber;