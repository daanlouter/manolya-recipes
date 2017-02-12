var recepten = [{"recipe_id":"raspberryfriands","recipe_name":"Raspberry Friands","introduction":"Lily Vanilli’s second book ‘Sweet Tooth’ is full of baking technique essentials, original recipes and tips - a perfect combination. Her redcurrant friands recipe results in pretty, chewy cakes that are full of flavour. You better make sure to grab the largest lemon you can find and zest every inch of it, as the zest works just perfectly with the rich ground almonds. The original recipe makes 12 friands, but since the recipe is easy to half, I usually make 6 and it works perfectly. ","ingredients":"For 6 friands\n\nPlain flour, 45g\nIcing sugar, 100g\nPinch of sea salt\nGround almonds, 90g\nGrated zest of 1 lemon\n3 medium egg whites\nUnsalted butter, 100g\n\n12 raspberries\nHandful of flaked almonds\n\n6-hole or 12-hole cupcake tray","methods":"Preheat the oven to 180°C, fan assisted. Grease the cupcake tray.\n\nMelt the butter with lemon zest. Leave to cool. [photos=raspberryfriands1#s,raspberryfriands2#s]\n\nMix the flour with the icing sugar and sift into a large bowl. Add a pinch of salt and the ground almonds, mix well and set aside. [photos=raspberryfriands3#m]\n\nWhip up the egg whites. Mix until you have stiff peaks. [photos=raspberryfriands4#s,raspberryfriands5#s]\n\nFold the egg whites into the flour mix. [photos=raspberryfriands6#m]\n\nSlowly mix in the cooled butter. Getting the butter to incorporate into the batter can take a bit long, so try this: first put about 1/4 of the batter into the melted butter, and mix well. Then pour this mixture into the large bowl of batter and stir. [photos=raspberryfriands7#m]\n\nSpoon, pipe, or simply pour the batter into the cupcake tray. Neatly arrange the raspberries and flaked almonds on top. Bake in the oven for about 20 minutes, check after 15 minutes. They are ready when a skewer inserted into the centre comes out clean.\n\nTake out of the oven and leave to cool in the tin for about 10 minutes. Then put them on a wired rack to cool completely, or better, eat them while still warm. [photos=raspberryfriands8#m]\n\nSlightly adapted from Redcurrant Friands by Lily Vanilli (Sweet Tooth)\n","data_crunch":"","data_sweetness":"","color_main":"","color_accent":""}]
processData();
// Tabletop.init({ 
// 	key: '1_zYMEbsB4REbLtF6zZC9uibh8-waNa22fzvAUDBrWsI',
// 	wanted: ['recepten'],
// 	callback: function(data, tabletop) { 
// 		recepten = data.recepten.elements;
// 		console.log(JSON.stringify(recepten));
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