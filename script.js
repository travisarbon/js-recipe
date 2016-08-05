/**
 * Created by Travis on 8/5/2016.
 */
$(document).ready(function(){
    (function(){

        require(['marked'], function(marked){
            marked.setOptions({
                renderer: new marked.Renderer(),
                gfm: true,
                tables: true,
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartLists: true,
                smartypants: false
            });
        });

        var RecipeBox = React.createClass({

            getInitialState(){
                var arr = [];
                if(localStorage.getItem("RecipeBox") === null){
                    localStorage.setItem("RecipeBox", JSON.stringify(arr));
                } else {
                    arr = JSON.parse(localStorage.getItem("RecipeBox"));
                }
                return {
                    modalActive : false,
                    recipes : arr
                }
            },

            storeLocalRecipes : function(){
                if (typeof(Storage) !== "undefined") {
                    var arr = this.state.recipes;
                    localStorage.setItem("RecipeBox", JSON.stringify(arr));
                } else {}
            },

            toggleModal : function(){
                if(this.state.modalActive === false){
                    this.setState({modalActive : true});
                } else{
                    this.setState({modalActive : false});
                }
            },

            buildModal : function(){
                if(this.state.modalActive === true){
                    return (<RecipeModal ref = "modal" id = "myModal" toggleTheModal = {this.toggleModal} saveTheModal = {this.saveRecipe} nameValue = "Recipe Name" ingredientsValue = "Add ingredients here.... you can use markdown" instructionsValue = "Add instructions here.... you can use markdown"/>)
                } else {return(<div></div>)}
            },

            saveRecipe : function(name, ingredients, instructions, plainName, plainIngredients, plainInstructions, i){
                if(i === undefined){
                    var recipeFile = [name, ingredients, instructions, plainName, plainIngredients, plainInstructions];
                    var arr = this.state.recipes;
                    arr.push(recipeFile);
                    this.setState({recipes : arr});
                } else if(i !== undefined){
                    var recipeFile = [name, ingredients, instructions, plainName, plainIngredients, plainInstructions];
                    var arr = this.state.recipes;
                    arr[i] = recipeFile;
                    this.setState({recipes : arr});
                }
                this.storeLocalRecipes();
            },

            deleteRecipe : function(i){
                var arr = this.state.recipes;
                arr.splice(i, 1);
                this.setState({recipes : arr});
                this.storeLocalRecipes();
            },
            
            eachRecipe : function(selectedRecipe, i){
                return(
                    <Recipe className = "recipe-area" index = {i} name = {selectedRecipe[0]} ingredients = {selectedRecipe[1]} instructions = {selectedRecipe[2]} plainName = {selectedRecipe[3]} plainIngredients = {selectedRecipe[4]} plainInstructions = {selectedRecipe[5]}remove = {this.deleteRecipe} save = {this.saveRecipe}/>
                )
            },

            render : function(){
                return(
                    <div>
                        <div  className = "top-bar">
                        <button className = "btn addRecipe" onClick = {this.toggleModal}>Add Recipe</button>
                        </div>
                        {this.state.recipes.map(this.eachRecipe)}
                        {this.buildModal()}
                    </div>
                )
            }
        });

        var RecipeModal = React.createClass({

            saveModal : function(){
                var plainName = this.refs.nameBox.value;
                var recipeName = "<h3>" + this.refs.nameBox.value + "</h3>";
                var ingredients = this.refs.ingredientsBox.value;
                var instructions = this.refs.instructionsBox.value;
                var plainIngredients = this.refs.ingredientsBox.value;
                var plainInstructions = this.refs.instructionsBox.value;
                var marked = require('marked');
                this.props.saveTheModal(recipeName, marked(ingredients), marked(instructions), plainName, plainIngredients, plainInstructions);
                this.props.toggleTheModal();
            },

            exitModal : function(){
                this.props.toggleTheModal();
            },

            render : function(){
                return(
                    <div id = {this.props.id}  className = "modal">
                        <div className = "modal-content">
                            <div className = "modal-header ">
                                <span className = "close" onClick = {this.exitModal}>×</span>
                                <h2><textarea ref = "nameBox" className = "name-box well" defaultValue = {this.props.nameValue}/></h2>
                            </div>
                            <div className = "modal-body">
                                <h3>Ingredients</h3>
                                <textarea ref = "ingredientsBox" className = "ingredients-box well" defaultValue = {this.props.ingredientsValue}/>
                                <h3>Instructions</h3>
                                <textarea ref = "instructionsBox" className = "instructions-box well" defaultValue = {this.props.instructionsValue}/>
                            </div>
                            <div class="modal-footer">
                                <h4><button className = "btn modal-save" onClick = {this.saveModal}>Save</button></h4>
                            </div>
                        </div>
                    </div>
                )
            }
        });

        var Recipe = React.createClass({

            getInitialState : function(){
              return {
                  showInformation : false,
                  modalActive : false
              }
            },

            removeThis : function(){
                this.props.remove(this.props.index);
            },

            saveThis : function(name, ingredients, instructions, plainName, plainIngredients, plainInstructions, i){
                i = this.props.index;
                this.props.save(name, ingredients, instructions, plainName, plainIngredients, plainInstructions, i)
            },

            toggleModal : function(){
                if(this.state.modalActive === false){
                    this.setState({modalActive : true});
                } else{
                    this.setState({modalActive : false});
                }
            },

            buildModal : function(){
                if(this.state.modalActive === true){
                    return (<RecipeModal id = "myModal" toggleTheModal = {this.toggleModal} saveTheModal = {this.saveThis} nameValue = {this.props.plainName} ingredientsValue = {this.props.plainIngredients} instructionsValue = {this.props.plainInstructions}/>)
                } else {return(<div></div>)}
            },

            toggleInformation : function(){
                if(this.state.showInformation === true){
                    this.setState({showInformation : false});
                } else if(this.state.showInformation === false){
                    this.setState({showInformation : true});
                }
            },

            buildInformation : function(){
                if(this.state.showInformation === true){
                    return(
                        <div>
                            <RecipeInformation id = {this.props.index} name = {this.props.name} ingredients = {this.props.ingredients} instructions = {this.props.instructions}/>
                            <div className = "buttons-area">
                                <button onClick = {this.toggleModal} className = "edit-button btn">Edit</button>
                                <button onClick = {this.removeThis} className = "delete-button btn">Delete</button>
                            </div>
                            {this.buildModal()}
                        </div>
                    )
                } else {return(<div></div>)}
            },

            render : function(){
                return(<div className = "recipe-area">
                        <div onClick = {this.toggleInformation} className = "recipe-header btn btn-block" dangerouslySetInnerHTML = {{__html: this.props.name}}></div>
                        {this.buildInformation()}
                    </div>
                )
            }
        });

        var RecipeInformation = React.createClass({
            render : function(){
                return(
                    <div>
                        <div className = "ingredients-area">
                            <h4>Ingredients</h4>
                            <div className = "recipe-ingredients" dangerouslySetInnerHTML = {{__html: this.props.ingredients}}></div>
                        </div>
                        <div className = "instructions-area">
                            <h4>Instructions</h4>
                            <div className = "recipe-instructions" dangerouslySetInnerHTML = {{__html: this.props.instructions}}></div>
                        </div>
                    </div>
                )
            }
        });

        ReactDOM.render(<div>
        <RecipeBox/>
        </div>, document.getElementById("content"));

    })();
});