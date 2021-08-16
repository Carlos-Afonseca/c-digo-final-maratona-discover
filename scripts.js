const Modal = {
    open() {
        //abrir modal
        //remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList.add('active')

    
    },
    close(){
        //fechar o modal
        //remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}
//eu preciso somar as entradas
//depois eu preciso somar as saídas e
//remover das entradas o vlr das saídas
//assim eu terei o total
const Storage = {
    //get = pegar e set = guardar
    get() {
return JSON.parse(localStorage.getItem("dev.finances, transactions")) || []
    },

    set(transactions) {
localStorage.setItem("dev.finances:transactions", JSON.stringify (transactions))
    }

}
const Transaction = {
    all: Storage.get(),
    
    /*[
        {
        
        description: 'Luz',
        amount: -50000,
        date: '29/01/2021',
    }, 
        {
        
        description: 'Website',
        amount: 500000,
        date: '29/01/2021',
    }, 
        {
        
        description: 'Internet',
        amount: -20000,
        date: '29/01/2021',
    },
    ], */
   
    add(transaction){
        Transaction.all.push(transaction)
        
        App.reload()
    },

    remove(index) {

            Transaction.all.splice(index, 1)
            App.reload()
    },
    incomes() {
        let income = 0
        //pegar todas as transacoes
        //verificar se é maior que zero
//transaction.forEach(function(transaction) {})
Transaction.all.forEach(transaction => {
    //se ela for maior que zero
    if (transaction.amount > 0) {
        //somar a uma variavel e retornar a variavel
       // income = income + transaction.amount; ou
       income += transaction.amount;
    }

  
})
        //para cada transacao, somar a uma variavel e retornar a variavel
        return income;
    },
    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
    
    return expense;
},
total () {

    
    return Transaction.incomes() + Transaction.expenses(); 
}

}

//Eu preciso pegar as minhas transaçoes -transactions-


//do meu objeto aqui no javascript
//e colocar lá no Html
//ou seja substituir os dados do html com os dados do Js
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr) 
    },
      innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        /*le-se transaction.amount é positivo, se for entao é receita, senao despesas. */

        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
                        <td class="description">${transaction.description}</td>


                        <td class="${CSSclass}">${amount}</td>
                    

                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Transaction.remove(${index})" src="" alt="">
                        </td>        
                     `
                     return html
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}
const Utils = {
    formatAmount(value) {

/*value = Number(value) * 100
return value  - isso nao deu certo*/
value = value * 100
return Math.round(value)
    },

    formatDate (date) {
        const splittedDate = date.split("-") 
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

        return (signal + value)
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
        description: Form.description.value,
        amount: Form.amount.value,
        date: Form.date.value
        }
    },
    /*formatData() {
        console.log('Formatar os dados')
    },*/
    validateFields() {
        const {description, amount, date} = Form.getValues()

        if(description.trim() === "" ||amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor preencha todos os campos!")
        }
    
    },

    formatValues() {
        let { description, amount, date} = Form.getValues()
        
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {

        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    

    submit(event) {
        event.preventDefault()

        try {//verificar se todas inf. foram preenchidas
            Form.validateFields()
            //formatar dados
           const transaction = Form.formatValues()
            //salvar
        Transaction.add(transaction)
            //apagar dados do firmulario
            Form.clearFields()
            //modal feche
            Modal.close()
            
            //atualizar a aplicacao

        } catch (error) {
             alert(error.message)
        }

      
    }

}


const App = {
    init() {


    Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        Storage.set(Transaction.all)
    },

    reload() {
    DOM.clearTransactions()
    App.init()
    },

}

App.init()


/*
DOM.addTransaction(transactions[0])
DOM.addTransaction(transactions[1])
DOM.addTransaction(transactions[2])

for(let i = 0; i<transaction.length; i++) {
    console.log(i)
}
de outra forma usando forEach, forEach significa:para cada.
*/
