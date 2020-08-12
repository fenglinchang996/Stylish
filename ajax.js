// API Info
const HOST_NAME = "api.appworks-school.tw";
const API_VERSION = "1.0";

// Ajax function for getting data from API
function getData(url, successCallback, errorCallback, header) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        successCallback(result);
      } else {
        const error = {
          status: xhr.status,
          statusText: xhr.statusText,
        };
        errorCallback(error);
      }
    }
  };
  xhr.open("GET", url);
  if (header) {
    Object.keys(header).forEach((key) => {
      xhr.setRequestHeader(key, header[key]);
    });
  }
  xhr.send();
}

// Ajax function for post data
function postData(url, data, successCallback, errorCallback, header) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        successCallback(response);
      } else {
        const error = {
          status: xhr.status,
          statusText: xhr.statusText,
        };
        errorCallback(error);
      }
    }
  };
  xhr.open("POST", url);
  if (header) {
    Object.keys(header).forEach((key) => {
      xhr.setRequestHeader(key, header[key]);
    });
  }
  xhr.send(JSON.stringify(data));
}
