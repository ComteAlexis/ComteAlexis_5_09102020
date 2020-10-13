import Article from './Article.js'

export default class Panier{
    panierDiv = document.querySelector('.cart')
    
    constructor(storage){
        if(storage.panier != undefined){
            this.panier = JSON.parse(storage.panier)
            this.totalPrice = document.querySelector('.total.total__desc > p:nth-child(2)')
            this.articleNumber = document.querySelector('.total.total__desc span')
            this.updateTotalPrice()
        }
    }

    orderPanier(contact){
        const self = this
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            let body = {
                contact: contact,
                products: Object.keys(self.panier)
            }
            request.open('POST', 'http://localhost:3000/api/teddies/order')
            request.setRequestHeader('Content-Type', 'application/json')
            request.onreadystatechange = function () {
                if(request.readyState == '4'){
                    localStorage.order = request.response
                    delete localStorage.panier
                    resolve(true)
                }
            }

            request.send(JSON.stringify(body))
        })
    }

    createPanier(){
        const keys = Object.keys(this.panier)
        keys.forEach(async (key) => {
            const articleInfo = await Article.getArticleInfo(key)
            const article = new Article(articleInfo)
            this.panierDiv.appendChild(article.createPanierArticle(this))
        })
    }

    updateQuantity(id, quantity){
        if(quantity > 0){
            this.panier[id].quantity = parseInt(quantity, 10)
            this.updateStorage()
            return true
        }
        else{
            return false
        }
    }

    deleteArticle(id){
        if(delete this.panier[id]){
            this.updateStorage()
            return true
        }
    }

    updateStorage(){
        console.log()
        if(Object.keys(this.panier).length > 0){
            localStorage['panier'] = JSON.stringify(this.panier)
            this.updateTotalPrice()
        }
        else{
            delete localStorage['panier']
            this.totalPrice.textContent = "0€"
            this.articleNumber.textContent = 'Aucun article'
        }
    }

    updateTotalPrice(){
        const keys = Object.keys(this.panier)
        let priceTotal = 0
        keys.forEach(async (key) => {
            let result = await Article.getArticleInfo(key)
            priceTotal += this.panier[key].quantity * result.price / 100
            this.totalPrice.textContent = priceTotal + '€'
        })
        this.articleNumber.textContent = keys.length + (keys.number >= 1 ? ' article' : ' articles')
    }
}