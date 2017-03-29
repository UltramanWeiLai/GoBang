//gobang
(function(){
	//定义变量
	var chess = document.getElementById('chess'),//获取画布
		ctx = chess.getContext('2d'),//设置画布渲染
		bg = new Image(),//创建图片对象
		me = true,//棋手标记 true为玩家下棋，false为电脑下棋
		count = [],//棋盘计数，用于存储棋盘上各个点是否有落子，且落子属于谁的 （chessBoard）
		wins = [],//赢法数组
		winCount = 0,//赢法统计数组，用于统计一共有多少种赢法 （count）
		myWin = [],//玩家的赢法统计
		computerWin = [],//电脑的赢法统计
		over = false;//对局是否结束标记
	
	var GoBang = {
		//入口
		init: function(){
			var _this = this;
			return (function(){
				//变量初始化
				_this.initializa();
				//图片加载点
				bg.onload = function(){
					ctx.drawImage(bg, 0,0,450,450);
					//绘制棋盘
					_this.drawChessBoard();
				};
				//落子事件绑定
				chess.onclick = function(e){
					//判断对局是否完成或是否是轮到自己下棋，对局完成和不是自己下棋就会跳出循环
					if(over || me == false) return;
					//获取鼠标点击位置坐标，并转换为落点坐标
					var x = e.offsetX,
						y = e.offsetY;
					x = Math.floor(x / 30);
					y = Math.floor(y / 30);
					//判断当前落点是否已有棋子，如果没有则落子成功
					if(count[x][y] == 0){
						_this.oneStep(x, y, me);
						count[x][y] = 1;
						for(var k = 0; k < winCount; k++){
							if(wins[x][y][k]){
								myWin[k]++;
								computerWin[k] = 999;
								if(myWin[k] == 5){
									alert('你赢了');
									over = true;
								}
							}
						}
						//判断对局是否没结束，如果是将换成电脑下子
						if(over == false){
							me = !me;
							_this.computerAI();
						}
					}
				};
			})();
		},
		//变量&初始化&参数设置
		initializa: function(){
			return (function(){
				//线条颜色
				ctx.strokeStyle = '#333';
				//创建背景图片
				bg.src = './img/timg.jpg';
				
				//棋盘落子计数 count 用来计算棋盘上那些点位有落子
				for(var i = 0; i < 15; i++){
					count[i] = [];
					for(var j = 0; j < 15; j++){
						count[i][j] = 0;
					}
				}
				
				//赢法数组 wins
				for(var i = 0; i < 15; i++){
					wins[i] = [];
					for(var j = 0; j < 15; j++){
						wins[i][j] = [];
					}
				}
				//赢法总类统计 winCount 统计各类赢法总数 共计572种
				for(var i = 0; i < 15; i++){//横
					for(var j = 0; j < 11; j++){
						for(var k = 0; k < 5; k++){
							wins[i][j + k][winCount] = true;
						}
						winCount++;
					}
				}
				for(var i = 0; i < 15; i++){//竖
					for(var j = 0; j < 11; j++){
						for(var k = 0; k < 5; k++){
							wins[j + k][i][winCount] = true;
						}
						winCount++;
					}
				}
				for(var i = 0; i < 11; i++){//斜
					for(var j = 0; j < 11; j++){
						for(var k = 0; k < 5; k++){
							wins[i + k][j + k][winCount] = true;
						}
						winCount++;
					}
				}
				for(var i = 0; i < 11; i++){//反斜
					for(var j = 14; j > 3; j--){
						for(var k = 0; k < 5; k++){
							wins[i + k][j - k][winCount] = true;
						}
						winCount++;
					}
				}
				
				//赢法计数 myWin computerWin 分别计算选手获胜的可能
				for(var i = 0; i < winCount; i++){
					myWin[i] = 0;
					computerWin[i] = 0;
				}
			})();
		},
		//绘制棋盘
		drawChessBoard: function(){
			return (function(){
				for(var i = 0; i < 15; i++) {
					//横
					ctx.moveTo(15, 15 + i * 30);
					ctx.lineTo(435, 15 + i * 30);
					ctx.stroke();
					//竖
					ctx.moveTo(15 + i * 30, 15);
					ctx.lineTo(15 + i * 30, 435);
					ctx.stroke();
				}
			})();
		},
		//绘制棋子
		oneStep: function(i,j,me){
			return(function(){
				//阴影
				ctx.shadowOffsetX = 1.5;
				ctx.shadowOffsetY = 2;
				ctx.shadowBlur = 3;
				ctx.shadowColor = '#333';
				//圆
				ctx.beginPath();
				ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
				ctx.closePath();
				//径向渐变
				var gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
				if(me){
					gradient.addColorStop(0, '#0a0a0a');
					gradient.addColorStop(1, '#636766');
				}else{
					gradient.addColorStop(0, '#d1d1d1');
					gradient.addColorStop(1, '#f9f9f9');
				}
				ctx.fillStyle = gradient;
				ctx.fill();
				
			})();
		},
		//电脑AI
		computerAI: function(){
			var _this = this;
			return (function(){
				//定义变量，分数统计数组和坐标存储变量
				var myScore = [],
					computerScore = [],
					max = u = v = 0;
				//分数统计初始化
				for(var i = 0; i < 15; i++){
					myScore[i] = [];
					computerScore[i] = [];
					for(var j = 0; j < 15; j++){
						myScore[i][j] = 0;
						computerScore[i][j] = 0;
					}
				}
				//分数（权重）统计&计算，获取坐标
				for(var i = 0; i < 15; i++){
					for(var j = 0; j < 15; j++){
						//判断当前位置是否没有落子
						if(count[i][j] == 0){
							//计算分数
							for(var k = 0; k < winCount; k++){
								if(wins[i][j][k]){
									switch (myWin[k]){
										case 1: myScore[i][j] += 200;
											break;
										case 2: myScore[i][j] += 400;
											break;
										case 3: myScore[i][j] += 2000;
											break;
										case 4: myScore[i][j] += 10000;
											//break;
									}
									
									switch (computerWin[k]){
										case 1: computerScore[i][j] += 220;
											break;
										case 2: computerScore[i][j] += 420;
											break;
										case 3: computerScore[i][j] += 2100;
											break;
										case 4: computerScore[i][j] += 20000;
											//break;
									}
								}
							}
							//通过判断获取最优的落子点
							if(myScore[i][j] > max){
								max = myScore[i][j];
								u = i;
								v = j;
							}else if(myScore[i][j] == max){
								if(computerScore[i][j] > computerScore[u][v]){
									u = i;
									v = j
								}
							}
							
							if(computerScore[i][j] > max){
								max = computerScore[i][j];
								u = i;
								v = j;
							}else if(computerScore[i][j] == max){
								if(myScore[i][j] > myScore[u][v]){
									u = i;
									v = j
								}
							}
						}
					}
				}
				_this.oneStep(u, v, me);
				count[u][v] = 2;
				//判断当前落点是否已有棋子，如果没有则落子成功，如果有则后台提示
				for(var k = 0; k < winCount; k++){
					if(wins[u][v][k]){
						computerWin[k]++;
						myWin[k] = 999;
						if(computerWin[k] == 5){
							alert('计算机赢了');
							over = true;
						}
					}
				}
				if(over == false){
					me = !me;
				}
			})();
		}
	};
	//执行代码
	GoBang.init();	
})();
