console.log("xAxisCaseYear:", xAxisCaseYear);
console.log("yAxisRevenueYear:", yAxisRevenueYear);

const convertStringofDatesToArrayOfDates = (stringDates) => {
    const dates = stringDates.split(',');
    return dates;
};

const convertStringOfNumbersToArrayOfNumbers = (stringNumbers) => {
    const numbers = stringNumbers.split(',').map(numString=>parseInt(numString));
    return numbers;
};

const ctx = document.getElementById('yearRevenueChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'line', // Change to 'bar', 'pie', etc. for other charts
    data: {
        labels: convertStringofDatesToArrayOfDates(xAxisCaseYear),
        datasets: [{
            label: 'Revenue in years',
            data: convertStringOfNumbersToArrayOfNumbers(yAxisRevenueYear),
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
