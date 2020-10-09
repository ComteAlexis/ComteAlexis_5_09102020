import Article from './class/Article.js'

const shop = document.querySelector('.shop')
const product = document.querySelector('#article')
let article = []

function arrayParam(path){
    let pathUrl = path.split('/')
    for(let i = 0; i < pathUrl.length; i++){
        if(pathUrl[i] == ''){
            pathUrl.splice(i, 1)
            i--
        }
    }
    return pathUrl
}
const path = arrayParam(window.location.pathname)

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

if(path[path.length - 1].match(/(index\.html)/gm) || path[path.length - 1].match(/(\.html)/gm) == null){
    Article.getArticleInfo().then((articlesList) => {
        let articles = []
        articlesList.forEach((articleInfo) => {
            articles.push(new Article(articleInfo))
        })
        articles.forEach((article) => {
            shop.appendChild(article.createBoutiqueArticle())
        })
    })
}

if(path[path.length - 1].match(/(product\.html)/gm)){
    Article.getArticleInfo($_GET('id')).then((article) => {
        product.appendChild(new Article(article).createProductArticle())
    })
}

if(path[path.length - 1].match(/(panier\.html)/gm)){
    
}
