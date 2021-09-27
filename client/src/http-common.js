import axios from "axios";

// console.log(localStorage.getItem("access_token"));

// export default axios.create({
//   // baseURL: `${window.location.origin}/digimops/`,
//   baseURL: "http://127.0.0.1:8000/digimops/",
//   headers: {
//     Authorization: localStorage.getItem("access_token")
//       ? "JWT " + localStorage.getItem("access_token")
//       : null,
//     "Content-Type": "application/json",
//     accept: "application/json",
//   },
// });

export const checkAuth = () => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("access_token");
    if (token !== null) {
      return resolve(checkRefresh(token));
    }
    return reject();
  });
};

export const checkRefresh = (token) => {
  const timeNow = Math.floor(new Date() / 1000);
  const refreshToken = localStorage.getItem("refresh_token");
  const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

  return new Promise((resolve, reject) => {
    if (tokenParts.exp && token) {
      if (!isNaN(tokenParts.exp) && tokenParts.exp > timeNow) {
        return resolve("JWT " + token);
      }
    }
    axios
      .post("/cdr/api/token/refresh/", { refresh: refreshToken })
      .then(function (response) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        return resolve("JWT " + token);
      })
      .catch(function (error) {
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");
        window.location.href = "../cdr/login";
        return reject();
      });
  });
};

export const postHeader = (params) => {
  return new Promise((resolve, reject) => {
    checkAuth().then((token) => {
      // console.log(params);
      axios
        .post(params.url, JSON.stringify(params.data), {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  });
};

export const putHeader = (params) => {
  return new Promise((resolve, reject) => {
    checkAuth().then((token) => {
      axios
        .put(params.url, JSON.stringify(params.data), {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export const deleteHeader = (params) => {
  return new Promise((resolve, reject) => {
    checkAuth().then((token) => {
      axios
        .delete(params.url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

export const getHeader = (params) => {
  console.log(params);
  return new Promise((resolve, reject) => {
    checkAuth().then((token) => {
      axios
        .get(params.url, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};
