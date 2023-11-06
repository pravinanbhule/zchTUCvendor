import moment from "moment";
export const dynamicSort = (property, dir) => {
  return function (obj1, obj2) {
    if (typeof obj1[property] === "string") {
      if (
        typeof obj1[property] === "undefined" ||
        obj1[property] === "undefined"
      )
        return false;
      if (
        typeof obj2[property] === "undefined" ||
        obj2[property] === "undefined"
      )
        return false;

      var c1 = obj1[property]?.toLowerCase();
      var c2 = obj2[property]?.toLowerCase();
    } else {
      if (
        typeof obj1[property] === "undefined" ||
        obj1[property] === "undefined"
      )
        return false;
      if (
        typeof obj2[property] === "undefined" ||
        obj2[property] === "undefined"
      )
        return false;

      var c1 = obj1[property];
      var c2 = obj2[property];
    }
    if (dir === "Des") {
      return c1 < c2 ? 1 : c1 > c2 ? -1 : 0;
    } else {
      return c1 > c2 ? 1 : c1 < c2 ? -1 : 0;
    }
  };
};

export const formatDate = (date) => {
  return moment(date).format("DD-MMM-YYYY");
};
export const formatDateExportReport = (date) => {
  return moment(date).format("MM/DD/YYYY");
};
export const getUrlParameter = (sParam) => {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (let i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};
export const validateEmail = (emailval, ismultival) => {
  let isValidEmail = true;
  const pattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const email = ismultival ? emailval.split(",") : emailval.trim();
  if (ismultival) {
    email.forEach((item) => {
      if (!pattern.test(item)) {
        isValidEmail = false;
      }
    });
  } else {
    if (!pattern.test(email)) {
      isValidEmail = false;
    }
  }
  return isValidEmail;
};
export const isNotEmptyValue = (value) => {
  if (typeof value === "boolean" && value === false) {
    return true;
  } else if (value) {
    return true;
  } else {
    return false;
  }
};
export const isEmptyObjectKeys = (obj) => {
  let isEmpty = true;
  for (let prop in obj) {
    if (
      obj.hasOwnProperty(prop) &&
      ((obj[prop]?.constructor === Array && obj[prop]?.length) ||
        (obj[prop]?.constructor === Boolean &&
          (obj[prop] === true || obj[prop] === false)) ||
        (obj[prop]?.constructor !== Array &&
          obj[prop]?.constructor !== Boolean &&
          obj[prop]?.trim()) ||
        obj[prop] === false ||
        obj[prop] === 0)
    ) {
      isEmpty = false;
      break;
    } else {
      isEmpty = true;
    }
  }
  return isEmpty;
};
export const isObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
export const isDateInRange = (date, start, end) => {
  const currentdate = moment(date).format("MM/DD/YYYY");
  const startdate = moment(start).subtract(1, "days").format("MM/DD/YYYY");
  const enddate = moment(end).add(1, "days").format("MM/DD/YYYY");
  const isInRange = moment(currentdate).isBetween(startdate, enddate);
  return isInRange;
};
