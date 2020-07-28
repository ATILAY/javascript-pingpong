    (function () {
        var CSS = {
            arena: {
                width: 900,
                height: 600,
                background: '#D4F5F5',
                position: 'fixed',
                top: '50%',
                left: '50%',
                zIndex: '999',//'1020', //'999',
                transform: 'translate(-50%, -50%)'
            },
            ball: {
                width: 15,
                height: 15,
                position: 'absolute',
                top: 0,
                left: 350,
                borderRadius: 50,
                background: '#C6A62F'
            },
            line: {
                width: 0,
                height: 600,
                borderLeft: '2px dashed #8C9A9E',
                position: 'absolute',
                top: 0,
                left: '50%'
            },
            gameStick: {
                width: 12,
                height: 85,
                position: 'absolute',
                background: '#C6A62F'
            },
            stick1: {
                left: 0,
                top: 150
            },
            stick2: {
                left: 888,
                top: 150
            },
            score:{
                width: 50,
                height: 50,
                position: 'absolute',
                borderRadius: 20,
                background: '#C6A62F',
                color: '#F0FFF0',
                textAlign:'center',
                lineHeight: 1.5,
                fontSize: 30
            },
            score1:{
                top: 550,
                left: 400
            },
            score2:{
                top: 550,
                left: 450   
            },
            userInstruction:{
                top: 2,
                left: 2,
                fontSize: 15,
                height: 30,
                position: 'absolute',
                background: 'transparent',
                color: '#C6A62F',
                textAlign:'center',
                lineHeight: 1.5,
                fontStyle: "italic"
            },
            
        };

        var CONSTS = {
            gameSpeed: 20,
            score1: 0,
            score2: 0,
            stick1Speed: 0,
            stick2Speed: 0,
            ballTopSpeed: 0,
            ballLeftSpeed: 0,
        };

        function start() {
            draw();
            setEvents();
            roll();
            loop();
        }

        function draw() {
            $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
            $('<div/>', {id: 'userInstruction'}).css(CSS.userInstruction).appendTo('#pong-game');
            $('<div/>', {id: 'score1'}).css($.extend(CSS.score, CSS.score1)).appendTo('#pong-game');
            $('<div/>', {id: 'score2'}).css($.extend(CSS.score, CSS.score2)).appendTo('#pong-game');
            $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
            $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
            $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.gameStick))
            .appendTo('#pong-game');
            $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.gameStick))
            .appendTo('#pong-game');

            $('#userInstruction').text("To control left corner use W or S. And for right corner arrow up or arrow down");

            if(localStorage.getItem("CONSTS.score1") && localStorage.getItem("CONSTS.score2")){
                let score1 = parseInt(localStorage.getItem("CONSTS.score1"));
                let score2 = parseInt(localStorage.getItem("CONSTS.score2"));

                $('#score1').text(score1);
                $('#score2').text(score2);
            } else {
            $('#score1').text(CONSTS.score1);
            $('#score2').text(CONSTS.score2);
            }
        }

        function setEvents() {
            //user 1
            $(document).on('keydown', function (e) {
                if (e.keyCode == 87) {
                    CONSTS.stick1Speed = -66;
                }
            });

            $(document).on('keyup', function (e) {
                if (e.keyCode == 87) {
                    CONSTS.stick1Speed = 0;
                }
            });

            $(document).on('keydown', function (e) {
                if (e.keyCode == 83) {
                    CONSTS.stick1Speed = 30; //66;
                }
            });
            
            $(document).on('keyup', function (e) {
                if (e.keyCode == 83) {
                    CONSTS.stick1Speed = 0;
                }
            });

            //user2
            $(document).on('keydown', function (e) {
                if (e.keyCode == 38) {
                    CONSTS.stick2Speed = -30; //-66;
                }
            });

            $(document).on('keyup', function (e) {
                if (e.keyCode == 38) {
                    CONSTS.stick2Speed = 0;
                }
            });

            $(document).on('keydown', function (e) {
                if (e.keyCode == 40) {
                    CONSTS.stick2Speed = 30;
                }
            });
            
            $(document).on('keyup', function (e) {
                if (e.keyCode == 40) {
                    CONSTS.stick2Speed = 0;
                }
            });

        }

        function loop() {
            window.pongLoopGame = setInterval(function () {
                CSS.stick1.top += CONSTS.stick1Speed;
                CSS.stick2.top += CONSTS.stick2Speed;
                $('#stick-1').css('top', CSS.stick1.top);
                $('#stick-2').css('top', CSS.stick2.top);

                CSS.ball.top += CONSTS.ballTopSpeed;
                CSS.ball.left += CONSTS.ballLeftSpeed;


                //when faced top or bottom surface
                if (CSS.ball.top <= 0 ||
                    CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                    CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
                }
                
                //literal situations for  ball

                //when faced left side
                if (CSS.ball.left <= CSS.gameStick.width) {

                    (CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.gameStick.height) ? (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1):rightWin();
                }
                //when faced right side
                if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.gameStick.width) {

                    (CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.gameStick.height) ? (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1):leftWin();
                }
                
                $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            }, CONSTS.gameSpeed);
        }
        function restart(){
            clearInterval(window.pongLoopGame);
            CONSTS.score1 = 0;
            CONSTS.score2 = 0;
            
            localStorage.removeItem("CONSTS.score1");
            localStorage.removeItem("CONSTS.score2");
            
            $('#score1').text(CONSTS.score1);
            $('#score2').text(CONSTS.score2);
            loop();
        }

        function leftWin(){
        CONSTS.score1 = CONSTS.score1 + 1;
        localStorage.setItem("CONSTS.score1", CONSTS.score1);
        $('#score1').text(CONSTS.score1);
        if(CONSTS.score1 === 5){
            alert("LEFT SIDE WIN!!");
            restart();
        }else if(CONSTS.score1 < 5 ){
            //local save
            localStorage.setItem("CONSTS.score2", CONSTS.score2);
        }

        roll();
        }

        function rightWin(){
        CONSTS.score2 = CONSTS.score2 + 1;
        $('#score2').text(CONSTS.score2);
        roll(); 
        if(CONSTS.score2 === 5){
            alert("RIGHT SIDE WIN!!");
            restart();
        }else if(CONSTS.score2 < 5 ){
            //local save
            localStorage.setItem("CONSTS.score2", CONSTS.score2);
        }
        }

        function roll() {

            CSS.ball.top = 250;
            CSS.ball.left = 350;

            var side = -1;

            if (Math.random() < 0.5) {
                side = 1;
            }

            CONSTS.ballTopSpeed = Math.random() * -2 - 3;
            CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
        }

        start();
    })();