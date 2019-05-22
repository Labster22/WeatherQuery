var express= require('express');

var http= require('http');

var app = new express();

var bodyParser = require('body-parser');


app.set('view engine','ejs');
//修改ejs文档的读取路径
app.set('views','./express/views');

//配置body-parser
app.use(bodyParser.urlencoded({ extended:false}));

app.use(bodyParser.json());


app.get('/',function (req,res) {

    res.render('login');

});

app.post('/query',function(req,res){
    console.log('area:',req.body.area);
    var options={
        host:"apis.juhe.cn",
        path:encodeURI("/simpleWeather/query?city="+req.body.area+"&key=2c49bdc27909a7cc98e0ba7e1dea9ce5"),
        method:'get'
    };
    console.log('options',options);
    var sendmsg='';
    var request=http.request(options,function(response){
        response.on("data",function(chunk){
            sendmsg+=chunk;
            console.log(sendmsg);
        });

        response.on("end",function(d){
            var list=JSON.parse(sendmsg);
            console.log('list:',list);
            console.log(list.result.city);

            res.render('weather',{
                city:list.result.city,
                temperature:list.result.realtime.temperature,
                info:list.result.realtime.info,
                direct:list.result.realtime.direct,
                future:list.result.future,
            })
        });
    });
    request.end();

});

app.listen('3002');