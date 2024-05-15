import expressSetup from "./api";
import {connect} from "./services/mongo";

console.log("Connecting to MongoDB...");
connect().then(() => expressSetup().catch((e) => console.log(e)));
