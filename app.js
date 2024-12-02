const productList = document.querySelector('#products');
const productForm = document.querySelector('#product-form');
const formTitle = document.querySelector('#form-title');
const inputId = document.querySelector('#id');
const inputName = document.querySelector('#name');
const inputDescription = document.querySelector('#description');
const inputPrice = document.querySelector('#price');
const backendUrl = 'http://100.25.153.58:3000';

let products = []; // Variável global para armazenar os produtos

// Função para buscar todos os produtos do servidor
async function fetchProducts() {
  const response = await fetch(`${backendUrl}/products`);
  products = await response.json(); // Armazenar os produtos na variável global

  // Limpar a lista de produtos
  productList.innerHTML = '';

  // Adicionar cada produto à lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${product.name} - ${product.description} - $${product.price}
      <button class="update-btn" onclick="editProduct(${product.id})">Update</button>
      <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
    `;
    productList.appendChild(li);
  });
}

// Função para adicionar um novo produto
async function addProduct(name, description, price) {
  const response = await fetch(`${backendUrl}/products`, { // Corrigido para a URL correta
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, price }),
  });
  return response.json();
}

// Função para atualizar um produto
async function updateProduct(id, name, description, price) {
  const response = await fetch(`${backendUrl}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description, price }),
  });
  return response.json();
}

// Função para excluir um produto
async function deleteProduct(id) {
  const response = await fetch(`${backendUrl}/products/${id}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    fetchProducts(); // Recarregar os produtos após a exclusão
  }
}

// Evento para o envio do formulário de produto
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = inputId.value;
  const name = inputName.value;
  const description = inputDescription.value;
  const price = inputPrice.value;

  if (formTitle.textContent === 'Adicionar Produto') {
    await addProduct(name, description, price);
  } else {
    await updateProduct(id, name, description, price);
  }

  productForm.reset();
  formTitle.textContent = 'Adicionar Produto';
  fetchProducts(); // Recarregar os produtos após adicionar ou atualizar
});

// Função para preencher o formulário com os dados de um produto para edição
function editProduct(id) {
  const product = products.find((product) => product.id === id); // Buscar o produto na lista global

  if (product) {
    inputId.value = product.id;
    inputName.value = product.name;
    inputDescription.value = product.description;
    inputPrice.value = product.price;

    formTitle.textContent = 'Atualizar Produto'; // Mudar o título do formulário para "Atualizar Produto"
  }
}

// Buscar e exibir os produtos quando a página for carregada
window.addEventListener('load', fetchProducts);
