const localstorageId = "okta-token-storage";
const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem(localstorageId));
  return user ? user.refreshToken : "";
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem(localstorageId));
  // console.log(user);
  return user && user.accessToken ? user.accessToken.accessToken : "";
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem(localstorageId));
  user.token = token;
  localStorage.setItem(localstorageId, JSON.stringify(user));
};

const getUser = () => {
  return JSON.parse(localStorage.getItem(localstorageId));
};

const setUser = (user) => {
  localStorage.setItem(localstorageId, JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem(localstorageId);
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
