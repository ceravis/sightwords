


(typeof($) != 'undefined') && $(document).ready(function(){

  if (window.loadFirebugConsole){
    loadFirebugConsole();
  }

  $.fx.speeds._default = 200;
  var am = 1;
  
  
  
  var lists = [
    {
      name: 'Dolch nouns',  // Dolch word list: http://en.wikipedia.org/wiki/Dolch_word_list
      words: "apple,baby,back,ball,bear,bed,bell,bird,birthday,boat,box,boy,bread,brother,cake,car,cat,chair,chicken,children,Christmas,coat,corn,cow,day,dog,doll,door,duck,egg,eye,farm,farmer,father,feet,fire,fish,floor,flower,game,garden,girl,good-bye,grass,ground,hand,head,hill,home,horse,house,kitty,leg,letter,man,men,milk,money,morning,mother,name,nest,night,paper,party,picture,pig,rabbit,rain,ring,robin,Santa Claus,school,seed,sheep,shoe,sister,snow,song,squirrel,stick,street,sun,table,thing,time,top,toy,tree,watch,water,way,wind,window,wood".split(',')
    },
    {
      name: 'Dolch pre-primer',
      words: "a,and,away,big,blue,can,come,down,find,for,funny,go,help,here,I,in,is,it,jump,little,look,make,me,my,not,one,play,red,run,said,see,the,three,to,two,up,we,where,yellow,you".split(',')
    },
    {
      name: 'Dolch primer',
      words: "all,am,are,at,ate,be,black,brown,but,came,did,do,eat,four,get,good,have,he,into,like,must,new,no,now,on,our,out,please,pretty,ran,ride,saw,say,she,so,soon,that,there,they,this,too,under,want,was,well,went,what,white,who,will,with,yes".split(',')
    },
    {
      name: 'Dolch 1st grade',
      words: "after,again,an,any,as,ask,by,could,every,fly,from,give,giving,had,has,her,him,his,how,just,know,let,live,may,of,old,once,open,over,put,round,some,stop,take,thank,them,then,think,walk,were,when".split(',')
    },
    {
      name: 'Dolch 2nd grade',
      words: "always,around,because,been,before,best,both,buy,call,cold,does,don't,fast,first,five,found,gave,goes,green,its,made,many,off,or,pull,read,right,sing,sit,sleep,tell,their,these,those,upon,us,use,very,wash,which,why,wish,work,would,write,your".split(',')
    },
    {
      name: 'Dolch 3rd grade',
      words: "about,better,bring,carry,clean,cut,done,draw,drink,eight,fall,far,full,got,grow,hold,hot,hurt,if,keep,kind,laugh,light,long,much,myself,never,only,own,pick,seven,shall,show,six,small,start,ten,today,together,try,warm".split(',')
    },
    {
      name: 'Advanced',
      words: "alabaster,alligator,animal,asteroid,aunt,backhoe,bandage,basketball,beautiful,bicycle,blanket,blizzard,blue,breakdance,broccoli,brother,bulldozer,bumblebee,cabinet,calculator,cantaloupe,captain,castle,caterpillar,caution,ceiling,chicken,chocolate,circle,classroom,computer,constellation,conundrum,cousin,crack,crash,crocodile,crunch,cucumber,decision,dolphin,dragon,drawer,eagle,earthquake,earthworm,elbow,elephant,encourage,engine,evergreen,fountain,fragile,friend,grandfather,grandmother,hazard,helpful,hexagon,hurricane,icicle,jumprope,Jupiter,kangaroo,keyboard,knee,knight,knock,ladybug,laugh,library,lightning,listen,macaroni,magic,Mercury,midnight,mirror,mountain,movie,music,natural,neighbor,ocean,octagon,octopus,orange,ordinary,paradox,parallelogram,piano,pizza,playground,purple,puzzle,quickly,quiet,raspberry,rectangle,safety,sandwich,school,scientific,seesaw,shadow,shampoo,shoulder,slowly,solar system,sorry,spaghetti,special,splash,square,squirrel,stomach,sunrise,surprise,teacher,thunderstorm,tissue,toothbrush,tractor,trailer,triangle,tricycle,twilight,ultramarine,umbrella,uncle,vacuum,vegetable,violet,violin,volcano,watch,watermelon,white,yellow,yogurt,zebra".replace(/, /g, ',').split(',')
    },
    {
      name: 'Days, Months, Numbers',
      words: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday,January,February,March,April,May,June,July,August,September,October,November,December,one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,nineteen,twenty".split(',')
    },
    {
      name: '',
      words: "classified,missive,coverup,resulting,unintentional,collateral,consequences,mass,extinction,imminent".split(',')
    },
    {
      name: '',
      words: "await,further".split(',')
    }
  ];
  
  // combine all lists
  //lists.unshift({
    //name: 'all',
    //words: [].concat.apply([], $.map(lists, function(list){ return list.words; }))
  //});
  
  // echo sorted list to console
  //console.log(Array.prototype.sort.apply(lists[6].words, [function (a, b) {
    //return a.toLowerCase().localeCompare(b.toLowerCase());
  //}]).join(','));
  
  var activeListIndexes;
  var activeLists;
  var listTotalLength;
  
  var history;
  var historyLimit;
  var historyPosition;
  
  listSelect([6,7]);
  //listSelect([8]);
  //listSelect(); // select all lists
  
  var wordCount = 0;
  
  var maxFontSize = 200; // starting value, changed on window resize
  
  // collection of fonts to use and associated values for line-height calculations
  var fonts = [
    {
      fontClass: 'fontFamily-AverageSans',
      lineHeightFactor: .875
    },
    {
      fontClass: 'fontFamily-EBGaramond',
      lineHeightFactor: .9
    }
  ];
  var fontIndex = 1; // which font from above array to use
  
  var edgePanelHeightPercentage = 7.5; /* how much of screen height the edge panels should shrink to, can be overriden by min height below */
  var edgePanelMinHeightPixels = 40; /* should be roughly same as line height of panel label */

  var sizeWatch = [];
  







  
  

  function listSelect(listIndexes){
    if (!listIndexes){
      listIndexes = [];
      for (var i = 0; i < lists.length; i++){
        listIndexes.push(i);
      }
    }
    activeListIndexes = listIndexes;
    activeLists = [];
    listTotalLength = 0;
    _.each(activeListIndexes, function(index){ activeLists.push(lists[index]); listTotalLength += lists[index].words.length; });
    
    history = [];
    //historyLimit = Math.floor(listTotalLength / 2); // how many unique words before allowing a repeat; if this is >= list length, sequence will be the same when looping
    historyLimit = listTotalLength; // set limit to list length to ensure no repeats until all words are traversed - HOWEVER, upon looping, all words will be in exactly the same order
    historyPosition = 0;
  }

  // randomly get word from word list
  function getWord(){
    if (historyPosition > 0){
      $('.panelWord').addClass('inHistory');
      historyPosition--;
      return activeLists[history[historyPosition][0]].words[history[historyPosition][1]];
    }
    else {
      $('.panelWord').removeClass('inHistory');
    }

    wordCount++;
    if (wordCount == 24){
      //listSelect([9]);
    }
    else if (wordCount == 6){
      //listSelect([8]);
    }
    
    var listIndex, wordIndex;
    var i = 0; // how many times are we looping before finding a number not in the history?
    do {
      listIndex = Math.floor(Math.random() * (activeLists.length));
      wordIndex = Math.floor(Math.random() * (activeLists[listIndex].words.length));
      i++;
    } while (_.find(history, function(item){ return item[0] == listIndex && item[1] == wordIndex; }));
    
    // remove oldest index from end of history
    if (history.length >= Math.min(listTotalLength - 1, historyLimit)){
      history.pop(1);
    }
    
    // add this index to beginning of history
    history.unshift([listIndex, wordIndex]);
    
    // show word list name
    //$('.panelWordDetails').text(activeLists[listIndex].name);
    
    return activeLists[listIndex].words[wordIndex];
  }
  
  // adjust font size to fit within container
  function fitWord (el){
    // resize text in word panel
    maxFontSize = Math.floor(el.height() * .66);
    var lineHeight = Math.floor(el.height() * fonts[fontIndex].lineHeightFactor);
    el.css('line-height', lineHeight + 'px');
    el.quickfit({max: maxFontSize});
  }
  
  // word switch procedure
  function nextWord(){
    $('.word')
      .clearQueue()
      .fadeTo(200 * am, 0,
        function(){
          $('.word').text(getWord())
          fitWord($('.word'));
          $('body').removeClass('loading');
        })
      .fadeTo(200 * am, 1);
  }
  
  // go back in history
  function previousWord(){
    historyPosition = Math.min(historyPosition + 2, history.length);
    nextWord();
  }
  
  // determine 
  function getPanelDistancePercentage(){
    var windowHeight = $(document).height();
    var panelMinHeight = Math.max(windowHeight * edgePanelHeightPercentage / 100, edgePanelMinHeightPixels);
    return 100 - (panelMinHeight / windowHeight * 100);
  }
  
  // touch+click support for interactive elements (buttons, links, etc.)
  function touchClick(selector, action){
    // flag this as touch-enabled device, to prevent registering clicks on elements where touch events will be processed
    // otherwise clicks will be duplicates
    $('body').on('touchstart', selector, function(e) {
      $(this).addClass('touching');
    });

    // if a touch event has already occurred, abort click handler
    $('body').on('click', selector, function(){
      if ($(this).hasClass('touching')){
        e.preventDefault();
        return false;
      }
      else {
        action();
      }
    });

    // process touch events if available
    $('body').on('touchend', selector, function(e){
      setTimeout(function(){ // perform after a timeout to allow slower (mobile) devices to process *after* click event (which is slightly delayed)
        $(this).removeClass('touching'); // remove after each touch completes, in case this device support both mouse and touch and the user alternates between both
      }, 500);
      action();
    });
  }
  
  // custom element resize handler
  // checks width and height of el every interval ms, and executes action if either dimension has changed
  function onResize(el, action, interval){
    interval = interval || 25;
  
    // add unique tracking id to this element
    el.attr('sizeWatchId', sizeWatch.length);
    
    var watch = {
      el: el,
      width: el.width(),
      height: el.height(),
      action: action,
      
      timeoutId: setInterval(function(){
        var id = el.attr('sizeWatchId');
        if (sizeWatch[id]){
          var newWidth = el.width(), newHeight = el.height();
          
          // if current dimensions don't match most recently saved dimensions, save new dimensions and execute action
          if (newWidth != sizeWatch[id].width || newHeight != sizeWatch[id].height){
            sizeWatch[id].width = newWidth;
            sizeWatch[id].height = newHeight;
            action();
          }
        }
      }, interval)
    };
    
    // save this object for later retrieval
    sizeWatch.push(watch);
  }
  
  // stop custom resize handler for passed element
  function clearResize(el){
    var id = el.attr('sizeWatchId');
    
    if (sizeWatch[id]){
      clearInterval(sizeWatch[id].timeoutId);
    }
  }
  
  function panelTopExpand(){
    if (am){
      $('.panelWord')
        .clearQueue()
        .fadeTo(200 * am, 0)
        .animate({
          top: '75%',
          bottom: '5%',
          'border-radius': '10px 10px 0 0'
        }, 200 * am, function(){ $(this).fadeTo(200 * am, 1); });
      
      $('.panelTop').clearQueue().animate({bottom: '25%'}, 200 * am, function(){ $('.panelTop').addClass('expanded'); });
      
      $('.panelBottom').clearQueue().animate({top: '95%'}, 200 * am, function(){ $('.panelBottom').removeClass('expanded'); });
    }
    else {
      $('.panelWord')
        .clearQueue()
        .css({
          top: '75%',
          bottom: '5%',
          'border-radius': '10px 10px 0 0'
        });
      
      $('.panelTop').clearQueue().css({bottom: '25%'}).addClass('expanded');
      
      $('.panelBottom').clearQueue().css({top: '95%'}).removeClass('expanded');
    }
  }
  
  function panelBottomExpand(){
    if (am){
      $('.panelWord')
        .clearQueue()
        .fadeTo(200 * am, 0)
        .animate({
          bottom: '75%',
          top: '5%',
          'border-radius': '0 0 10px 10px'
        }, 200 * am, function(){ $(this).fadeTo(200 * am, 1); });
      
      $('.panelBottom').clearQueue().animate({top: '25%'}, 200 * am, function(){ $('.panelBottom').addClass('expanded'); });
      
      $('.panelTop').clearQueue().animate({bottom: '95%'}, 200 * am, function(){ $('.panelTop').removeClass('expanded'); });
    }
    else {
      $('.panelWord')
        .clearQueue()
        .css({
          bottom: '75%',
          top: '5%',
          'border-radius': '0 0 10px 10px'
        });
      
      $('.panelBottom').clearQueue().css({top: '25%'}).addClass('expanded');
      
      $('.panelTop').clearQueue().css({bottom: '95%'}).removeClass('expanded');
    }
  }
  
  function panelRestore(){
    if (am){
      $('.panelWord')
        .clearQueue()
        .fadeTo(200 * am, 0)
        .animate({
          top: '15%',
          bottom: '15%',
          'border-radius': '10px'
          //height: '400px'
        }, 200 * am, function(){ $(this).fadeTo(200 * am, 1); });
      
      $('.panelTop').clearQueue().animate({'bottom': getPanelDistancePercentage() + '%'}, 200 * am, function(){ $('.panelTop').removeClass('expanded'); });
      
      $('.panelBottom').clearQueue().animate({'top': getPanelDistancePercentage() + '%'}, 200 * am, function(){ $('.panelBottom').removeClass('expanded'); });
    }
    else {
      $('.panelWord').clearQueue().css({
        top: '15%',
        bottom: '15%',
        'border-radius': '10px'
      });
      
      $('.panelTop').clearQueue().css({'bottom': getPanelDistancePercentage() + '%'}).removeClass('expanded');
      
      $('.panelBottom').clearQueue().css({'top': getPanelDistancePercentage() + '%'}).removeClass('expanded');
    }
  }
  
  







  touchClick('.panelWord, .background', function(){
    nextWord();
  });
  
  touchClick('.panelTop', function(){
    if (!$('.panelTop').hasClass('expanded')){ // top panel not currently expanded
      panelTopExpand();
    }
    else { // top panel already expanded, so hide it and restore normal view
      panelRestore();
    }
  });
  
  touchClick('.panelBottom', function(){
    if (!$('.panelBottom').hasClass('expanded')){ // top panel not currently expanded
      panelBottomExpand();
    }
    else { // top panel already expanded, so hide it and restore normal view
      panelRestore();
    }
  });
  
  // on window resize, .panelWord is resized (according to css rules)
  // adjust font size and line-height accordingly
  $(window).resize(function(){
    // resize shrunken edge panels
    if (
      !$('body').hasClass('loading')
      &&
      !$('.panelTop').hasClass('expanded')
      &&
      !$('.panelBottom').hasClass('expanded')
    ){
      $('.panelTop').clearQueue().animate({'bottom': getPanelDistancePercentage() + '%'}, 200 * am);
      $('.panelBottom').clearQueue().animate({'top': getPanelDistancePercentage() + '%'}, 200 * am);
    }
    
    fitWord($('.word'));
  });
  
  // no div resize support in jQuery,
  //   and ba-resize plugin doesn't seem to work...
  //$('.panelWord').resize(function(){
    //console.log('panelWord resize');
    //fitWord($(this));
  //});
  
  onResize($('.panelWord'), function(){
    fitWord($('.word'));
  });
  
  
  
  // keyboard keyCodes
  var keys = {
    'space': 32,
    'left': 37,
    'right': 39,
    'up': 38,
    'down': 40,
    'esc': 27
  };
  
  // process keyboard input
  $(document).keydown(function(e){
    //console.log('keydown ' + e.keyCode);
    switch (e.keyCode) {
      case keys.space:
      case keys.right:
        nextWord();
        //e.preventDefault();
        //return false;
        break;
        
      case keys.left:
        previousWord();
        break;
        
      case keys.up:
        if ($('.panelTop, .panelBottom').hasClass('expanded')){
          panelRestore();
        }
        else {
          panelBottomExpand();
        }
        break;
        
      case keys.down:
        if ($('.panelTop, .panelBottom').hasClass('expanded')){
          panelRestore();
        }
        else {
          panelTopExpand();
        }
        break;
    }
  });
  

  




  
  
  // trigger resize handler once on page load
  $(window).triggerHandler('resize');

  // make sure panelWord and quickfit helper element use same font
  $('.panelWord, #meassure') 
    .removeClass(function(index, css){
      return (css.match (/\bfontFamily-\S+/g) || []).join(' ')
    })
    .addClass(fonts[fontIndex].fontClass);
    
  // do initial animation
  $('.panelWord')
    .removeClass(function(index, css){ return false; })
    .addClass(fonts[fontIndex].fontClass)
    .fadeTo(1000 * am, 1, function(){
      $('.word')
        .delay(2000)
        .fadeTo(400 * am, 0,
          function(){
            $('.word').text('touch to begin');
            fitWord($('.word'));
          })
        .fadeTo(400 * am, 1);
      });
  
  $('.panelTop').delay(750).fadeTo(200 * am, 1).delay(500).animate({'bottom': getPanelDistancePercentage() + '%'}); //, function(){ $('body').removeClass('loading'); });
  $('.panelBottom').delay(1000).fadeTo(200 * am, 1).delay(500).animate({'top': getPanelDistancePercentage() + '%'});

  
  
});
