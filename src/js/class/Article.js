export default class Article{
    constructor(info){
        this.id = info._id
        this.name = info.name
        this.description = info.description
        this.imageUrl = info.imageUrl
        this.price = info.price / 100
        this.color = info.colors
    }

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

    createPanierArticle(){
        
    }

    static getArticleInfo(id = ''){
        let result = []
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

    static getOneArticle(id){
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open('GET', 'http://localhost:3000/api/teddies/' + id)
            request.addEventListener('readystatechange', (e) => {
                if(request.readyState == '4'){
                    const response = request.response
                    resolve(response)
                }
            })
            request.send()
        })
    }
}