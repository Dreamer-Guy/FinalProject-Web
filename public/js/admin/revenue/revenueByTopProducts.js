const decodeHTMLEntities=(encodedStr)=>{
    const parser = new DOMParser();
    const doc = parser.parseFromString(encodedStr, 'text/html');
    return doc.documentElement.textContent;
}

const decodedTopPurchasedProducts= decodeHTMLEntities(topPurchasedProducts);

const parsedTopPurchasedProducts = JSON.parse(decodedTopPurchasedProducts);


const chunkStringToArrayWithGivenLength=(str,length)=>{
    const arrOfStrings=[];
    for(let i=0;i<str.length;i+=length){
        arrOfStrings.push(str.substring(i,i+length));
    }
    return arrOfStrings;
}

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
                    color: '#374151',
                    callback:function(value){
                        const label = this.getLabelForValue(value);
                        const words=label.split(' ');
                        const MAX_WORD_LENGTH=12;
                        for (let i = 0; i < words.length; i++) {
                            if(words[i].length>MAX_WORD_LENGTH){
                                const splittedWords=chunkStringToArrayWithGivenLength(words[i],MAX_WORD_LENGTH);
                                words.splice(i,1,...splittedWords);
                            }
                        }
                        return words;
                    },
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