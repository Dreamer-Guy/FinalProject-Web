import {Client} from "@elastic/elasticsearch";

const client= new Client({
    node: process.env.ELASTIC_ENDPOINT_URL,
    auth:{
        apiKey:process.env.ELASTIC_API_KEY
    }
});

const res=await client.info();
export default client;