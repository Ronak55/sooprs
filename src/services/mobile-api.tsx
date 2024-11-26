import AsyncStorage from "@react-native-async-storage/async-storage";
import { mobile_siteConfig } from "./mobile-siteConfig";
import { getDataFromAsyncStorage } from "./CommonFunction";


export async function postData(data: any, urlPath: string) {
  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath, {
      method: "POST",
      mode: "cors",
      // cache: 'no-cache',
      // credentials: 'same-origin',
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        'User-Agent': 'com.sooprsapp/1.0',
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

export async function postFormData(formData: FormData, urlPath: string) {
  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: '*/*',
        'User-Agent': 'com.sooprsapp/1.0',
        // Note: No need to specify 'Content-Type' for FormData, it will be automatically set by fetch.
      },
      body: formData, // Pass FormData directly
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status == 200) {
          return resolve(json); // Successful response
        } else {
          return resolve(json); // Handle API errors within the response
        }
      })
      .catch((error) => {
        console.log(`=== ERROR === ${urlPath}`, error);
        reject(error); // Catch fetch errors
      });
  });
}


export async function postDataWithToken(urlPath: string) {
  // let token = await AsyncStorage.getItem(
  //   mobile_siteConfig.MOB_ACCESS_TOKEN_KEY
  // );
  // console.log("=== postDataWithToken === ", token);
  return new Promise((resolve, reject) => {
    console.log("=== POST", mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath);
    fetch(mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath, {
      method: "POST",
      mode: "cors",
      // cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Origin: "localhost",
        // authorization: "Bearer " + token,
      },
      // body: JSON.stringify(data),
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
  return new Promise((resolve, reject) => {
    fetch(mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath, {
      method: "GET",
      mode: "cors",
      // cache: "no-cache",
      credentials: "same-origin",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        // Origin: "localhost",
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

export async function getDataWithToken(urlPath: string) {
  const url = mobile_siteConfig.BASE_URL + mobile_siteConfig.INDEX + urlPath;
  console.log('=== getDataWithToken URL ===', url);

  let token = await AsyncStorage.getItem(mobile_siteConfig.TOKEN);
  console.log('tokennnn::::::::;;', token);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer "+ JSON.parse(token),
        'User-Agent': 'com.sooprsapp/1.0',
      },
    });

    // Check if the response status is OK
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse JSON data
    const data = await res.json();
    return data;

  } catch (err) {
    console.log("Error fetching data with token:", err);
    return null;
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
        'User-Agent': 'com.sooprsapp/1.0',
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

