/*
 * Create a list that holds all of your cards
 */
var cards = ["fa fa-diamond",
		"fa fa-paper-plane-o",
		"fa fa-anchor",
		"fa fa-bolt",
		"fa fa-cube",
		"fa fa-leaf",
		"fa fa-bicycle",
		"fa fa-bomb",
		"fa fa-diamond",
		"fa fa-paper-plane-o",
		"fa fa-anchor",
		"fa fa-bolt",
		"fa fa-cube",
		"fa fa-leaf",
		"fa fa-bicycle",
		"fa fa-bomb"];

class_name1 = null;//第一张卡片className
class_name2 = null;//第二张卡片className
board1 = null;//第一张卡片
board2 = null;//第二张卡片
number = null;//记录步数（翻开两张图片算一步）
formerlyCard = null;//比对成功或已经打开的图片
cardsOK = [];//匹配成功的className
isTimeStart = true;//判断是否启动计时器的标志位
overStart = 0;
cardsOKLength = null;//记录已经翻开的牌的对数

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
cards = shuffle(cards);
$('.card').each(function(i,el){
		// $(this).attr('class','card');
		$(this).children().attr("class",cards[i]);
		
	});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


//刷新按钮点击事件监听
$(".btn").click(function(){
	addClassName();
	
});


//翻牌点击事件监听
$("ul.deck").delegate("li","click",function(){
	if(isTimeStart){
		start();
		isTimeStart = false;
	}
	

	//判断图片是否已经被翻开，如果是翻开状态什么都不做
	formerlyCard = $(this).attr('class');
	if("card animated headShake open show" == formerlyCard || "card animated headShake match" == formerlyCard){
		return;
	}

    //翻牌
	draw(this);
	//记录图片
	if(class_name1 == null){
		class_name1 = getIclass(this);
		board1 = $(this);
		// formerlyCard.push($(this).attr('class'));
	}else{
		class_name2 = getIclass(this);
		if(class_name1 != null && class_name2 != null){

			board2 = $(this);
			// formerlyCard.push($(this).attr('class'));
			contrast(board1,board2,class_name1,class_name2);
			//清空之前的className
			class_name1 = null;
			class_name2 = null;
		}
	}
	
});

//翻牌
var draw = function(aa){
	$(aa).addClass("animated headShake");
	$(aa).toggleClass("open show");//给点击到的卡牌设置翻牌属性

}

//比对图片是否相同,不相同就把牌盖上
var contrast = function(aa1,aa2,name1,name2){
	
	if(name1 === name2){
	//相同
		$(aa1).toggleClass("open show");
		$(aa1).toggleClass("match");
		$(aa2).toggleClass("open show");
		$(aa2).toggleClass("match");
		$(aa1).addClass("animated headShake");
		$(aa2).addClass("animated headShake");
		cardsOK.push(name1);

	}else{
		//不相同,1.5秒后将牌盖上
		setTimeout(function(){
			close(aa1,aa2,name1,name2);
		},1000);
	}
	number += 1;//记录步数
	$(".moves").html(number);
	overStart = grade(number);

	cardsOKLength = cardsOK.length;
	if(isGameOver(cardsOKLength)){//游戏结束
		stop();
		sweep();
		showModal();
	}
}

//将牌重新盖起来
var close = function(aa1,aa2,name1,name2){
    $(aa1).toggleClass("open show");
    $(aa2).toggleClass("open show");
    $(aa1).toggleClass("animated headShake");
    $(aa2).toggleClass("animated headShake");
    formerlyCard.slice(-1,2);
}

/**
*	星级评分
*
*/
var grade = function(num){
	if(num === 15){
		$('.startLi3').addClass("animated bounceOutUp");
		return 2;
	}
	if(num === 20){
		$('.startLi2').addClass("animated bounceOutUp");
		return 1;
	}
}

/**
*	恢复星星
*
*/
var restoreStars = function(num){
	if(num < 15){
		return;
	}
	if(num >= 20){
		$('.startLi2').toggleClass("animated bounceOutUp");
		
	}
	if(num >= 15 || num < 19){
		$('.startLi3').toggleClass("animated bounceOutUp");
		
	}
}

/**
* 判断时候结束游戏(所有的牌都被翻开并且全部匹配成功)
* num
*/
var isGameOver = function(num){
	if(num === 8){
		return true;
	}
}

//清除数据
var sweep = function(){
	class_name1 = null;
	class_name2 = null;
	board1 = null;
	board2 = null;
}

/**
*	弹出对话框
*
**/
var e1;
var showModal = function (){
    var time = $('.seconds').html();
    $('#showTime').html("您共用时"+time+"秒");
    
   e1 = document.getElementById('modal-overlay');            
   e1.style.visibility = (e1.style.visibility == "visible")? "hidden" : "visible";
}

//关闭模态窗口
var closeModal = function(){
	e1.style.visibility = "hidden";
	addClassName();
}

//获得被点击的图片的className
var getIclass = function(my){
	var iclass = $(my).children(my).attr('class').split(' ')[1];
	return iclass;
}

//刷新按钮功能
var addClassName = function(){
	// grade();
	cardsOKLength = 0;
	cardsOK = [];
	restoreStars(number);
	Reset();
	isTimeStart = true;
	number = null;
	$(".moves").html(0);
	cards = shuffle(cards);
	$('.card').each(function(i,el){
		$(this).attr('class','card');
		$(this).children().attr("class",cards[i]);
		
	});

}




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



	var second = 0;// 秒
    var millisecond=0;//毫秒
    var int;
    /**
    *重置
    */
    var Reset = function (){
    	// stop();
      window.clearInterval(int);
      millisecond=second=0;
      $('.seconds').html(second);
    }
  
    var start = function (){//开始
      int=setInterval(timer,50);

    }
  
    var timer = function (){//计时
      millisecond=millisecond+50;
      if(millisecond>=1000){
      
        millisecond=0;
        second=second+1;
        $('.seconds').html(second);
      }
   
    }

    function stop(){//暂停
      window.clearInterval(int);
    }
  


