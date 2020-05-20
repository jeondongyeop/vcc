const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(
    bodyParser.raw({ type: 'application/x-www-form-urlencoded' }),
    function (req, res, next) {
        try {
            req.body = JSON.parse(req.body)
        } catch (err) {
            req.body = require('qs').parse(req.body.toString());
        }
        next();
    }
);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

app.post('/list', (req, res) => {
    const maxListCount = 110;

    const count = req.body.count;
    const paging = req.body.paging;
    const response = {
        maxPaging:maxListCount%count == 0 ? (maxListCount / count) : parseInt(maxListCount / count) + 1,
        currentPaging:paging,
        list : [],
    };

    const startCount = count*(paging-1)+1;
    for(let i=startCount;i < startCount+count; ++i) {
        if(i <= maxListCount) {
            response.list.push(i);
        }else {
            break;
        }
        
    };
    res.send(response);
});



app. listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`);
})