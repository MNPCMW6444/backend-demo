import dotenv from "dotenv";
import process from "process";

interface Settings {
    nodeEnv: "development" | "production";
    mongoURI: string;
    selfDomain: string;
    selfPort: number;
    clientDomains: string[];
    stagingEnv: "local" | "preprod" | "prod";
}

dotenv.config();


const settings: Settings = {
    nodeEnv: process.env.NODE_ENV as "production" || "development",
    mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/myFallbackDB",
    selfDomain: process.env.SELF_DOMAIN || "localhost",
    selfPort: parseInt(process.env.SELF_PORT || "4400"),
    clientDomains: JSON.parse(process.env.CLINET_DOMAINS || "null") || [],
    stagingEnv: process.env.STAGING_ENV as ("preprod" | "prod") || "local",
};

if (!settings) throw new Error("problem with NODE_ENV");

export default settings;
