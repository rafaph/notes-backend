import chai from "chai";
import chaiAsPromise from "chai-as-promised";
import chaiDateTime from "chai-datetime";

chai.config.truncateThreshold = 1;
chai.config.showDiff = true;

chai.use(chaiAsPromise);
chai.use(chaiDateTime);
