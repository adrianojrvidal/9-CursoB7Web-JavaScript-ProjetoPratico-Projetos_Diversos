// Criando uma biblioteca própria para simplificar o código
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);




// Mapeando a Variável "pizzaJson" (Banco de Dados das pizzas)
// array.map() pecorre item a item do array e aplica uma ação em cada um. Recebe como 1° parâmetro o próprio item e como 2° o index do array

pizzaJson.map((item, index)=>{
    
    // Adicionando as pizzas no HTML via clonagem do modelo pré-formatado
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    // Preenchendo as informações de cada pizza"
    // Nome = pizza-item--name
    pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name; // .innerHTML substitui
    // Descrição = pizza-item--desc
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;
    // Preço = pizza-item--price
    pizzaItem.querySelector('.pizza-item--price').innerHTML=`R$ ${item.price.toFixed(2)}`; // Template String
    // Imagem = pizza-item--img acessando o parâmetro "src"
    pizzaItem.querySelector('.pizza-item--img img').src=item.img












    
    // Colocando cada "pizza--item" em "pizza-area"
    c('.pizza-area').append(pizzaItem);       // .append adiciona
});


