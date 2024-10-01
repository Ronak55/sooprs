import AsyncStorage from "@react-native-async-storage/async-storage";
import { mobile_siteConfig } from "./mobile-siteConfig";
import { getDataFromAsyncStorage } from "./CommonFunction";


export async function postData(data: any, urlPath: string) {
  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: "POST",
      mode: "cors",
      // cache: 'no-cache',
      // credentials: 'same-origin',
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        // Origin: 'localhost',
        //   authorization:
        //     'Bearer ' +
        //     AsyncStorage.getItem(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY),
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.response) {
          return resolve(json.response);
        } else {
          return resolve(json);
        }
      })
      .catch((error) => {
        console.log(`=== ERROR === ${urlPath}`, error);
        reject(error);
      });
  });
}

export async function postDataWithToken(data: any, urlPath: string) {
  let token = await AsyncStorage.getItem(
    mobile_siteConfig.MOB_ACCESS_TOKEN_KEY
  );
  console.log("=== postDataWithToken === ", token);
  return new Promise((resolve, reject) => {
    console.log("=== POST", mobile_siteConfig.BASE_URL + urlPath);
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: "POST",
      mode: "cors",
      // cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "localhost",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      })
      .catch((error) => {
        console.log(`=== ERROR === ${mobile_siteConfig.BASE_URL + urlPath}`, error);
        reject(error);
      });
  });
}

export async function getData(urlPath: string) {
  console.log('=== getData URL ===', mobile_siteConfig.BASE_URL + urlPath);
  let accessTokenKey = await AsyncStorage.getItem(
    mobile_siteConfig.MOB_ACCESS_TOKEN_KEY
  );
  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: "GET",
      mode: "cors",
      // cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "localhost",
        authorization: "Bearer " + accessTokenKey,
      },
    })
      .then((response) => response.json())
      .then((json) => resolve(json))
      .catch((error) => {
        console.log(`=== ERROR === ${mobile_siteConfig.BASE_URL + urlPath}`, error);
        reject(error);
      });
  });
}

export async function getDataWithToken(data: any, urlPath: string) {
  console.log('=== getDataWithToken URL ===', mobile_siteConfig.BASE_URL + urlPath);
  let token = await AsyncStorage.getItem(
    mobile_siteConfig.MOB_ACCESS_TOKEN_KEY
  );
  try {
    const res = await fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "localhost",
        Authorization: "Bearer " + token,
      },
    });
    return await res;
  } catch (err) {
    console.log("failed to fetch");
  }
}

export async function patchData(data: any, urlPath: string) {
  try {
    const res = await fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: "PATCH",
      mode: "cors",
      // cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
        authorization:
          "Bearer " +
          AsyncStorage.getItem(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY),
      },
      body: JSON.stringify(data),
    });
    return await res;
  } catch (err) {
    console.log("Error:: failed to fetch");
  }
}

export async function PutDataWithToken(data: any, urlPath: string) {
  console.log('=== PutDataWithToken URL ===', mobile_siteConfig.BASE_URL + urlPath);
  console.log('=== PutDataWithToken REQUEST ===', data);
  let token=await getDataFromAsyncStorage(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY)
  console.log('token:::::::::7123', token);

  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: 'PUT',
      // mode: 'cors',
      // cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Accept: "*/*",
        // "Content-Type": 'application/json',
        Authorization: 'Bearer ' + token,
      },
      // body: JSON.stringify(data),
      body: data,
    })
      .then(response => response.json())
      .then(json => {
        console.log('=== vv RESPONSE ===', json);
        resolve(json);
      })
      .catch(error => {
        // console.log('=== ERROR ===', error);
        reject(error);
      });
  });
}

export async function PatchDataWithToken(data: any, urlPath: string) {
  console.log('=== PutDataWithToken URL ===', mobile_siteConfig.BASE_URL + urlPath);
  console.log('=== PutDataWithToken REQUEST ===', data);
  // let token = await AsyncStorage.getItem(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY);
  let token=await getDataFromAsyncStorage(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY)
  console.log('token:::::::::7', token);

  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: 'PATCH',
      // mode: 'cors',
      // cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        Accept: "*/*",
        "Content-Type": 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(json => {
        console.log('=== vv RESPONSE ===', json);
        resolve(json);
      })
      .catch(error => {
        console.log('=== ERROR ===', error);
        reject(error);
      });
  });
}


export async function DeleteDataWithToken(data: any, urlPath: string) {
  console.log('=== DeleteDataWithToken URL ===', mobile_siteConfig.BASE_URL + urlPath);
  console.log('=== DeleteDataWithToken REQUEST ===', data);
  let token = await AsyncStorage.getItem(mobile_siteConfig.MOB_ACCESS_TOKEN_KEY);
  console.log('token:::::::::7', token);

  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + urlPath, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: "*/*",
        "Content-Type": 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          console.log('=== DELETE RESPONSE ===', response.status);
          resolve({ status: response.status, message: 'Resource deleted successfully.' });
        } else {
          return response.json().then(json => {
            console.log('=== ERROR RESPONSE ===', json);
            reject({ status: response.status, ...json });
          });
        }
      })
      .catch(error => {
        console.log('=== ERROR ===', error);
        reject(error);
      });
  });
}

