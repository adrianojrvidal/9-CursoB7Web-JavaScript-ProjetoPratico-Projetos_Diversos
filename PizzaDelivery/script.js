// Criando uma biblioteca própria para simplificar o código
const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);


// 1- Mapeando a Variável "pizzaJson" (Banco de Dados das pizzas)
// array.map() pecorre item a item do array e aplica uma ação em cada um. Recebe como 1° parâmetro o próprio item e como 2° o index do array

pizzaJson.map((item, index)=>{
    
    // 1.1- Adicionando as pizzas no HTML via clonagem do modelo pré-formatado
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    
    // 2- Preenchendo as informações de cada pizza
    // 2.1- Nome = pizza-item--name
    pizzaItem.querySelector('.pizza-item--name').innerHTML=item.name;     // .innerHTML substitui
    // 2.2- Descrição = pizza-item--desc
    pizzaItem.querySelector('.pizza-item--desc').innerHTML=item.description;
    // 2.3- Preço = pizza-item--price
    pizzaItem.querySelector('.pizza-item--price').innerHTML=`R$ ${item.price.toFixed(2)}`; // Template String
    // 2.4- Imagem = pizza-item--img acessando o parâmetro "src"
    pizzaItem.querySelector('.pizza-item--img img').src=item.img;

    // 3- Modal (janela que abre quando clica em cada uma das pizzas)
    // 3.1- O modal será aberto via evento por clique na tag <a>. Para isso, a ação padrão deste elemento será alterado.
    pizzaItem.querySelector('a').addEventListener('click', function (evento) {
        // 3.1.1- Retirando o evento padrão
        evento.preventDefault();
        // 3.1.2- Adicionando o evento necessário (alterar o display de 'pizzaWindowArea' para Flex)
        c('.pizzaWindowArea').style.display='flex';
        // 3.1.3- Transição ao abrir
        c('.pizzaWindowArea').style.opacity=0;
        setTimeout(()=>{c('.pizzaWindowArea').style.opacity=1},300)

        // 3.2.2- Salvando o "index" da div em uma variável
        let key = evento.target.closest('.pizza-item').getAttribute('data-key'); // target='a' e closest() é o item mais próximo
        // O 'key' obtido será utilizado como index do 'pizzaJson'

        
        //3.3- Alterando os dados no modal
        //3.3.1- Nome
        c('.pizzaInfo h1').innerHTML=pizzaJson[key].name;
        //3.3.2- Descrição
        c('.pizzaInfo--desc').innerHTML=pizzaJson[key].description;
        //3.3.3- Imagem
        c('.pizzaBig img').src=pizzaJson[key].img;
        //3.3.4- Preço
        c('.pizzaInfo--actualPrice').innerHTML=`R$ ${pizzaJson[key].price.toFixed(2)}`;
        //3.3.5- Tamanhos e Resetando a seleção quando abre um novo modal
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            size.querySelector('span').innerHTML=pizzaJson[key].sizes[sizeIndex];
            if(sizeIndex == 2) {
                size.classList.add('selected');
            };
        });

        // 4.1 - Resetando a quantidade quando abre um novo modal
        modalQt = 1;
        c('.pizzaInfo--qt').innerHTML = modalQt;


        // 5.4.2- Salvando o index da pizza 
        modalKey = key;
    })

    // 3.2- Identificando a pizza selecionada
    // 3.2.1- Adicionando atributo 'data-key' nas divs de cada pizza
    pizzaItem.setAttribute('data-key', index); // 'setAttribute(atributo, valor) adiciona um atributo e seu valor no elemento selecionado, como uma DIV

    
    // Colocando cada "pizza--item" em "pizza-area"
    c('.pizza-area').append(pizzaItem);       // .append adiciona
});

// 5- Botões do modal e seus eventos
//5.1- Evento de fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity=0;
    setTimeout(()=>{c('.pizzaWindowArea').style.display='none';},500);
};
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((botaoCancelar)=>{
    botaoCancelar.addEventListener('click', closeModal);
});

//5.2- Evento de aumentar e diminuir a quantidade
let modalQt = 1;

//Menos
c('.pizzaInfo--qtmenos').addEventListener('click', function (){
    if(modalQt>1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
//Mais
c('.pizzaInfo--qtmais').addEventListener('click', function (){
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//5.3 - Tamanho selecionado
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    //Desmarcando o tamanho padrão e marcando com o selecionado
    size.addEventListener('click', (tamanhoSelecionado)=>{
        //Desmarcando o padrão
        c('.pizzaInfo--size.selected').classList.remove('selected');
        //Marcando o selecionado
        size.classList.add('selected');
    });
});

//5.4 - Adicionar ao carrinho
//5.4.1- Criando o carrinho
let cart = [];

//5.4.2- Ação de adicionar carregando as informações do pedido
//Identificador da pizza
let modalKey = 0; 
c('.pizzaInfo--addButton').addEventListener('click', function (){
    
    //Qual a pizza?
    //console.log('Pizza: '+modalKey);

    // Qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log('Tamanho: '+size);

    // Quantas Pizzas?
    //console.log('Quantidade: '+modalQt);

    // Antes de adicionar no array, tem que filtar para saber se esta adicionando itens iguais e junta-los no mesmo index array cart
    // Criando um identificador (id + tamanho)
    let identificador = pizzaJson[modalKey].id+'@'+size;
    //console.log(identificador)

    // Verificando se um identificador ja foi adicionado
    let verificar = cart.findIndex((item)=> item.identificador == identificador);

    if(verificar > -1) {
        cart[verificar].qt += modalQt;
    } else {
        // Adicionando no carrinho com 'array.push' 
        cart.push({
            identificador,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    };

    //6.1- Atualiza o carrinho 
    updateCart();

    //Fechando o modal após adicinar os itens
    closeModal();
});

// 6- Carrinho - Aside
// 6.1- Função que atualiza o carrinho
function updateCart() {
    //6.2- Mostrando o carrinho
    if(cart.length > 0) {
        c('aside').classList.add('show');
        //6.2.1- pegando os detalhes da pizza adicionda no carrinho

        //6.3.2- Zera o append em aside antes de entrar no 'for'
        c('.cart').innerHTML ='';

        //6.6 - Total do carrinho
        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            //console.log(pizzaItem);

            //6.3- Clonando o modelo "cart--item"
            let cartItem = c('.models .cart--item').cloneNode(true);

            //6.3.1- Adicioanando o 'cartItem' no 'Aside .cart'
            c('.cart').append(cartItem)

            //6.4- Adicioanndo as informações no carrinho
            //6.4.1- Imagem
            cartItem.querySelector('img').src=pizzaItem.img
            //6.4.2- Nome e tamanho
            let pizzaSize;
            switch (cart[i].size){
                case 0:
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;      
                case 2:
                    pizzaSize = 'G';
                    break;      
            }
            cartItem.querySelector('.cart--item-nome').innerHTML=`${pizzaItem.name} ${pizzaSize}`;
            //6.4.3- Quantidade
            cartItem.querySelector('.cart--item--qt').innerHTML=cart[i].qt

            //6.5- Botão mais e menos do carrinho
            //Menos
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', function (){
                if(cart[i].qt>1) {
                cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            //Mais
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', function (){
            cart[i].qt++;
            updateCart();
            });

            //6.6.1-Calculando valores do carrinho
            subtotal += pizzaItem.price * cart[i].qt

        }

        //6.6.2-Calculando valores do carrinho
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //6.6.3 - Mostrando totais
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    // Removendo o carrinho vazio    
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left='100vw';
    };


    //7 - Mobile
    //7.1- Número de pizzas no ícone
    c('.menu-openner span').innerHTML = cart.length;
};

//7.2- Abrir o carrinho
c('.menu-openner').addEventListener('click', function (){
    if(cart.length > 0){
    c('aside').style.left=0;
    }
});
c('.menu-closer').addEventListener('click', function (){
    c('aside').style.left='100vw';
});