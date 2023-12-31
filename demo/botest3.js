const players = [{uid: '1', name: 'player1', gold: 12000, cs:[], hb: false},{uid: '2', name: 'player2', gold: 14000, cs:[], hb: false}, {uid: '3', name: 'player3', gold: 22000, cs:[], hb:false}];
let mainCards = [];
let crTurn = 1;
let endGame = false;

const changeTurn = function(){
    for( let i=0; i<4; i++ ){
        if( i===crTurn ) $('#list'+i).addClass('act');
        else $('#list'+i).removeClass('act');
    }

    if( crTurn === 0 ){ // is me
        $('#control').show();
    }else{
        $('#control').hide();
        botChoice();
    }
};

const filterArray = function(ranks, rank2s){
    let i;
    rank2s.forEach((item)=>{
        i = ranks.indexOf(item);
        if( i !== -1 ) ranks.splice(i,1);
    });
};

const showMessage = function(s){
    const $elm = $('#message');
    $elm.html(s).show();
    setTimeout(()=>{
        $elm.html('').hide();
    }, 2000);
};

const chiabai = function(){
    players.forEach((player)=>{
        player.cs = [];
        player.hb = false;
    });

    let arr = [];
    for(let i=0; i<52; i++){
        arr.push(i);
    }
    let _id = 0;
    players.forEach((player)=>{
        for( let i=0; i<13; i++ ){
            _id = Math.floor(Math.random() * arr.length);
            player.cs.push( arr[_id] );
            arr.splice(_id, 1);
        }
        player.cs.sort((a, b)=>{
            return a-b;
        });
    });

    renderTable();
};

const playerBet = function(arr){
    $('#control').hide();

    if( !arr || !arr.length ){ // bo bai
        players[crTurn].hb = true;
        if( crTurn === 0 ) $('#control').hide();
        const elm = $('#list'+crTurn);

        elm.addClass('bobai');

        let countP = 0;
        players.forEach((player)=>{
            if( !player.hb ) countP++;
        });

        if( countP < 2 ){ // new round
            setTimeout(()=>{
                for( let i=0; i<players.length; i++ ){
                    $('#list'+i).removeClass('bobai');
                }
            }, 1500);

            players.forEach((player, index)=>{
                if( !player.hb ) crTurn = index;
                player.hb = false;
            });
            mainCards = [];
        }else{
            let arrS = [0,1,2,3,0,1,2,3];
            let crS = arrS.indexOf(crTurn);
            for( let i=crS+1; i<arrS.length; i++ ){
                if( players[arrS[i]] && !players[arrS[i]].hb ){
                    crTurn = arrS[i];
                    break;
                }
            }
        }

        setTimeout(function(){
            changeTurn();
        }, 2000);
        return;
    }

    arr.sort((a,b)=>{
        return a-b;
    });

    // check trust arr
    // code
    // 

    filterArray(players[ crTurn ].cs, arr);

    mainCards = [...arr];

    if( crTurn === 0 ){
        $('#list'+crTurn+'>img').each(function(){
            let cid = parseInt($(this).attr('data-cid'));
            if( arr.indexOf(cid) !== -1 ){
                $(this).addClass('act').delay(500).animate({width: 'toggle'});
            }
        });
        setTimeout(function(){
            renderTable();
        }, 900);
    }else{
        let pos = $('#list'+crTurn).position();
        $('<img class="card-anim" src="./img/card/00.png"/>')
        .css({
            top: pos.top,
            left: pos.left
        })
        .appendTo('#khung').animate({
            top: '40%',
            left: '50%'
        }, 400, function(){
            $('.card-anim').remove();
            renderTable();
        });
    }

    let arrS = [0,1,2,3,0,1,2,3];
    let crS = arrS.indexOf(crTurn);
    for( let i=crS+1; i<arrS.length; i++ ){
        if( players[arrS[i]] && !players[arrS[i]].hb ){
            crTurn = arrS[i];
            break;
        }
    }

    setTimeout(()=>{
        if( players.some( player=> player.cs.length === 0)){
            setTimeout(()=>{
                showMessage('Kết thúc');
                renderTable(true);
            }, 500);
            endGame = true;
        }else{
            changeTurn();
        }
    }, crTurn === 0? 2300:2000);
};

const renderTable = function(showAll){
    players.forEach((player, index)=>{
        let s = '';
        if( index === 0 ){ // is me, show card
            let nhacs = [];
            $('#list0 img').each(function(){
                if( $(this).position().top < -5 ) nhacs.push( parseInt($(this).attr('data-cid')) );
            });

            for(let i=0; i<players[index].cs.length; i++){
                s += '<img data-cid="'+ players[index].cs[i] +'" src="./img/card/'+ players[index].cs[i] +'.png" class="'+ (nhacs.indexOf(players[index].cs[i]) !== -1?'act':'') +'">';
            }    
        }else if( showAll ){
            for(let i=0; i<players[index].cs.length; i++){
                s += '<img data-cid="'+ players[index].cs[i] +'" src="./img/card/'+ players[index].cs[i] +'.png">';
            }
        }else if( players[index].cs.length ){
            s = '<img src="./img/card/00.png"/><span>'+ players[index].cs.length +'</span>';
        }
        $('#list'+index).html(s);
    });

    let s5 = '';
    for(let i=0; i<mainCards.length; i++){
        s5 += '<img src="./img/card/'+ mainCards[i] +'.png">';
    }

    setTimeout(()=>{
        $('#list-tb').html(s5);
    }, 300);

    $('#list0 img').off('click').on('click', function(){
        $(this).toggleClass('act');
        return false;
    });
};

const botChoice = function(){
    // https://turing-mark-391110.as.r.appspot.com/tlmn/bot
    // http://localhost:8080/tlmn/bot
    const sendObj = {ps:[], ct: crTurn}; // Không gửi thừa dữ liệu. object gửi đi chỉ chưa tối đa 4 thuộc tính ps,ct,mc,if
    if( mainCards && mainCards.length ) sendObj.mc = mainCards;
    // if( isFirst ) sendObj.if = 1;

    players.forEach(function(player, index){
        let aPlayer = {cs: player.cs};
        if( player.hb ) aPlayer.hb = 1;

        if( index === 0 ) aPlayer.ir = 1; // người thật, nếu muốn bot ưu tiên triệt hạ người này thì đặt=1( nên đặt vào 1 người thật chưa bỏ bài )

        sendObj.ps.push(aPlayer); // Không gửi thừa dữ liệu. list ps chỉ chứa tối đa 3 thuộc tính: cs , hb, ir
    });

    $.ajax({
        type: "POST",
        url: "https://turing-mark-391110.as.r.appspot.com/tlmn/bot",
        data: JSON.stringify(sendObj),
        contentType: 'application/json',
        success: function(data){
            if( !data ){
                console.log('Error');
                return;
            }

            if( !data.err ){
                playerBet(data.cs); return;
            }
            // check data.err code
        }
    });
};

$(function(){
    //// init button
    $('#btn-danh').click(function(){
        if( endGame ) return;
        if( crTurn ) return false;
        let cards = [];
        $('#list0>img').each(function(){
            if( $(this).position().top < -5 ){
                cards.push( parseInt( $(this).attr('data-cid') ) );
            }
        });

        if( !cards.length ){
            showMessage('Chưa chọn bài');
            return false;
        }
        showMessage('người thật đánh, cần kiểm tra bộ bài đánh là hợp lệ trước');
        // add code
        //
        playerBet(cards);
        return false;
    });

    $('#btn-bo').click(function(){
        if( endGame ) return;
        if( crTurn ) return false;
        playerBet(null);
        return false;
    });

    ///
    chiabai();
    changeTurn();
});