var config2 = []

const prod = {
    baseURL: `${window.location.origin}`,
    baseLOCATION: "/dashboard",
  };
  
  const dev = {
    baseURL: "http://localhost:4000",
    baseLOCATION: "",
  };
  

  config2 = process.env.NODE_ENV === `development` ? dev : prod
  config2.AppName = 'dashboard'
  config2.appVersion = '1.01'

  export const config = config2

 export const appversion = "v1.62";
