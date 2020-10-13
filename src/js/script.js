import Article from './class/Article.js'
import Panier from './class/Panier.js'

const shop = document.querySelector('.shop')
const product = document.querySelector('#article')
let article = []

//Fonction qui divise l'url en plusieur morceau.
//ex 'orinoco.fr/fr' devien un tableau ['orinoco.fr', 'fr']
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

//Fonction qui regarde l'url de la page et cherche les paramètre lui étant donné
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

//Gestion de la page index
if(path[path.length - 1].match(/(index\.html)/gm) || path[path.length - 1].match(/(\.html)/gm) == null){
    //Récupere toutes les information des articles dans l'API et créait et rend les articles à l'écran.
    Article.getArticleInfo().then((articlesList) => {
        let articles = []
        articlesList.forEach((articleInfo) => {
            articles.push(new Article(articleInfo))
        })
        
        articles.forEach((article) => {
            shop.appendChild(article.createBoutiqueArticle())
        })
    })
    .catch((errorMessage) => {
        const p = document.createElement('p')
        p.textContent = errorMessage
        shop.appendChild(p)
    });
}

//Gestion de la page product
if(path[path.length - 1].match(/(product\.html)/gm)){
    //Récupere les données d'un article est le génère dans la page product
    Article.getArticleInfo($_GET('id')).then((article) => {
        product.appendChild(new Article(article).createProductArticle())
    }).catch((error) => {
        alert(error)
        document.location.href = 'index.html'
    })
}

//Gestion de la page panier
if(path[path.length - 1].match(/(panier\.html)/gm)){

    const form = document.querySelector('.form')

    //regarder si le panier n'est pas vide et éffectue un traitement si non vide
    if(JSON.stringify(localStorage['panier']) != undefined){
        const panier =  new Panier(localStorage)
        panier.createPanier()

        //Ajoute un écouteur qui envoie un évenement a la soumission du formulaire.
        
        form.addEventListener('submit', (e) => {
            e.preventDefault()
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
    else{
        form.addEventListener('submit', (e) => {
            e.preventDefault()
            alert('aucun item dans le panier.')
            document.location.href = 'index.html'
        })
    }
}

//Gestion de la page order
if(path[path.length - 1].match(/(order\.html)/gm)){
    //Vérifie si une commande à été passé, si oui le remerci et génére une page lui donnant sont id de commande.
    if(localStorage.order != undefined){
        const order = JSON.parse(localStorage.order)
        const orderDiv = document.querySelector('#order')
        const name = orderDiv.querySelector('h2')
        const orderId = orderDiv.querySelector('.commande-link')
        name.textContent = 'Merci ' + order.contact.firstName + ' !'
        orderId.textContent = order.orderId
        delete localStorage['order']
    }
    else{
        document.location.href = 'panier.html'
    }
}
