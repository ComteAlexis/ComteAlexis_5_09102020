import Article from './Article.js'

export default class Panier{
    panierDiv = document.querySelector('.cart')
    
    //Construction de l'objet panier a partir du localStorage donner en paramètre
    constructor(storage){
        if(storage.panier != undefined){
            this.panier = JSON.parse(storage.panier)
            this.totalPrice = document.querySelector('.total.total__desc > p:nth-child(2)')
            this.articleNumber = document.querySelector('.total.total__desc span')
            this.updateTotalPrice()
        }
    }


    //Envoie de la commande à l'API.
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

    //Création des Article du panier qui seront affichés.
    createPanier(){
        const keys = Object.keys(this.panier)
        keys.forEach(async (key) => {
            const articleInfo = await Article.getArticleInfo(key)
            const article = new Article(articleInfo)
            this.panierDiv.appendChild(article.createPanierArticle(this))
        })
    }

    //Méthode qui met a jour dans l'objet panier les quantité modifié depuis l'écran
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

    //Méthode gérant la suppression d'un article de la zone panier.
    deleteArticle(id){
        if(delete this.panier[id]){
            this.updateStorage()
            return true
        }
    }

    //Envoie des information de l'objet panier dans le localStorage pour le maintenir à jour
    updateStorage(){
        if(Object.keys(this.panier).length > 0){
            localStorage['panier'] = JSON.stringify(this.panier)
            this.updateTotalPrice()
        }
        else{
            delete localStorage['panier']
            this.totalPrice.textContent = "0€"
            this.articleNumber.textContent = 'Aucun article'
            location.reload()
        }
    }

    //Méthode qui modifie le prix total du panier ainsi que le nombre d'article.
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