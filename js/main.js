var recepten = [{"recipe_id":"raspberryfriands","recipe_name":"Raspberry Friands","introduction":"Lily Vanilli’s second book ‘Sweet Tooth’ is a perfect combination of baking techniques, recipes and tips. The first recipe I tried out was her redcurrant friands recipe, which resulted in pretty, chewy and light cakes. I especially love the generous amount of lemon zest used. The only thing I changed was swapping the redcurrants for raspberries. This recipe makes 12 friands, but you can easily half the recipe as I did, as shown in the pictures.","ingredients":"Plain flour, 90gr, 180gr\nIcing sugar, 40gr, 13gr","methods":"Preheat the oven to 180°C, fan assisted. Grease the cupcake tray. [photos=whisk#s,cream#m,bloodoranges#l]\n\nWhisk together the flour and icing sugar in a bowl, then whisk in the salt, ground almonds and lemon zest.","data_crunch":"","data_sweetness":""}];
processData();
// Tabletop.init({ 
// 	key: '1_zYMEbsB4REbLtF6zZC9uibh8-waNa22fzvAUDBrWsI',
// 	wanted: ['recepten'],
// 	callback: function(data, tabletop) { 
// 		recepten = data.recepten.elements;
// 		processData();
// 	}
// })

function processData(){
	processedRecepten = recepten.map(function(row){
		var recipe = {};


		//Basics
		recipe.introduction = row.introduction
			.split('\n')
			.filter(function(i){
				return i;
			});

		recipe.id = row.recipe_id;
		recipe.name = row.recipe_name;



		// Methods
		recipe.methods = row.methods
			.split('\n')
			.filter(function(j){
				return j;
			})
			.map(function(j){
				var hasPhotos = j.indexOf('[photos=') > -1 ? true : false;
				if(!hasPhotos){
					return {
						text: j
					}
				}
				else{
					var photos = j.split('[photos=')[1]
						.replace(']','')
						.split(',')

					photos = photos.map(function(k){
						var photo = k.split('#');
						return {
							filename: 	photo[0],
							size: 		photo[1]
						}
					})

					return {
						text: j.replace(/\[.*?\]/g, ""),
						photos: photos
					}
				}
			})



		//Ingredients
		recipe.ingredients = row.ingredients.split('\n');
		recipe.ingredients = recipe.ingredients.map(function(ingredient){
			var measures = ingredient.split('\, ');
			return {
				ingredient: measures[0],
				us: 		measures[1],
				uk: 		measures[2]  
			}
		})


		// data
		recipe.data = {};
		_.each(row,function(value,key){
			if(key.indexOf('data_') > -1){
				var newKey = key.replace('data_','');
				recipe.data[newKey] = value;
			}
		})

		return recipe;
	})
	recepten = processedRecepten;
	console.log(recepten[0]);
	render();
}

function render(){
	var template = $.get('../home.html',loadRactive)

	function loadRactive(){
		var ractive = new Ractive({
			el: 'content',
			template: template.responseText,
			data: { 
				home: false, 
				recipes: recepten,
				assetPath: 'http://localhost:8080/assets/imgs',
				currentRecipe: recepten[0]
			}
	    });
	}
	
}