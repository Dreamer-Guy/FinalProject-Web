
const convertStringofDatesToArrayOfDates = (stringDates) => {
    const dates = stringDates.split(',');
    return dates;
};

const convertStringOfNumbersToArrayOfNumbers = (stringNumbers) => {
    const numbers = stringNumbers.split(',').map(numString=>parseInt(numString));
    return numbers;
};



const ctxDay = document.getElementById('dayRevenueChart').getContext('2d');
const salesChartInDay = new Chart(ctxDay, {
    type: 'line', // Change to 'bar', 'pie', etc. for other charts
    data: {
        labels: convertStringofDatesToArrayOfDates(xAxisCaseDay),
        datasets: [{
            label: 'Revenue in days',
            data: convertStringOfNumbersToArrayOfNumbers(yAxisRevenueDay),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            tension: 0.4,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#374151'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#374151'
                }
            },
            y: {
                ticks: {
                    color: '#374151'
                }
            }
        }
    }
});

const ctxMonth = document.getElementById('monthRevenueChart').getContext('2d');
const salesChartInMonth = new Chart(ctxMonth, {
    type: 'line', // Change to 'bar', 'pie', etc. for other charts
    data: {
        labels: convertStringofDatesToArrayOfDates(xAxisCaseMonth),
        datasets: [{
            label: 'Revenue in months',
            data: convertStringOfNumbersToArrayOfNumbers(yAxisRevenueMonth),
            borderColor: 'rgba(255, 255, 0, 0.4)',
            backgroundColor: 'rgba(255, 255, 0, 0.2)',
            borderWidth: 2,
            tension: 0.4,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#374151'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#374151'
                }
            },
            y: {
                ticks: {
                    color: '#374151'
                }
            }
        }
    }
});


const ctxYear = document.getElementById('yearRevenueChart').getContext('2d');
const salesChartInYear = new Chart(ctxYear, {
    type: 'line', // Change to 'bar', 'pie', etc. for other charts
    data: {
        labels: convertStringofDatesToArrayOfDates(xAxisCaseYear),
        datasets: [{
            label: 'Revenue in years',
            data: convertStringOfNumbersToArrayOfNumbers(yAxisRevenueYear),
            borderColor: 'rgba(0, 0, 255, 0.4)',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
            borderWidth: 2,
            tension: 0.4,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#374151'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#374151'
                }
            },
            y: {
                ticks: {
                    color: '#374151'
                }
            }
        }
    }
});

console.log(ctxYear,ctxMonth,ctxDay);