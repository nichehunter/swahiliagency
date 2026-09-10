export const getTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const getTokenRemainingTime = (token) => {
  const expiration = getTokenExpiration(token);

  if (!expiration) {
    return 0;
  }

  return expiration - Date.now();
};
