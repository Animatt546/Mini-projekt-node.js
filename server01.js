var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")
app.use(express.static('static'))

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
});

let czyZalogowano = false

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
});


app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
});
app.post("/loginForm", function (req, res) {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].log == req.body.login)
            if (tab[i].pass == req.body.password) {
                czyZalogowano = true
                res.redirect("/admin")
                return
            }
    }
    res.send("błędne dane")
});
let tab = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, log: "a", pass: "a", wiek: 12, uczen: undefined, plec: "m" },
    { id: 3, log: "b", pass: "b", wiek: 18, uczen: "checked", plec: "k" },
    { id: 4, log: "c", pass: "c", wiek: 19, uczen: undefined, plec: "m" },
    { id: 5, log: "d", pass: "d", wiek: 12, uczen: "checke", plec: "k" },
]
app.post("/registerForm", function (req, res) {
    let czyIstniejeUzytkownik = false
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].log == req.body.login)
            czyIstniejeUzytkownik = true
    }
    if (req.body.login != "" && req.body.password != "" && req.body.plec != undefined) {
        if (czyIstniejeUzytkownik == true)
            res.send("Użytkownik z takim loginem już istnieje")
        else {
            tab.push({ id: tab.length + 1, log: req.body.login, pass: req.body.password, wiek: req.body.wiek, uczen: req.body.uczen, plec: req.body.plec })
            res.send("Witaj " + req.body.login + ", jesteś zarejestrowany.")
        }
    }
    else
        res.send("Wprowadź wszystkie dane")
})



app.get("/admin", function (req, res) {
    if (!czyZalogowano) {
        res.sendFile(path.join(__dirname + "/static/pages/brakdostepu.html"))
        return
    }
    res.sendFile(path.join(__dirname + "/static/pages/admin.html"))
});

app.get("/logout", function (req, res) {
    czyZalogowano = false
    res.redirect("/")
})

let naglowek = "<div><a href='/sort' style='color: white;'>sort</a> <a href='/gender' style='color: white;'>gender</a> <a href='/show' style='color: white;'>show</a></div>"
let tabelaSort, nacisnieteR, nacisnieteM
app.get("/sort", function (req, res) {
    if (!czyZalogowano) {
        res.sendFile(path.join(__dirname + "/static/pages/brakdostepu.html"))
        return
    }
    nacisnieteM = ""
    nacisnieteR = ""
    console.log(req.query.jakPosortowane)
    if (req.query.jakPosortowane == "rosnaco") {
        nacisnieteR = "checked"
        tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        })
        tabelaSort = tabela(["id", "log + pass", "wiek"])
    }
    else if (req.query.jakPosortowane == "malejaco") {
        nacisnieteM = "checked"
        tab.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        })
        tabelaSort = tabela(["id", "log + pass", "wiek"])
    }
    else {
        tabelaSort = tabela(["id", "log + pass", "wiek"])
    }

    res.send("<body style='background-color: rgb(29, 27, 27); font-size: 20px;'>" + naglowek + "<form style='color: white; margin: 10px;' action='/sort' method='GET' onchange='this.submit()'/><input type='radio' name='jakPosortowane' id='rosnaco' value='rosnaco'" + nacisnieteR + ">\
<label for='rosnaco'>rosnąco</label><input type='radio' name='jakPosortowane' id='malejaco' value='malejaco'" + nacisnieteM + "><label for='malejaco'>malejaco</label></form>" + tabelaSort + "</body>")


});

app.get("/gender", function (req, res) {
    if (!czyZalogowano) {
        res.sendFile(path.join(__dirname + "/static/pages/brakdostepu.html"))
        return
    }
    tab.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    })

    tabelaSort = tabela(["id", "plec"], "m") + tabela(["id", "plec"], "k")

    res.send("<body style='background-color: rgb(29, 27, 27); font-size: 20px;'>" + naglowek + tabelaSort + "</body>")
})

app.get("/show", function (req, res) {
    if (!czyZalogowano) {
        res.sendFile(path.join(__dirname + "/static/pages/brakdostepu.html"))
        return
    }

    tab.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    })
    tabelaSort = tabela(["id", "log + pass", "uczen", "wiek", "plec"])
    res.send("<body style='background-color: rgb(29, 27, 27); font-size: 20px;'>" + naglowek + tabelaSort + "</body>")
})

let slownik = {
    plec: "płeć",
    uczen: "uczeń",
    id: "id",
    wiek: "wiek"
}

function tabela(kolumny, plec = null) {
    let zawartoscTabeli = ""
    for (let i = 0; i < tab.length; i++) {
        let zawartoscRzedu = ""
        if (tab[i].plec == plec || plec == null) {
            for (let j = 0; j < kolumny.length; j++) {
                let zawartoscKomorki = ""
                if (kolumny[j] == "log + pass")
                    zawartoscKomorki += "user: " + tab[i].log + " - " + tab[i].pass
                else if (kolumny[j] == "uczen") {
                    if (tab[i].uczen == "checked") {
                        zawartoscKomorki += slownik[kolumny[j]] + ": <input type='checkbox' checked disabled>"
                    }
                    else {
                        zawartoscKomorki += slownik[kolumny[j]] + ": <input type='checkbox' disabled>"
                    }
                }
                else
                    zawartoscKomorki += slownik[kolumny[j]] + ": " + tab[i][kolumny[j]]

                if (tab[i].plec == plec)
                    zawartoscRzedu += '<td style="border: solid 1px yellow; width: 50%;">' + zawartoscKomorki + '</td>'
                else
                    zawartoscRzedu += '<td style="border: solid 1px yellow;">' + zawartoscKomorki + '</td>'
            }
            zawartoscTabeli += '<tr style="color: white;">' + zawartoscRzedu + '</tr>'
        }
    }
    return '<table style="width: 100%; margin-top: 10px; font-size: 20px;">' + zawartoscTabeli + '</table>'
}

//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})