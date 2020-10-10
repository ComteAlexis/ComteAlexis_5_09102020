import Article from './class/Article.js'
import Panier from './class/Panier.js'

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
    if(localStorage['panier'] != null){
        const panier =  new Panier(localStorage)
        panier.createPanier()

        const form = document.querySelector('.form')
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log(e)
            const firstName = form.querySelector('#firstName').value
            const lastName = form.querySelector('#lastName').value
            const address = form.querySelector('#address').value
            const city = form.querySelector('#city').value
            const email = form.querySelector('#email').value
            const contact = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                email: email
            }
            panier.orderPanier(contact).then((result) => {
                if(result){
                    window.location.href = 'order.html'
                }
            })
            
        })
    }
}

if(path[path.length - 1].match(/(order\.html)/gm)){
    if(localStorage.order != undefined){
        const order = JSON.parse(localStorage.order)
        const orderDiv = document.querySelector('#order')
        const name = orderDiv.querySelector('h2')
        const orderId = orderDiv.querySelector('.commande-link')
        name.textContent = 'Merci ' + order.contact.firstName + ' !'
        orderId.textContent = order.orderId
    }
}
