const decodeHTMLEntities=(encodedStr)=>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(encodedStr, 'text/html');
    return doc.documentElement.textContent;
}

const decodedTopPurchasedProducts= decodeHTMLEntities(topPurchasedProducts);

const parsedTopPurchasedProducts = JSON.parse(decodedTopPurchasedProducts);


const ctxDay = document.getElementById('revenueByTopProducts').getContext('2d');
const salesChartInDay = new Chart(ctxDay, {
    type: 'bar', // Change to 'bar', 'pie', etc. for other charts
    data: {
        labels: parsedTopPurchasedProducts.map(product=>product.name),
        datasets: [{
            label: 'Revenue by top products',
            data: parsedTopPurchasedProducts.map(product=>product.total),
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