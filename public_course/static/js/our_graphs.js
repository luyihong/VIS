// 前提"http://g.tbcdn.cn/bui/acharts/1.0.18/acharts.js"
function min(a){
  return Math.min.apply(null, a)
}
function max(a){
  return Math.max.apply(null, a)
}
//
//基本柱状图
//
function barChart(dataset,container,texts){
  // var texts = arguments[2] ? arguments[2] : {
  //   title:"柱状图",
  //   subtitle:"卢钇宏&黄弋珂",
  //   x:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  //   unit: '次',
  //   xname: '出现次数'}
  var chart = new AChart({
          id : container.id,
          theme : Chart.Theme.Smooth1,
          width : container.width,
          height : container.height,
          plotCfg : {
            margin : [50,50,80] //画板的边距
          },
          title : {
            text : texts.title
          },
          subTitle : {
            text : texts.subtitle
          },
          xAxis : {
            categories: texts.x,
            labels : {
              label : {
                rotate : 0,
                'text-anchor' : 'end'
              }
            }
          },
          yAxis : {
            min : min(dataset),
            max : max(dataset)
          },
          seriesOptions : { //设置多个序列共同的属性
            /*columnCfg : { //公共的样式在此配置
 
            }*/
          },
          tooltip : {
            valueSuffix : texts.unit
          },
          series : [ {
            name: texts.xname,
            type : 'column',
            data: dataset,
            labels : { //显示的文本信息
              label : {
                rotate : 0,
                x : 13,
                y : -20,
                'fill' : '#18AAD6',
                'text-anchor' : 'end',
                textShadow: '0 0 3px black',
                'font-size' : '14px'
              }
            }
 
          }]
 
        });
  return chart;
}
//
//折线图与柱状图多Y轴
//
function barLineCharMultiY(dataset,container,texts){
  //要求dataset多维数组

  // var texts = arguments[2] ? arguments[2] : {
  //   x:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  //   unit1: '个',
  //   unit2: '次',
  //   yname1: '出现个数',
  //   yname2:'出现次数'}
  var chart = new AChart({
          id : container.id,
          theme : Chart.Theme.Smooth1,
          width : container.width,
          height : container.height,
          plotCfg : {
            margin : [50,50,80] //画板的边距
          },
          xAxis : {
            categories: texts.x
          },
          yAxis : [{
            position : 'left',
          },{
            type : 'number',
            position : 'right',
            line : null,
            tickLine : null,
            labels : {
              label : {
                x : 12
              }
            },
            title : {
              text : texts.yname2,
              x : 40,
              rotate : 90
            }
          }],
          seriesOptions : { //设置多个序列共同的属性
            lineCfg : { //不同类型的图对应不同的共用属性，lineCfg,areaCfg,columnCfg等，type + Cfg 标示
              smooth : true
              
            }
          },
          series : [{
              name: texts.yname1,
              color: '#4572A7',
              type: 'column',
              yAxis: 1,
              data: dataset[0],
              suffix: texts.unit1
 
          }, {
              name: texts.yname2,
              color: '#89A54E',
              type: 'line',
              data: dataset[1],
              suffix: texts.unit2
          }]
              
        });
  return chart;
}
//
//雷达图
//
function radarChart(dataset,container,texts){
  // var texts = arguments[2] ? arguments[2] : {
  //   x:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
  //   xname: '出现次数'}
  var chart = new AChart({
 
      theme : AChart.Theme.Smooth2,
      id : container.id,
      width : container.width,
      height : container.height,
      plotCfg : {
        margin : [50,50,100]

      },
      xAxis : {
        type : 'circle',
        line : null,
        ticks : texts.x
      },
      yAxis : {
        title : null,
        type : 'radius',
        grid : {
          type : 'polygon' //圆形栅格，可以改成
        },
        labels : {
          label : {
            x : -12
          }
        },
        min : 0
      },

      series: [
        {
            name : texts.xname,
            type: 'line',
            data: dataset
        }
        ]
    });
  return chart;
}
//
//饼图
//
function pieChart(dataset,container,texts){
  // var texts = arguments[2] ? arguments[2] : {
  //   title:"环饼图",
  //   x:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']}
    var pairs=[]
    dataset.forEach(function(value,index){pairs[index]=[texts.x[index],value]})
    console.log(pairs)
  var chart = new AChart({
          id : container.id,
          theme : Chart.Theme.Smooth1,
          width : container.width,
          height : container.height,
          legend : null ,//不显示图例
          seriesOptions : { //设置多个序列共同的属性
            pieCfg : {
              allowPointSelect : true,
              labels : {
                distance : 40,
                label : {
                  //文本信息可以在此配置
                },
                renderer : function(value,item){ //格式化文本
                  return value + ' ' + (item.point.percent * 100).toFixed(2)  + '%';
                }
              }
            }
          },
          tooltip : {
            pointRenderer : function(point){
              return (point.percent * 100).toFixed(2)+ '%';
            }
          },
          series : [{
              type: 'pie',
              name: texts.title,
              legendType : 'circle', //显示在legend上的图形
              legend : {
                position : 'bottom', //位置
                back : null, //背景清空
                spacingX : 15, //增加x方向间距
                itemCfg : { //子项的配置信息
                  label : {
                    fill : '#999',
                    'text-anchor' : 'start',
                    cursor : 'pointer'
                  }
                }
              },
              events : {
                itemclick : function (ev) {
                  var point = ev.point
                    //item = ev.item, //点击的项
                  console.log(point); //执行一系列操作
                },
                //选中事件
                itemselected : function(ev){
                  console.log(ev.point.xValue + ' selected');
                },
                //取消选中
                itemunselected : function(ev){
                  console.log(ev.point.xValue + ' unselected');
                }
              },
              data: pairs
          }]
        });
  return chart;
}
//
//散列图
//
// function scatterChart(dataset,container,texts){
//    var texts = arguments[2] ? arguments[2] : {
//     title:"散列图",
//     subtitle:"卢钇宏&黄弋珂",
//     xAxiscategories:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
//     tooltipvalueSuffix : '次',
//     seriesname: '出现次数'}
//   return chart;
// }

//
//[词云](https://github.com/timdream/wordcloud2.js/blob/gh-pages/API.md)
//
function wordcloudCUC(container,picurl){
    var data=[['电影', 16], ['电影史', 3], ['美学', 5], ['风格', 3], ['作品', 8], ['音乐', 5], ['能力', 5], ['音乐剧', 2], ['深层', 2], ['艺术', 16], ['阶段', 2], ['历史', 6], ['人文精神', 2], ['中国', 10], ['音视频', 2], ['风格特征', 2], ['文化', 22], ['文学', 2], ['中外', 5], ['鉴赏力', 3], ['编创', 2], ['女性主义', 2], ['国外', 2], ['作者', 2], ['大师', 2], ['理论', 20], ['传媒', 4], ['现象', 2], ['影音', 2], ['传播媒介', 2], ['舞蹈', 3], ['教学', 6], ['规律', 4], ['实例', 2], ['典型', 2], ['领域', 2], ['影视剧', 3], ['方法', 9], ['影视', 11], ['基础', 2], ['传统', 4], ['方法论', 2], ['关联', 2], ['技巧', 5], ['女性', 2], ['视角', 4], ['创作实践', 2], ['素养', 8], ['技法', 2], ['影视音乐', 2], ['鉴赏能力', 2], ['经典作品', 2], ['思维', 5], ['可行性', 2], ['歌剧', 2], ['经典', 3], ['民族', 2], ['人际', 3], ['教学方式', 2], ['会计报表', 2], ['基础知识', 8], ['信息', 4], ['信息检索', 2], ['资源', 2], ['内容', 10], ['基本知识', 6], ['证券', 2], ['证券市场', 2], ['所学', 2], ['投资决策', 2], ['财务', 3], ['概念', 2], ['实务', 2], ['基本', 9], ['全球化', 2], ['基本技能', 2], ['技术', 11], ['市场', 2], ['营销学', 2], ['导论', 2], ['具体内容', 2], ['基本原理', 2], ['领导力', 2], ['体验式', 2], ['技能', 3], ['团队', 2], ['案例', 12], ['商业模式', 3], ['互联网', 4], ['创业', 4], ['创业者', 2], ['企业', 4], ['策划', 3], ['产品', 3], ['全面提高', 5], ['社会', 7], ['西方', 3], ['脉络', 2], ['人文', 2], ['影视作品', 2], ['学科', 4], ['职业', 3], ['特点', 2], ['本科生', 4], ['精神', 2], ['智慧', 2], ['人生', 2], ['评论', 2], ['心理学', 2], ['社会学', 2], ['应用性', 2], ['意义', 2], ['文本', 4], ['心理', 3], ['实用性', 2], ['传授', 2], ['侧重于', 2], ['维度', 2], ['大学生', 4], ['模型', 2], ['数据', 4], ['软件', 6], ['道德', 2], ['网络时代', 2], ['文明', 4], ['文明史', 2], ['人类', 2], ['跨文化', 2], ['问题', 3], ['媒介', 5], ['新闻', 2], ['前沿', 3], ['概论', 7], ['信息系统', 2], ['政治', 2], ['媒体', 4], ['特性', 2], ['困境', 2], ['日语', 2], ['零起点', 2], ['教材', 2], ['兴趣', 2], ['日本语', 2], ['语言', 3], ['音图学', 2], ['经典影视', 2], ['校级', 2], ['英语', 2], ['体验', 2], ['宇宙', 2], ['意识', 2], ['技战术', 2], ['视频', 3], ['现状', 2], ['篮球', 2], ['规则', 3], ['建模', 2], ['网络', 3], ['多媒体', 2], ['数字', 2], ['优缺点', 2], ['原理', 2], ['编辑', 2], ['微观', 2], ['宏观', 2], ['画面', 2], ['数据挖掘', 2], ['背景', 2], ['科学', 2], ['量子论', 2], ['天文', 2], ['通识', 2], ['全校', 3]];
    var option = {  
      fontSizeFactor: 0.2,                                    // 当词云值相差太大，可设置此值进字体行大小微调，默认0.1 
      maxFontSize: 40,
      minFontSize: 8,
            tooltip: {
                show: true,
                backgroundColor: '#53868B',
                formatter: function(item) {return item[0] + ' 标签出现次数:' +item[1]  } //显示备注
            },
            list: data,             //数据
            color: 'random-light',  //颜色色系 random-dark/light
            //shape: 'star',   //词云形状
            //ellipticity: 1     //椭圆率
            imageShape: picurl,
            backgroundColor: 'rgba(0,0,0,0)', //如果不是透明的话会超出边界 backgroundColor: '#949494'
        }
        var wc = new Js2WordCloud(container)
        wc.showLoading({       //过渡控制，显示loading
            //backgroundColor: '#fff',
            text: 'CUC公选课标签词云图',
            effect: 'spin'     //自旋转效果
        })
    setTimeout(function() {
      wc.hideLoading()
      wc.setOption(option)
    }, 500)
    
        window.onresize = function() { //监听svg大小变化，当容器大小变化时，调用此方法进行重绘
            wc.resize()
        }
}
function chordBar(container){
  var width = container.offsetWidth;
    var height = container.offsetHeight;
    var svg = d3.select("#svg6")//选择<div>     
          .append("svg")      //在<body>中添加<svg>
          .attr("width", width) //设定<svg>的宽度属性
          .attr("height", height);//设定<svg>的高度属性
    //悬浮标签
    var tooltip = d3.select("body").append("div").attr("class","tooltip");
    //1.生成假数据

    var faculty = [ "播音主持艺术学院","广告学院","国际传媒教育学院","经济与管理学院","理工学部","外国语学院","文法学部","新闻传播学部","艺术学部" ];

    //生成假数据：用于随机划分的函数
    function distribute(source){
      var result = [];
      var count = source.length;
      function divideN(total,count,result){
        if(count==1){
          result.push(total);
          return;
        } 
        if(count!=2){
          if(count%2!=0){
            var portion = Math.floor(total*Math.random());//先做一次
            for(var i=0 ; i<~~(count/2)-1 ; i++){//所以这里-1
              portion = Math.floor(portion*Math.random());
              // console.log(portion);
            }
            total = total - portion;
            result.push(portion);
            count--;
          }
          var portion = Math.floor(total*Math.random());
            total = total - portion;
            divideN(portion,count/2,result);
            divideN(total,count/2,result);
        }
        else{
          var portion = Math.floor(total*Math.random());
            total = total - portion;
            result.push(portion);
            result.push(total);
            return;
        }
      }
      for(i in source){
        var output = [];
        divideN(source[i],count,output);
        result.push(output);
      }
      return result;
    }
    var totalCount = [101,136,155,212,529,163,111,309,525];
    var studentChoices = distribute(totalCount);
    //检查分配结果
    //     for( i in studentChoices){
    //   var sum=0;
    //   for (j in studentChoices[i]){
    //     sum+=studentChoices[i][j]
    //   }
    //   console.log(sum)
    // }

    //2.转换数据
    var chord = d3.layout.chord()
                 .padding(0.03)
                 .sortSubgroups(d3.ascending)
                 .matrix(studentChoices);

    // console.log(chord.groups());
    // console.log(chord.chords());
       
    //3.绘制
    
    //弦图的<g>元素
    var gChord = svg.append("g")
            .attr("transform","translate(" + width/2 + "," + height/2 + ")");
    
    //节点的<g>元素
    var gOuter = gChord.append("g");

    //弦的<g>元素
    var gInner = gChord.append("g");

    //颜色比例尺
    var color20 = d3.scale.category20c();
    //字体大小线性比例尺（根据字段长）
    var fontSize = d3.scale.linear().domain([4,8]).range([16,10]);
    
    //绘制节点
    var innerRadius = (width>height?height:width)/2 * 0.7;
    var outerRadius = innerRadius * 1.1;
    
    //弧生成器
    var arcOuter =  d3.svg.arc()
           .innerRadius(innerRadius)
           .outerRadius(outerRadius);
    
    gOuter.selectAll(".outerPath")
        .data(chord.groups())
        .enter()
        .append("path")
        .attr("class","outerPath")
        .style("fill", function(d) { return color20(d.index); })
        .attr("d", arcOuter );
      
    gOuter.selectAll(".outerText")
        .data(chord.groups())
        .enter()
        .append("text")
        .each( function(d,i) {
          d.angle = (d.startAngle + d.endAngle)/2;
          d.name = faculty[i];
        })
        .attr("class","outerText")
        .attr("text-anchor","middle")
        .attr("dy",".35em")
        .attr("font-family","微软雅黑")
        .attr("transform", function(d){
          var result = "rotate(" + ( d.angle * 180 / Math.PI ) + ")";

          result += "translate(0,"+ -1.0 * ( outerRadius + 15 ) +")" ;
          
          if( d.angle > Math.PI * 3 / 4 &&  d.angle < Math.PI * 5 / 4 )
            result += "rotate(180)";
          
          return result;
        })
        .text(function(d){
          return d.name;
        })
        .attr("font-size",function(d){
          return fontSize(this.innerHTML.length);
        });


    //绘制弦
    var arcInner =  d3.svg.chord()
            .radius(innerRadius);
    
    gInner.selectAll(".innerPath")
      .data(chord.chords())
        .enter()
      .append("path")
      .attr("class","innerPath")
      .attr("d", arcInner )
        .style("fill", function(d) { return color20(d.source.index); });
    //交互
    gOuter.selectAll(".outerPath")
    .on("mouseover",function(d,i) {
        gInner.selectAll(".innerPath").filter(function(d){
                  return d.source.index!=i&&d.target.index!=i;
             })
            .transition()
            .style("opacity",0.2);    
        tooltip.transition()        
            .duration(10)
            .style("background",d3.rgb(this.style.fill).darker(3))
            .style("color",d3.rgb(this.style.fill).brighter(0.5))
            .style("border-color",d3.rgb(this.style.fill).brighter(0.5))
            .style("opacity", .9);      
        tooltip.html(d.name+"<br>2015级："+totalCount[i]+"人") 
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 48) + "px");    
        })
    .on("mousemove",function(d,i){
         tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 48) + "px");
         })   
    .on("mouseout",function(d,i) {    
        gInner.selectAll(".innerPath").filter(function(d){
                 return d.source.index!=i&&d.target.index!=i;
         })
        .transition()
        .style("opacity",1);  
        tooltip.transition()        
            .duration(500)      
            .style("opacity", 0);   
     });

    gInner.selectAll(".innerPath")
    .on("mouseover",function(d,i) {
        gInner.selectAll(".innerPath").filter(function(data){
                  return data.source.index!=d.source.index&&data.target.index!=d.source.index;
             })
            .transition()
            .style("opacity",0.2);    
        tooltip.transition()        
            .duration(10)
            .style("background",d3.rgb(this.style.fill).darker(3))
            .style("color",d3.rgb(this.style.fill).brighter(0.5))
            .style("border-color",d3.rgb(this.style.fill).brighter(0.5))
            .style("opacity", .9);      
        tooltip.html(faculty[d.source.index]+"<br>2015级："+totalCount[d.source.index]+"人") 
            .style("left", (d3.event.pageX) + "px")     
            .style("top", (d3.event.pageY - 48) + "px");    
        })
    .on("mousemove",function(d,i){
         tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 48) + "px");
         })   
    .on("mouseout",function(d,i) {    
        gInner.selectAll(".innerPath").filter(function(d){
                 return d.source.index!=i&&d.target.index!=i;
         })
        .transition()
        .style("opacity",1);  
        tooltip.transition()        
            .duration(500)      
            .style("opacity", 0);   
     });
    // function fade(opacity){
    //   return function(g,i){
    //     gInner.selectAll(".innerPath").filter(function(d){
    //       return d.source.index!=i&&d.target.index!=i;
    //     })
    //     .transition()
    //     .style("opacity",opacity);
    //   }
    // }
}
function fireworkChart() {

  var root;
  var svg = d3.select("#svg5");

  var force = d3.layout.force()
      .size([svg.width, svg.height])
      .on("tick", tick);

  var drag = force.drag()
    .on("dragstart",function(d){
        d.fixed=true;
    });

  var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");

  d3.json("courseJson.json", function(error, json) {
    if (error) throw error;
    root = json;
    update();
  });

  function update() {
    var nodes = flatten(root),
        links = d3.layout.tree().links(nodes);

    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip");

    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();
    console.log(nodes);

    // Update the links…
    link = link.data(links, function(d) { return d.target.id; });

    // Exit any old links.
    link.exit().remove();

    // Enter any new links.
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Update the nodes…
    node = node.data(nodes, function(d) {return d.id;}).style("fill", color);

    // Exit any old nodes.
    node.exit().remove();

    // Enter any new nodes.
    node.enter().append("g")
        .attr("class", "node")
        .on("click", click)
        .call(drag);

      node.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", function(d) { return d.type=="tag"?3:(d.credit*6 || 4.5) ; })
        .style("fill", color)
        .on("mouseover", function(d) {    
            console.log(tooltip);
              tooltip.transition()        
                  .duration(200)      
                  .style("opacity", .9);      
              tooltip.html(d.name) 
                  .style("left", (d3.event.pageX) + "px")     
                  .style("top", (d3.event.pageY - 28) + "px");    
              })   
           .on("mousemove",function(d){
          tooltip.style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
      })               
          .on("mouseout", function(d) {       
              tooltip.transition()        
                  .duration(500)      
                  .style("opacity", 0);   
          });

      node.append("text")
        .attr("class", "text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("font-size",function(d){return d.type=="tag"?10:d.type=="course"?15:30})
        .text(function(d) { if(!d.type ) {return d.name ;} });
        
  }

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  function color(d) {
    return d._children ? "#DFAF20" : d.children ? "#DC9FB4": "#E87A90";
  }

  // Toggle children on click.
  function click(d) {
    if (!d3.event.defaultPrevented) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update();
    }
  }

  // Returns a list of all nodes under the root.
  function flatten(root) {
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      if (!node.id) node.id = ++i;
      nodes.push(node);
    }

    recurse(root);
    return nodes;
  }
}

