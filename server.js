var http = require('http'),
    url = require('url');
    parse = require('url').parse,
    qs = require('querystring');
    items = [];

var server = http.createServer(function (req, res) {
    switch(req.method) {

        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk){
                item += chunk;
            });

            req.on('end', function(){
                items.push(qs.parse(item).item);
                res.writeHead(303, { 'location': '/', });
                res.end();
            });
        break;

        case 'GET':
            // Inline HTML and CSS stored in 'html'
            var html = "<!DOCTYPE html>"
                +"<html>"
                    + "<head>"
                        +"<meta charset='utf-8'>"
                        +"<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0' />"
                        +"<title>Nodejs Shopping List</title>"
                        // CSS reset + styles
                        +"<style>a,abbr,acronym,address,applet,article,aside,audio,b,big,blockquote,body,canvas,caption,center,cite,code,dd,del,details,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,html,i,iframe,img,ins,kbd,label,legend,li,mark,menu,nav,object,ol,output,p,pre,q,ruby,s,samp,section,small,span,strike,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,tt,u,ul,var,video{margin:0;padding:0;border:0;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:after,blockquote:before,q:after,q:before{content:'';content:none}table{border-collapse:collapse;border-spacing:0}body{font-family:Arial}.container{margin:auto;position:relative;top:60px;height:auto;min-height:400px;width:575px;background-color:#D0D0D0;opacity:.7;border-radius:5px}.container h1{position:relative;font-size:36px;padding:40px 29px 10px 0;text-align:center}#item{width:380px;font-size:24px;text-align:left;margin:8px 0 5px 76px}input:focus{outline:0}.container ul{padding-top:15px;text-align:left;position:relative}.container li{padding:10px 0 0;font-size:24px}#shoppingList{padding-bottom:40px}.icon{position:relative;display:inline-block;top:3px;cursor:pointer}#delete{position:relative;top:-29px;right:10px;float:right;background-color:#902020;color:#fff;border:none;border-radius:20px;width:30px;height:30px;font-size:15px;line-height:25px}#put{position:relative;top:-29px;right:77px;float:right;color:#fff;border:none;border-radius:20px;width:30px;height:30px;font-size:15px;background-color:#B38A30;line-height:30px}#listItem{width:380px;font-size:24px;text-align:left;margin-left:76px;background-color:transparent;border:none;cursor:pointer}#listItem:hover{background-color:#C8C6C6}#listItem:active,#listItem:focus{background-color:#FFF}.add{position:relative;background-color:#13713C;color:#fff;border:none;border-radius:20px;width:30px;height:30px;font-size:15px;left:6px;bottom:4px}button{cursor:pointer}@media (max-width:600px){.container h1{font-size:40px}.container{width:95%}#item{width:70%;margin:8px 4px 5px 29px}#add{padding:0 2px 0 0}.container ul{padding:10px 0 10px 26px}.container li{font-size:20px}}@media (max-width:535px){.container{top:10px}}@media (max-width:450px){#listItem,#item{width:65%;margin:8px 4px 5px 10px}.container ul{padding:10px 0 10px 6px}}</style>"
                        +"<script src='https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>"
                    + "</head>"
                    + "<body>"
                        +"<div class='container'>"
                        + "<h1>Shopping List</h1>"
                        + "<form action='/' method='post'>"
                            + "<input type='text' id='item' name='item' placeholder='What do you need?'>"
                            + "<button class='add'>+</button>"
                        + "</form>"
                        + "<div class='list'>"
                            + "<div id='shoppingList'></div>"
                            + "</div>"
                        + "</div>"
                        + "<script type='text/javascript'>"
                         + "var input = $('#listItem'),"
                         +      "output = '<ul>',"
                                // Converting JS value to JSON string
                         +      "items = " + JSON.stringify(items) + ";"
                         + "for (var i = 0; i < items.length; i++) {"
                            + "output += '<li>' +"
                               // including input for PUT updates, buttons for PUT and DELETE.
                               + "'<input type=\"text\" name=\"updatedItem\" id=\"listItem\" value=\"' + items[i] + '\" />' +"                               
                               + "'<form action=\"/' + i + '\" method=\"put\"><button id=\"put\">^</button></form></li>' +"
                               + "'<form action=\"/' + i + '\" method=\"delete\"><button id=\"delete\">x</button></form>' ;"
                         + "}"
                         + "output += '</ul>';"
                         + "document.getElementById('shoppingList').innerHTML = output;"
                            + "$('form[method=\"put\"]').on('submit', function(e) {"
                               + "e.preventDefault();"
                               + "$.ajax({ url: $(this).attr('action'),"
                                    + "type: 'PUT',"
                                    + "data: { updatedItem: $(e.target).parent().find('input[name=\"updatedItem\"]').val() },"
                                    + "success: function() { window.location.reload(true); }});"
                            + "});"
                            + "$('form[method=\"delete\"]').on('submit', function(e) {"
                               + "e.preventDefault();"
                               + "$.ajax({ url: $(this).attr('action'),"
                                    + "type: 'DELETE',"
                                    + "success: function() { window.location.reload(true); }});"
                            + "});"
                      + "</script>"
                   + "</body>"
                + "</html>";

            res.writeHead(200, {
                'Content-Length': html.length,
                'Content-Type': 'text/html'
            });
                        
            res.end(html);
        break;

        case 'PUT':
            var pathname = parse(req.url).pathname,
                i = parseInt(pathname.slice(1), 10),
                item = items[i],
                update = '';

            req.on('data', function (chunk) {
                update += chunk;
            });

            req.on('end', function(){
                var newItem = qs.parse(update);
                if(newItem && newItem.updatedItem) {
                    items[i] = newItem.updatedItem;
                }

                res.end();
            });
        break;

        case 'DELETE':
            var pathname = url.parse(req.url).pathname,
                i = parseInt(pathname.slice(1), 10);
            
            items.splice(i, 1);

            res.end();
        break;
    }        
});

server.listen(9000);
