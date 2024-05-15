import expressSetup from "./api";
import {connect} from "./services/mongo";
import {initializeModels} from "./services/mongo/models";

console.log("Connecting to MongoDB...");
connect().then(() => {
    initializeModels();
    expressSetup().catch((e) => console.log(e))
});
