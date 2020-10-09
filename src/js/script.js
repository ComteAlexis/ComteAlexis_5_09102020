import Article from './class/Article.js'

const shop = document.querySelector('.shop')

Article.getArticleInfo().then((articlesList) => {
    let articles = []
    articlesList.forEach((articleInfo) => {
        console.log(articleInfo)
        articles.push(new Article(articleInfo._id, articleInfo.name, articleInfo.description, articleInfo.imageUrl, articleInfo.price))
    })
    articles.forEach((article) => {
        shop.appendChild(article.createBoutiqueArticle())
    })
})

