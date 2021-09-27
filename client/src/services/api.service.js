// import http from "../http-common";
import { postHeader, getHeader, putHeader, deleteHeader } from "../http-common";
import { config } from "../config";


class ApiService {
  upload(data, wsname) {
    return postHeader({ url: config.baseURL + config.baseLOCATION + "upload", data });
  }
  processCDR(data){
    return postHeader({ url: config.baseURL + config.baseLOCATION + "processcdrapi", data });
  }
  refreshreporting(data){
    return postHeader({ url: config.baseURL + config.baseLOCATION + "refreshreporting", data });
  }
  graphql(data) {
    return postHeader({ url: config.baseURL + "/cdr/graphql", data });
  }
  checkCDR(data){
    return postHeader({ url: config.baseURL + config.baseLOCATION + "checkcdrapi", data });
  }
  processData() {
    return postHeader({ url: config.baseURL + config.baseLOCATION + "processDataApi" });
  }
  statusUpdateApi() {

    return getHeader({ url: config.baseURL + "/cdr/api/statusUpdateApi" });
  }

  resetUploadApi() {
    return postHeader({ url: config.baseURL + config.baseLOCATION + "resetUploadApi" });
  }
}

export default new ApiService();
