export default class Article{
    constructor(id, name, description, imageUrl, price){
        this.id = id
        this.name = name
        this.description = description
        this.imageUrl = imageUrl
        this.price = price
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
        console.log(image)
        shopItemInfo.classList.add('shop', 'shop__item', 'shop__item__info')
        nomItem.textContent = this.name
        prixItem.textContent = this.price

        shopItemInfo.appendChild(nomItem)
        shopItemInfo.appendChild(prixItem)
        redirectLinkItem.appendChild(image)
        redirectLinkItem.appendChild(shopItemInfo)
        shopItem.appendChild(redirectLinkItem)

        this.article = shopItem
        return this.article

    }

    static getArticleInfo(ids = []){
        return new Promise((resolve, reject) => {
            if(ids.length > 0){
                let result = []
                ids.forEach(async (id) => {
                    const item = await this.getOneArticle(id)
                    result.push(item)
                })
                    resolve(result)
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
                    const response = JSON.parse(request.response)
                    resolve(JSON.parse(request.response))
                }
            })

            request.send()
        })
    }
}