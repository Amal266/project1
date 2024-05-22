
localStorage.setItem('total', '[]');
        
total();
function displayCart() {
        var allProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
        var cart = document.getElementById('cart');
        var cartContent = ''; 
        document.getElementById("data").innerHTML = cartContent;

    
        allProducts.forEach(function(product) {
        cartContent += displayProduct(product);
    });
    document.getElementById("data").innerHTML = cartContent;
}

function displayProduct(product) {
    var inputId = 'quantity_' + product._id;

    let item = JSON.parse( window.localStorage.getItem('total')) || [{}];
    item.push({ product: product._id, value: 2*product.price });
    localStorage.setItem('total', JSON.stringify(item));
    total();
    // console.log(product._id);
    return `
        <tr>
            <td><a onclick="removeItem('${product._id}')" href="#" class="remove-from-cart" data-product-id="${product.id}"><i class="far fa-times-circle"></i></a></td> <!-- Delete icon -->
            <td><img src="${product.images[0]}" width="100" height="100"></td>
            <td>${product.title}</td> <!-- Product name --> 
            <td>${product.price}</td> <!-- Product price -->
            <td>
                <input onchange="Calculate('${inputId}', '${product.price}', '${product._id}')" type="number" id="${inputId}" name="${inputId}" min="2" max="30" value="2">
            </td>
            <td id="subtotal_${product._id}">
            ${(parseInt('2') * parseInt(product.price)).toFixed(2)}   
            </td> <!-- Subtotal -->
        </tr>
    `;
}

var cartProductIds = JSON.parse(localStorage.getItem('crt')) || [];
console.log(cartProductIds);
getAllCatData(cartProductIds);
function Calculate(inputId, price, id)
{
    let value = document.getElementById(inputId).value;
    let subtotal = document.getElementById('subtotal_' + id);
    subtotal.innerText = (parseInt(value) * parseInt(price)).toFixed(2) || 0;
    
    var oldTotal = JSON.parse(localStorage.getItem('total')) || [{product: id, value: 0}];
    oldTotal = oldTotal.filter(data=> data.product != id);
    // console.log(oldTotal);
    oldTotal.push({ product: id, value: parseInt(value) * parseInt(price) });
    window.localStorage.setItem('total', JSON.stringify(oldTotal));
    total();
}
function total()
{
    var total = JSON.parse(localStorage.getItem('total')) || [{}];
    var sum = 0;
    total.map(item => parseInt(item.value) || 0).map(item => {
    sum += item;
    if(document.getElementById('realtotal'))
        document.getElementById('realtotal').innerText = sum.toFixed(2);
    });
}

function getAllCartProductIds() {
    var cartProductIds = JSON.parse(localStorage.getItem('crt')) || [];
    return cartProductIds;
}
function getAllGeneratedInput(productsId)
{
    var all = [];
    productsId.forEach(function(id) {
        var inputId = 'quantity_' + id;
        all.push(inputId);
    });
    return all;
}

function getAllCatData(cartProductIds) {
    var allProducts = [];
    var cartContent = '';

    Promise.all(cartProductIds.map(function (id) {
        return fetch('http://localhost:3000/productdetails/' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            allProducts.push(product);
        })
        .catch(function (error) {
            console.log(error);
        });
    }))
    .then(function () {
        window.localStorage.setItem('allProducts', JSON.stringify(allProducts));
        displayCart();
    });
}

function RemoveCart()
{
    storage.removeItem("crt");
    storage.setItem("crt", '[]');
}

function RemoveSingleItem(value)
{
    var cart = JSON.parse(localStorage.getItem('crt')) || [];
    var index = cart.indexOf(value);
    if (index > -1) {
        cart.splice(index, 1);    
    }
} 

async function getItemFromDB(item_id)
{
    let req = await fetch(`/productdetails/${item_id}`);
    let data = await req.json();
    return data;    
}
function removeItem(item_id)
{
    console.log(item_id);
    var cart = JSON.parse(localStorage.getItem('crt')) || [];
    cart = cart.filter(itme=> itme != item_id);
    localStorage.setItem("crt", JSON.stringify(cart));
    window.location.reload();
}
function claculateFullPrice(product, productDays)
{
    var price = product.price;
    var days = productDays;
    var total = price * days;
    return total;
}