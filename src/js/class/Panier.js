import Article from './Article.js'

export default class Panier{
    constructor(storage){
        if(storage.panier != undefined){
            this.panier = JSON.parse(storage.panier)
        }
    }

    createPanier(){
        const keys = Object.keys(this.panier)
        keys.forEach(async (key) => {
            const articleInfo = await Article.getOneArticle(key)
            const article = new Article(JSON.parse(articleInfo))
            article.createPanierArticle()
        })
    }
}