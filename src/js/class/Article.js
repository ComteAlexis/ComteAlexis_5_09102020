export default class Article{
    //Construction de l'objet Article à partir des informations donner en paramètre
    constructor(info){
        this.id = info._id
        this.name = info.name
        this.description = info.description
        this.imageUrl = info.imageUrl
        this.price = info.price / 100
        this.color = info.colors
    }


//Méthode servant à la création de l'élément article qui sera afficher dans la page index.html
    createBoutiqueArticle(){
        const shopItem = document.createElement('div')
        const redirectLinkItem = document.createElement('a')
        const image = document.createElement('img')
        const shopItemInfo = document.createElement('div')
        const nomItem = document.createElement('h2')
        const prixItem = document.createElement('p')

        shopItem.classList.add('shop', 'shop__item')
        redirectLinkItem.setAttribute('href', 'product.html?id=' + this.id)
        image.setAttribute('src', this.imageUrl)
        shopItemInfo.classList.add('shop', 'shop__item', 'shop__item__info')
        nomItem.textContent = this.name
        prixItem.textContent = this.price + '€'

        shopItemInfo.appendChild(nomItem)
        shopItemInfo.appendChild(prixItem)
        redirectLinkItem.appendChild(image)
        redirectLinkItem.appendChild(shopItemInfo)
        shopItem.appendChild(redirectLinkItem)

        this.article = shopItem
        return this.article

    }

//Méthode servant à la création de l'élément article qui sera afficher dans la page product.html
    createProductArticle(){
        const product = document.createElement('div')
        const productImage = document.createElement('div')
        const image = document.createElement('img')
        const productInfo = document.createElement('div')
        const name = document.createElement('h2')
        const description = document.createElement('p')
        const productInfoColor = document.createElement('div')
        const labelColor = document.createElement('label')
        const selectColor = document.createElement('select')
        const productInfoPrice = document.createElement('div')
        const priceName = document.createElement('p')
        const price = document.createElement('p')
        const button = document.createElement('button')
        const self = this;

        name.textContent = this.name
        description.textContent = this.description
        image.setAttribute('src', this.imageUrl)
        priceName.textContent= 'Prix:'
        price.textContent = this.price + '€'

        product.classList.add('product')
        productInfo.classList.add('product', 'product__info')
        productInfoColor.classList.add('product','product__info' , 'product__info__couleur')
        productInfoPrice.classList.add('product', 'product__info', 'product__info__price')
        productImage.classList.add('product', 'product__image')
        this.color.forEach((color) => {
            const colorOption = document.createElement('option')
            colorOption.textContent = color
            selectColor.appendChild(colorOption)
        })
        labelColor.textContent = 'Couleur:'
        button.classList.add('btn', 'btn--add-cart')
        button.textContent = 'Ajouter au panier'
        button.addEventListener('click', (e) => {
            function verifKeys(key){
                return self.id == key
            }
            if(localStorage.panier != undefined){
                let panier = JSON.parse(localStorage.panier)
                const keys = Object.keys(panier)
                const findItem = keys.find(verifKeys)
                if(findItem != undefined){
                    panier[findItem].quantity++
                    localStorage.panier = JSON.stringify(panier)
                }
                else{
                    panier[self.id] = {
                        quantity : 1
                    }
                    localStorage.panier = JSON.stringify(panier)
                }
            }
            else{
                const key = self.id
                const object = new Object
                object[self.id] = {
                    quantity : 1
                }
                localStorage.setItem('panier', JSON.stringify(object))
            }

            window.location.href = 'panier.html'
            
        })

        productImage.appendChild(image)
        product.appendChild(productImage)
        productInfo.appendChild(name)
        productInfo.appendChild(description)
        productInfoColor.appendChild(labelColor)
        productInfoColor.appendChild(selectColor)
        productInfoPrice.appendChild(priceName)
        productInfoPrice.appendChild(price)
        productInfo.appendChild(productInfoColor)
        productInfo.appendChild(productInfoPrice)
        product.appendChild(productInfo)
        product.appendChild(button)

        this.article = product
        return this.article
    }

    //Méthode servant à la création de l'élément article qui sera afficher dans la page panier.html
    createPanierArticle(panier){
        const self = this
        this.parent = panier.panierDiv
        const cartItem = document.createElement('div')
        const cartItemImage = document.createElement('div')
        const image = document.createElement('img')
        const cartitemInfo = document.createElement('div')
        const name = document.createElement('h2')
        const description = document.createElement('p')
        const cartItemInfoPrice = document.createElement('div')
        const prixLabel = document.createElement('p')
        const prixInfo = document.createElement('p')
        const cartItemQuantity = document.createElement('div')
        const quantityLabel = document.createElement('label')
        const quantityInput = document.createElement('input')
        const deleteButton = document.createElement('button')


        cartItem.classList.add('cart', 'cart__item')
        cartItemImage.classList.add('cart', 'cart__item', 'cart__item__image')
        image.setAttribute('src', this.imageUrl)
        image.setAttribute('alt', 'Peluche ' + this.nom)
        cartitemInfo.classList.add('cart', 'cart__item', 'cart__item__info')
        name.textContent = this.name
        description.textContent = this.description
        cartItemInfoPrice.classList.add('cart', 'cart__item', 'cart__item__info', 'cart__item__info__price')
        prixLabel.textContent = 'Prix:'
        prixInfo.textContent = this.price * panier.panier[this.id].quantity +'€'
        cartItemQuantity.classList.add('cart', 'cart__item', 'cart__item__quantity')
        quantityLabel.setAttribute('for', 'quantity')
        quantityLabel.textContent = 'Quantité'
        quantityInput.setAttribute('type', 'number')
        quantityInput.setAttribute('name', 'quantity')
        quantityInput.setAttribute('id', 'quantity')
        quantityInput.setAttribute('value', panier.panier[this.id].quantity)
        deleteButton.classList.add('btn', 'btn--delete-cart')
        deleteButton.textContent = 'Supprimer du panier'

        quantityInput.addEventListener('change', (e) => {
            if(!panier.updateQuantity(self.id, e.target.value)){
                e.target.value = 1
            }
            prixInfo.textContent = self.price * panier.panier[this.id].quantity +'€'
        })

        deleteButton.addEventListener('click', (e) => {
            if(panier.deleteArticle(self.id)){
                self.parent.removeChild(self.article)
            }
        })



        cartItem.appendChild(cartItemImage)
        cartItemImage.appendChild(image)
        cartItem.appendChild(cartitemInfo)
        cartitemInfo.appendChild(name)
        cartitemInfo.appendChild(description)
        cartitemInfo.appendChild(cartItemInfoPrice)
        cartItemInfoPrice.appendChild(prixLabel)
        cartItemInfoPrice.appendChild(prixInfo)
        cartItem.appendChild(cartItemQuantity)
        cartItemQuantity.appendChild(quantityLabel)
        cartItemQuantity.appendChild(quantityInput)
        cartItem.appendChild(deleteButton)


        this.article = cartItem
        return this.article
    }

    //Méthode qui récupère les informations de tout les articles de l'api (ou un seul élément si un id lui est spécifié)
    static getArticleInfo(id = ''){
        return new Promise((resolve, reject) => {
            if(id != null){
                const request = new XMLHttpRequest()
                request.open('GET', 'http://localhost:3000/api/teddies/' + id)
                request.addEventListener('readystatechange', (e) => {
                    if(request.readyState == '4'){
                        resolve(JSON.parse(request.response))
                    }
                })
                request.send()
            }


            else{
                const request = new XMLHttpRequest()
                request.open('GET', 'http://localhost:3000/api/teddies')
                request.addEventListener('readystatechange', (e) => {
                    if(request.readyState == '4'){
                        const response = JSON.parse(request.response)
                        resolve(response)
                    }
                })
                request.send()
            }
        })
    }
}