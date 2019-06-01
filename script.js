$(document).ready(function(){
  //Heandlebars
  var template_html = $('#film_template').html();
  var template_handlebars = Handlebars.compile(template_html);
  var flag_ok = ['en','it','fr','es','ja','no', 'sv'];
  var img_url_base = 'https://image.tmdb.org/t/p/';
  var dimensione_poster = 'w185';

  //Funzione per la chiamata ajax per la ricerca dei film (una sola chiamata con 2 tipi)
  function ajaxCall(search_film, tipo){
    //Dichiaro la variabile con gli oggetti obbligatori api-key e query
    var required = {
      'api_key': '6cad8518ef509ac317e34c091336d237',
      'query': search_film,
    }
    $.ajax({
      'url': 'https://api.themoviedb.org/3/search/' + tipo,
      'method': 'GET',
      'data' : required, //passo a data gli oggetti obbligatori dichiarati con la variabile
      'success': function(data_response){
        output (data_response, tipo);
      },
      'error': function(){
        alert('errore')
      }
    });

    //Funzione che stampa a video le informazioni dei film con i parametri che passo
    function output(information, tipo){
      var results = information.results;
      var copertina_var = tipo.results;

      for (var i = 0; i < results.length; i++) {
        var voto = get_numero_stelline(parseFloat(results[i].vote_average));
        var html_stelline = get_html_stelline(voto);
        var lingua = get_flag_language(results[i].original_language);

        if(results[i].poster_path == null){
          var url_poster = "img/image_not_available.png";
        } else {
          var url_poster = img_url_base + dimensione_poster + results[i].poster_path;
        }

        if (tipo == "movie") {
          //Se non c'è l'immagine, gli attribuisco il valore di un immagine NOT AVAILABLE
          //Dichiaro una variabile per il poster composta da immagine, dimensione e risultato
          var heandlebars_variable = {
            'titolo': results[i].title,
            'titolo_originale': results[i].original_title,
            'lingua_originale': lingua,
            'rating': html_stelline,
            'copertina': url_poster
          };
        } else {
          var heandlebars_variable = {
            'titolo': results[i].name,
            'titolo_originale': results[i].original_name,
            'lingua_originale': lingua,
            'rating': html_stelline,
            'copertina': url_poster
          };
        }

      var ended = template_handlebars(heandlebars_variable);
      $('.schede_film').append(ended);
      }
    }
  }

  //Quando clicco sul bottone search compare a video l input
  $('.button_search').click(function(){
    input();
  });

  var tipoChiamata = ["movie", "tv"];

  //Funzione per resettare il contenitore
  function input() {
    $('.container .schede_film').empty();
    var search_film = $('.input_search').val();
    for (var i = 0; i < tipoChiamata.length; i++) {
      ajaxCall(search_film, tipoChiamata[i]);
    }
    $('.input_search').val('');
  }

  //Intercetto il tasto invio
  $('.input_search').keypress(function(){
    if(event.which==13){
      input();
    }
  });

  //Genero una funzione per trasformare i numeri in interi per eccesso
  function get_numero_stelline (voto) {
    var stelline = Math.ceil(voto/2);
    return stelline;
  }

  function get_html_stelline(n_stelline){
    var icone_stelline = '';

    //Da 0 a 5 per generarmi 5 stelline che poi saranno piene o vuote in base al voto
    for (var i = 0; i < 5; i++){
      if(i < n_stelline){
        icone_stelline += '<i class="fas fa-star"></i>';
      }else{
        icone_stelline += '<i class="far fa-star"></i>';
      }
    }
    return icone_stelline;
  }

  //Genero una funzione per le bandierine assegnandogli l'array di flag e poi
  //ritornandogli il percorso immagini assegnandogli la lingua
  function get_flag_language(lingua){
    var bandiera = lingua;
    if(flag_ok.includes(lingua)){
      bandiera = '<img src= "img/'+ lingua +'.png">';
    }
    return bandiera;
  }
  
  //Appena si apre la pagina, richiamo l'API, per far apparire le card del film scelto da me,
  //quindi per popolare subito la pagina
  for (var i = 0; i < tipoChiamata.length; i++) {
    ajaxCall("viking", tipoChiamata[i]);
  }

});
