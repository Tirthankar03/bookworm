import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'authToken';

export const saveToken = async (token) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}; 

export const debugToken = async () => {
  const token = await getToken();
  console.log("Debug token>>>", token || "No token");
  return token;
};