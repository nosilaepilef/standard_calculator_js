class CalcController {

  constructor() {
    this._audio = new Audio("../../assets/click.mp3")
    this._audioOnOff = true
    this._lastOperator = ""
    this._lastNumber = ""
    this._operation = []
    this._locale = "pt-BR"
    this._displayCalcEl = document.querySelector("#display")
    this._currentDateEl = document.querySelector("#date")
    this._currentTimeEl = document.querySelector("#time")
    this._currentDate
    this.initialize()
    this.initButtonsEvents()
    this.initKeyboard()
  }

  pasteFromClipboard() {

    document.addEventListener("paste", event => {

     let text =  event.clipboardData.getData("Text")

     this.displayCalc = parseFloat(text)

    })

  }

  copyToClipboard() {

    let input = document.createElement("input")

    input.value = this.displayCalc

    document.body.appendChild(input)

    input.select()

    document.execCommand("Copy")

    input.remove()

    
  }
  

  toggleIconOnOffAudio() {


    document.querySelector(".audioOnOff").addEventListener("click", event => {
        
      this.injectAttributesIntoHTML()      
      
    })
  }

  injectAttributesIntoHTML() {

      const img = document.querySelector(".audioOnOff > img")
      const tooltip = document.querySelector(".audioOnOff")

      if (this._audioOnOff === true) {
        img.setAttribute("src", "./assets/audioOn.svg")
        tooltip.setAttribute("data-tooltip", "Click no botão para ativar o áudio 🔊 ou atalho 'F4'")
      } else {
        img.setAttribute("src", "./assets/audioOff.svg")
        tooltip.setAttribute("data-tooltip", "Click no botão para desativar o áudio 🔈 ou atalho 'F4'")
      }

      this.toggleAudio()

  }

  
  initialize() {

    this.setDisplayDataTime()
    
    setInterval(() => {

      this.setDisplayDataTime()

    }, 1000)


    this.setLastNumberToDisplay()
    this.pasteFromClipboard()
    this.toggleIconOnOffAudio()

  }

  toggleAudio() {

    // this._audioOnOff = (this._audioOnOff) ? false : true método mais detalhado
    // método mais curto
    this._audioOnOff = !this._audioOnOff

  }

  playAudio() {

    if (this._audioOnOff) {

      this._audio.currentTime = 0
      this._audio.play()

    }

  }

  initKeyboard() {

    document.addEventListener("keyup", event => { 
      console.log(event)

      this.playAudio()

      switch (event.key) {

        case "Escape":
            this.acClearAll()
          break;
  
        case "Backspace":
            this.ceClearEntry()
          break;
  
        case "%":
        case "/":
        case "*":
        case "-":
        case "+":
            this.addOperation(event.key)
          break;
  
        case "Enter":
        case "=":
            this.calculate()
          break;
  
        case ".":
        case ",":
          this.addDot()
          break;
  
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
  
            this.addOperation(parseInt(event.key))
          break;

        case "c":
            if (event.ctrlKey) this.copyToClipboard()
          break

        case "F4":
            this.injectAttributesIntoHTML()
          break;
      }

    })

  }


  addEventListenerAll(element, events, functionEvent) {

    events.split(" ").forEach(event => {

      element.addEventListener(event, functionEvent, false)

    })

  }

  acClearAll() {

    this._operation = []
    this._lastNumber = ""
    this._lastOperator = ""

    this.setLastNumberToDisplay()

  }

  ceClearEntry() {

    this._operation.pop()

    this.setLastNumberToDisplay()

  }

  getLastOperation() {

    return this._operation[this._operation.length -1]

  }

  setLastOperation(value) {

    this._operation[this._operation.length -1] = value

  }

  isOperation(value) {

    return (["+", "-", "*", "%", "/"].indexOf(value) > -1)

  }

  pushOperation(value) {

    this._operation.push(value)

    if (this._operation.length > 3) {

      this.calculate()

    }

  }

  getResult() {

    try {

      return eval(this._operation.join(""))

    } catch(e) {

      setTimeout(() => {
        
        this.setError()

      }, 1);

    }

  }

  calculate() {

    let last = ""

    this._lastOperator = this.getLastItem()

    if (this._operation.length < 3) {

      let firstItem = this._operation[0]
      this._operation = [firstItem, this._lastOperator, this._lastNumber]

    }

    if (this._operation.length > 3) {

      last = this._operation.pop()

      this._lastNumber = this.getResult()

    } else if(this._operation.length == 3) {

      this._lastNumber = this.getLastItem(false)

    }

    let result = this.getResult()

    if (last == "%") {

      result /= 100

      this._operation = [result]

    } else {      

      this._operation = [result]

      if (last) this._operation.push(last)

    }

    

    this.setLastNumberToDisplay()

  }

  getLastItem(isOperator = true) {

    let lastItem

    for (let i = this._operation.length -1; i >= 0; i--) {
      
      if (this.isOperation(this._operation[i]) == isOperator) {

        lastItem = this._operation[i]
        break

      }

    }

    if (!lastItem) {

      lastItem = (isOperator) ? this._lastOperator : this._lastNumber

    }

    return lastItem
    
  }

  setLastNumberToDisplay() {

    let lastNumber = this.getLastItem(false)

    if (!lastNumber) lastNumber = 0
    
    this.displayCalc = lastNumber

  }

  addOperation(value) {
    
    if (isNaN(this.getLastOperation())) {
      
      if (this.isOperation(value)) {

        this.setLastOperation(value)

      } else {

        this.pushOperation(value)

        this.setLastNumberToDisplay()

      }

    } else {

        if (this.isOperation(value)) {

          this.pushOperation(value)

        } else {

          let newValue = this.getLastOperation().toString() + value.toString()
          this.setLastOperation(newValue)

          this.setLastNumberToDisplay()

        }

      
    }

  }

  setError() {

    this.displayCalc = "ERROR"

  }

  addDot() {

    
    let lastOperation = this.getLastOperation()

    if (typeof lastOperation === "string" && lastOperation.split("").indexOf(".") > -1) return

    if (this.isOperation(lastOperation) || !lastOperation) {

      this.pushOperation("0.")

    } else {

      this.setLastOperation(lastOperation.toString() + ".")

    }

    this.setLastNumberToDisplay()

  }

  executeButton(value) {

    this.playAudio()

    switch (value) {
      
      case "ac":
          this.acClearAll()
        break;

      case "ce":
          this.ceClearEntry()
        break;

      case "porcentagem":
          this.addOperation("%")
        break;

      case "divisao":
          this.addOperation("/")
        break;

      case "multiplicacao":
          this.addOperation("*")
        break;

      case "subtracao":
          this.addOperation("-")
        break;

      case "soma":
          this.addOperation("+")
        break;

      case "resultado":
          this.calculate()
        break;

      case "ponto":
        this.addDot()
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":

          this.addOperation(parseInt(value))
        break;
    
      default:
          this.setError()
        break;
    }


  }

  initButtonsEvents() {

    let buttons = document.querySelectorAll("#buttons > rect, #buttons > path")


    buttons.forEach((btn, index) => {

      this.addEventListenerAll(btn,"click drag", event => {

        const [, secondClass] = btn.className.baseVal.split(" ")

        let textButton = secondClass.replace("btn-", "")

        this.executeButton(textButton)
        
      })
    })

  }

  setDisplayDataTime() {

    this.displayDate = this.currentDate.toLocaleDateString(this._locale)
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale)

  }

  
  get displayTime() {
    return this._currentTimeEl.innerHTML
  }

  set displayTime(value) {
    return this._currentTimeEl.innerHTML = value
  }

  get displayDate() {
    return this._currentDateEl.innerHTML
  }

  set displayDate(value) {

    return this._currentDateEl.innerHTML = value
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML
  }

  set displayCalc(value) {

    if (value.toString().length > 9) {
      this.setError()
      return false
    }

    this._displayCalcEl.innerHTML = value
  }

  get currentDate() {
    return new Date()
  }

  set currentDate(value) {
    this._currentDate = value
  }



}

export { CalcController }