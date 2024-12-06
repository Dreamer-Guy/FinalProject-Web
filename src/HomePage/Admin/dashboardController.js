import serviceFactory from "../../Factory/serviceFactory.js";

const orderService=serviceFactory.getOrderService();
const userService=serviceFactory.getUserService();
const productService=serviceFactory.getProductSerVice();


const COUNT_TIME_RANGE=3;
const COUNT_TOP_PRODUCT=5;

const daysOfMonth=[31,28,31,30,31,30,31,31,30,31,30,31];

const updateDaysOfMonth=()=>{
    const today=new Date();
    if(today.getFullYear()%400===0 || (today.getFullYear()%100!==0 && today.getFullYear()%4===0)){
        daysOfMonth[1]=29;
    }
}

const getStartDayCaseDay=(today)=>{
    let day=today.getDate()-COUNT_TIME_RANGE+1;
    let month=today.getMonth();
    let year=today.getFullYear();
    if(day<=0){
        month--;
        if(month<0){
            month=11;
            year--;
        }
        day=daysOfMonth[month]+day;
    }
    return new Date(year,month,day);
}

const getStartDayCaseMonth=(today)=>{
    let month=today.getMonth()-COUNT_TIME_RANGE+1;
    let year=today.getFullYear();
    if(month<0){
        month=12+month;
        year--;
    }
    return new Date(year,month,1);
}

const getStartDayCaseYear=(today)=>{
    return new Date(today.getFullYear()-COUNT_TIME_RANGE+1,0,1);
}

const getRevenueProductByOrders=(orders)=>{
    const items=orders.map(order=>order.items).flat();
    const productRevenue=items.reduce((acc,item)=>{
        if(acc[item.productId]){
            acc[item.productId].total+=item.price*item.quantity;
            acc[item.productId].quantity+=item.quantity;
        }else{
            acc[item.productId]={
                total:item.price*item.quantity,
                name:item.name,
                type:item.type,
                brand:item.brand,
                image:item.image,
                quantity:item.quantity,
            };
        }
        return acc;
    },{}); 
    const productsReVenueArray=[];
    for(const key in productRevenue){
        productsReVenueArray.push({
            ...productRevenue[key],
            _id:key.toString(),
        });
    }
    return productsReVenueArray;
}

const getTopPurchasedProductsFromOrders=(orders,limit)=>{
    const products=getRevenueProductByOrders(orders);
    const sortedProducts=[...products].sort((a, b) => b.total - a.total);
    return sortedProducts.slice(0,limit);
}

const getXAxisCaseYear=(startDate)=>{
    const timeRanges=[];
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(startDate.getFullYear()+i);
    }
    return timeRanges;
}

const getXAxisCaseMonth=(startDate)=>{
    const timeRanges=[];
    let month=startDate.getMonth()+1;
    let year=startDate.getFullYear();
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(month+"/"+year);
        month++;
        if(month>12){
            month=1;
            year++;
        }
    }
    return timeRanges;
};

const getXAxisCaseDay=(startDate)=>{
    const timeRanges=[];
    let day=startDate.getDate();
    let month=startDate.getMonth()+1;
    let year=startDate.getFullYear();
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(day+"/"+month+"/"+year);
        day++;
        if(day>daysOfMonth[month-1]){
            day=1;
            month++;
            if(month>12){
                month=1;
                year++;
            }
        }
    }
    return timeRanges;
};

const getTimeRangeCaseDay=(startDate,endDate)=>{
    const timeRanges=[];
    let day=startDate.getDate();
    let month=startDate.getMonth();
    let year=startDate.getFullYear();
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(new Date(year,month,day));
        day++;
        if(day>daysOfMonth[month]){
            day=1;
            month++;
            if(month>11){
                month=0;
                year++;
            }
        }
    }
    timeRanges.push(endDate);
    return timeRanges;
};
const getTimeRangeCaseMonth=(startDate,endDate)=>{
    const timeRanges=[];
    let month=startDate.getMonth();
    let year=startDate.getFullYear();
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(new Date(year,month,1));
        month+=1;
        if(month>11){
            month=1;
            year+=1;
        }
    }
    timeRanges.push(endDate);
    return timeRanges;
};

const getTimeRangeCaseYear=(startDate,endDate)=>{
    const timeRanges=[];
    let year=startDate.getFullYear();
    for(let i=0;i<COUNT_TIME_RANGE;i++){
        timeRanges.push(new Date(year,0,1));
        year++;
    }
    timeRanges.push(endDate);
    return timeRanges;
};

const getYAxisRevenue=async(timeRanges)=>{
    const yAxis=[];
    for(let i=0;i<timeRanges.length-1;i++){
        const startDate=timeRanges[i];
        const endDate=timeRanges[i+1];
        const orders=await orderService.getOrdersInTimeRange(startDate,endDate);
        yAxis.push(orders.reduce((acc,order)=>acc+order.total,0));
    }
    return yAxis;
}

const getDashBoardPage=async(req,res)=>{
    const orders=await orderService.getAllOrders();
    const users=await userService.getAllUsers();
    const topRatingProducts=await productService.getTopProducts(COUNT_TOP_PRODUCT);
    const topPurchasedProducts=getTopPurchasedProductsFromOrders(orders,COUNT_TOP_PRODUCT);
    updateDaysOfMonth();
    const today=new Date();
    const startDateCaseYear=getStartDayCaseYear(today);
    const startDateCaseMonth=getStartDayCaseMonth(today);
    const startDateCaseday=getStartDayCaseDay(today);
    
    const endDate=new Date();
    
    const xAxisCaseYear=getXAxisCaseYear(startDateCaseYear);
    const xXAxisCaseMonth=getXAxisCaseMonth(startDateCaseMonth);
    const xXAxisCaseDay=getXAxisCaseDay(startDateCaseday);
    
    const timeRangeCaseYear=getTimeRangeCaseYear(startDateCaseYear,endDate);
    const timeRangeCaseMonth=getTimeRangeCaseMonth(startDateCaseMonth,endDate);
    const timeRangeCaseDay=getTimeRangeCaseDay(startDateCaseday,endDate);

    const yAxisRevenueYear=await getYAxisRevenue(timeRangeCaseYear);
    const yAxisRevenueMonth=await getYAxisRevenue(timeRangeCaseMonth);
    const yAxisRevenueDay=await getYAxisRevenue(timeRangeCaseDay);
    return res.render('admin/dashboard',{
        xAxisCaseYear,
        yAxisRevenueYear,
        orders,
        users,
        topRatingProducts,
        topPurchasedProducts,
    });
};

export {getDashBoardPage};