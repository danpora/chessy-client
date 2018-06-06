export const SERVER = process.env.NODE_ENV === 'testing' 
  ? 'http://localhost:8000'
  : 'https://chessy-server.herokuapp.com';
  