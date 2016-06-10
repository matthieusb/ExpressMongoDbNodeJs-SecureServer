var appAperture = angular.module("ApertureApp",["ngStorage"]);

appAperture.controller("apiController", function($scope, $localStorage) {
    // ------------------------
    // GENERAL
    // ------------------------

    $scope.isUndefined = function (thing) {
        return (typeof thing === "undefined");
    };

    $scope.choices = [{id: 'choice1'}];

    $scope.addNewChoice = function() {
        var newItemNo = $scope.choices.length+1;
        $scope.choices.push({'id':'choice'+newItemNo});
    };

    $scope.removeChoice = function() {
        var lastItem = $scope.choices.length-1;
        $scope.choices.splice(lastItem);
    };

    // ------------------------
    // APPELS ROUTES SECURE
    // ------------------------

    $scope.getUtilisateurs = function() {
        $.ajax({
            type: "POST",
            url: "/api/utilisateurs",
            headers: {'x-access-token': $localStorage.token},
            success: function(data) {
                console.log("Utilisateurs obtenus !");
                console.log(JSON.stringify(data));
                $scope.resultsUtilisateurs=data;
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
                alert("Vous devez être loggué pour que cette opération fonctionne");
            }
        })
    };

    $scope.supprimerSalleSelonIdClicIcone = function(idToDelete) {
        $('#salle_id_delete').val(idToDelete._id); //On change l'id de la case des id
        $scope.supprimerSalleSelonId();
    };

    $scope.supprimerSalleSelonId = function() {
        $.ajax({
            type: "DELETE",
            url: "/api/salle/"+$('#salle_id_delete').val(),
            headers: {'x-access-token': $localStorage.token},
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.message) {
                    console.log("Salle supprimée !");

                    $scope.getSalles();
                    //$scope.resultSujetsSelonId = undefined;
                    //$scope.resultSallesSelonId = undefined;
                    //$scope.resultsSujets = undefined;
                    //$scope.resultsUtilisateurs = undefined;
                } else {
                    alert("Suppression impossible !");
                }
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
                alert("Vous devez être loggué pour que cette opération fonctionne");
            }
        })
    };

    $scope.supprimerSujetSelonIdClicIcone = function(idToDelete) {
        $('#sujet_id_delete').val(idToDelete._id); //On change l'id de la case des id
        $scope.supprimerSujetSelonId();
    };

    $scope.supprimerSujetSelonId = function() {
        $.ajax({
            type: "DELETE",
            url: "/api/sujet/"+$('#sujet_id_delete').val(),
            headers: {'x-access-token': $localStorage.token},
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.message) {
                    console.log("Sujet supprimée !");

                    $scope.getSujets();
                    //$scope.resultSujetsSelonId = undefined;
                    //$scope.resultSallesSelonId = undefined;
                    //$scope.resultsSalles = undefined;
                    //$scope.resultsUtilisateurs = undefined;
                } else {
                    alert("Suppression impossible !");
                }
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
                alert("Vous devez être loggué pour que cette opération fonctionne");
            }
        })
    };

    //Ajout d'une salle de test
    $scope.ajouterSalle = function() {
        var nom = $("#nomSalle").val();
        var num = $("#numeroSalle").val();

        $.ajax({
            type: "POST",
            url: "/api/ajouter/salle",
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': $localStorage.token},
            data: $.param({nom: nom,num: num}),
            success: function(data) {
                console.log(data);
                if (!data.message) {//Si erreur de login
                    $("#errorAjoutSalle").html('<em>Erreur rencontrée, peut-être que la salle existe déjà</em><br/>');
                } else {
                    $("#errorAjoutSalle").html('<em>Salle ajoutée !</em><br/>');
                    $scope.getSalles();
                }
            },

            error: function(data){
                console.log(data);
                $("#errorAjoutSalle").html('<em>Erreur rencontrée, logguez-vous</em><br/>');
            }
        })
    };

    //Ajout d'un sujet de test
    $scope.ajouterSujet = function() {
        var nom = $("#nomSujet").val();

        //On va chercher tous les champs des salles
        var idSalles = [];
        $('#sallesToAddSujet :selected').each(function(i, selected) {
            var tmp = $(selected).text().split("-",1).join("");
            if (!(tmp in idSalles)) {//On ajoute seulement si le numéro n'y est pas déjà
                idSalles[i] = $(selected).text().split("-",1).join("").trim();
            }
        });

        $.ajax({
            type: "POST",
            url: "/api/ajouter/sujet",
            headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': $localStorage.token},
            data: $.param({nom: nom, idSalles : idSalles}),
            success: function(data) {
                console.log(data);
                if (!data.message) {//Si erreur de login
                    $("#errorAjoutSujet").html('<em>Erreur rencontrée, peut-être que le sujet existe déjà</em><br/>');
                } else {
                    $("#errorAjoutSujet").html('<em>Sujet ajouté !</em><br/>');
                    $scope.getSujets();
                }
            },

            error: function(data){
                console.log(data);
                $("#errorAjoutSujet").html('<em>Erreur rencontrée, logguez-vous</em><br/>');
            }
        })
    };

    // ------------------------
    // APPELS ROUTES NON SECURE
    // ------------------------
    $scope.getSalles = function() {
        $.ajax({
            type: "GET",
            url: "/api/salles",
            success: function(data) {
                console.log("Salles obtenues !");
                console.log(JSON.stringify(data));
                $scope.resultsSalles=data;
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
            }
        })
    };

    $scope.getUneSalleSelonId = function() {
        $.ajax({
            type: "GET",
            url: "/api/salle/"+$('#salle_id').val(),
            success: function(data) {
                console.log("Salle obtenue !");
                console.log(JSON.stringify(data));
                if(data._id) {
                    $scope.resultSallesSelonId=data;

                    $scope.resultSujetsSelonId = undefined;
                    $scope.resultsSujets = undefined;
                    $scope.resultsUtilisateurs = undefined;
                } else {
                    //alert("Id de la salle incorrect");
                }
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
            }
        })
    };


    $scope.getSujets= function() {
        $.ajax({
            type: "GET",
            url: "/api/sujets",
            success: function(data) {
                console.log("Sujets obtenus !");
                console.log(JSON.stringify(data));

                data.forEach(function(element, index, array) {
                    element.salles.forEach(function(element2, index2, array2) {
                        array2[index2] = JSON.stringify(element2.numero);
                    });
                });

                $scope.resultsSujets=data;
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
            }
        })
    };

    $scope.getUnSujetSelonId = function() {
        $.ajax({
            type: "GET",
            url: "/api/sujet/"+$('#sujet_id').val(),
            success: function(data) {
                console.log("Sujet obtenu !");
                console.log(JSON.stringify(data));

                if(data._id) {

                    data.salles.forEach(function(element, index, array) {
                        array[index] = JSON.stringify(element.numero);
                    });


                    $scope.resultSujetsSelonId=data;

                    $scope.resultsSalles = undefined;
                    $scope.resultsUtilisateurs = undefined;
                } else {
                    //alert("Id de la salle incorrect");
                }
                $scope.$digest();
            },

            error: function(data){
                console.log(data);
            }
        })
    };

    // ------------------------
    // CONNEXION
    // ------------------------
    $scope.showConnexion=$scope.isUndefined($localStorage.token);

    //Obtention du token via le login
    $scope.login = function() {
        var login = $("#login").val();
        var pass = $("#pass").val();

        $.ajax({
            type: "POST",
            url: "/api/getToken",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({login: login,pass: pass}),
            success: function(data) {
                console.log(data);
                if (!data.success) {//Si erreur de login
                    $("#errorLogin").html('<em>Erreur login/mot de passe</em><br/>');
                } else {
                    $localStorage.token=data.token;
                    $("#errorLogin").html('');
                    $scope.showConnexion=$scope.isUndefined($localStorage.token);
                    $scope.$digest(); //Important pour bien mettre à jour le scope (Car on est dans un callback ajax)
                }
            },

            error: function(data){
                console.log(data);
            }
        })
    };

    $scope.deconnexion = function() {
        console.log("Resetting local storage");
        $localStorage.$reset();
        $scope.resultsUtilisateurs = undefined;
        $scope.showConnexion=$scope.isUndefined($localStorage.token);
    };

    $scope.voirToken = function() {
        console.log($localStorage.token);
    };
});