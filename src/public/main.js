const events = {
    connecting: () => {
        window.document.querySelector('tr#search').style.display = 'table-row'
        window.document.querySelector('tr#error').style.display =  'none'
        window.document.querySelector('tr#notFound').style.display = 'none'
    },
    null: () => {
        window.document.querySelector('tr#search').style.display = 'none'
        window.document.querySelector('tr#error').style.display =  'none'
        window.document.querySelector('tr#notFound').style.display = 'table-row'
    },
    error: () => {
        window.document.querySelector('tr#search').style.display = 'none'
        window.document.querySelector('tr#error').style.display =  'table-row'
        window.document.querySelector('tr#notFound').style.display = 'none'
    },
    clear: () => {
        window.document.querySelector('tr#search').style.display = 'none'
        window.document.querySelector('tr#error').style.display =  'none'
        window.document.querySelector('tr#notFound').style.display = 'none'
    }
}
const functions = {
    clearTable: () => {
        var tbody = window.document.querySelector('table tbody')
        if (tbody) tbody.remove()
    },
    createTable: (data) => {
        var table = []

        data.forEach(e => {
            table.push(`<tr class="user"> <td>${e.Id}</td> <td>${e.Nome}</td> <td>${e.Modelo}</td> </tr>`)
        })
        
        window.document.querySelector('table').innerHTML += '<tbody>'+table.join('')+'</tbody>'
    }
}

function query(method, url, params=undefined) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.responseType = 'json'
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response)
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                })
            }
        }
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            })
        }
        xhr.send(params)
    })
}

function queryInTable(url) {
    functions.clearTable()
    events.connecting()
    query('GET', url)
        .then((finded) => {
            if (finded) if (finded.length == 0) return events.null()
            events.clear()
            functions.createTable(finded)
        })
        .catch(err => {
            events.error()
        })
}

const search = {
    name: () => {
        let name = window.document.querySelector('div#search input#Name').value
        if (name.length == 0) return alert('Nada informado no name')
        queryInTable('/api/search/Name?Name='+name)
    },
    id: () => {
        let id = window.document.querySelector('div#search input#Id').value
        if (id.length == 0) return alert('Nada informado no id')
        queryInTable('/api/search/Id?Id='+id)
    }
}

function insert() {
    var user = {
        Nome: document.querySelector('div#insert input#insertName').value,
        Modelo: document.querySelector('div#insert input#insertModelo').value,
        Defeito: document.querySelector('div#insert input#insertDefeito').value,
        Chegada: document.querySelector('div#insert input#insertChegada').value,
        Saida: document.querySelector('div#insert input#insertSaida').value
    }

    for (let e of Object.values(user)) if (e.length == 0) return alert('Todos os elementos de insert devem estar preenchidos')
    
    var params = `Nome=${user['Nome']}&Modelo=${user['Modelo']}&Defeito=${user['Defeito']}&Chegada=${user['Chegada']}&Saida=${user['Saida']}`
    query('POST', '/api/insert/newUser', params)
        .then(e => {
            alert('usuário inserido com sucesso, a página será atualizada')
            window.location.reload()
        })
        .catch(err => {
            alert('Houve um erro ao inserir os dados')
        })
}

window.document.addEventListener('DOMContentLoaded', (e) => queryInTable('/api/search/all'))