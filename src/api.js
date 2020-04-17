const api = 'https://reactnd-books-api.udacity.com';

let token = localStorage.token;

if(!token){
    token = localStorage.token = Math.random().toString(36).substr(-8);
}

const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer '+token
}

export const getBooks = ()=>
    fetch(`${api}/books`,{headers})
    .then(res => res.json())
    .then(data=>data.books)
    .catch(err=> console.log(err))