import Banner from "../Model/Banner.js";

const bannerService={
    getAll:async()=>{
        const banners=await Banner.find();
        return banners;
    }
};

export default bannerService;