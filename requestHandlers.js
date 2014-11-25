/**
 * Created by jung on 2014-11-25.
 */
var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable"),
    dbHelper = require("./databaseHelper.js");

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "tmp/police.png");
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("tmp/police.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        }
        else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

function join(response, request) {
    console.log("Request handler 'join' was called.");
    if (request.method == 'POST') {

        var body = '';
        request.on('data', function(data) {
            body += data;

            // Too much POST data, kill the connection!
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function() {
            var post = querystring.parse(body);
            var now = new Date();
            var today = now.getUTCFullYear() + "" + (now.getUTCMonth() + 1) + "" + now.getUTCDate();
            post.date = today;

            // console.log('username : ', post.username);
            // console.log('password : ', post.password);
            // console.log('date : ', post.date);
            // use post['blah'], etc.
            response.writeHead(200, "OK", {
                'Content-Type': 'text/plain'
            });
            dbHelper.insertUserInfo(post);
            response.end();
        });
    }
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.join = join;