export const host = "https://test-intern-goldenowl-backend-fkru.onrender.com/api";


//Login
export const loginApi = `${host}/auth/login`

//Register
export const registerApi = `${host}/auth/register`

//Create new product
export const createProductApi = `${host}/v1/product`

//Get all product
export const getAllProductApi = `${host}/v1/product`

//Get single product
export const getProductApi = (id) => `${host}/v1/product/${id}`

//Update product
export const updateProductApi = (id) => `${host}/v1/product/${id}`

//Delete product
export const deleteProductApi = (id) => `${host}/v1/product/${id}`

//Search product
export const searchProductApi = (keyword) => `${host}/v1/search/${keyword}`