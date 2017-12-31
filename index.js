const digitalocean = require("digitalocean");
const app = require("express")();
const request = require("request");

const client = digitalocean.client("6eb009f7eacc1ad131044440acca3e6860aea48c82371f6f4396cceb63050404");

app.get("/update", (req, res) => {
    let { app, branch = "master" } = req.query;
    client.droplets.list()
    .then((data) => {
        for(let i = 0; i < data.length; i++) {
            if(-1 !== data[i].tags.indexOf("tasks")) {
                const ip = data[i].networks.v4[0].ip_address;
                try {
                    request.get(`http://${ip}:3000/update?app=${app}&branch=${branch}`);
                } catch (ex) {
                    //console.log(ex);
                }
            }
        }
        res.send("done");
        res.end();
    })
    .catch((err) => {
        console.log(err);
    })
});

process.on("uncaughtException", (err) => {
    // do nothing
});

app.listen(3000);