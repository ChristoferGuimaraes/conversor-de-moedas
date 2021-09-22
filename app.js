const currencyOne = document.querySelector("#currency-one");
const currencyTwo = document.querySelector("#currency-two");
const currencies = document.querySelector("#currencies-container");
const convertedValue = document.querySelector('#converted-value');
const convertedPrecision = document.querySelector('#conversion-precision');
const currencyTimesOne = document.querySelector('#currency-one-times');
const currencySwap = document.querySelector('#currency-swap');
let currencyOneT = currencyOne;
let currencyTwoT = currencyTwo;

let internalExchangeRate = {}


const getUrl = currency =>
  `https://v6.exchangerate-api.com/v6/4a56e5a40c71793602a7f5ac/latest/${currency}`;

const getErrorMessage = (errorType) =>
  ({
    "unsupported-code": "Está moeda não existe em nosso banco de dados.",
    "malformed-request":
      "O endpoint do seu request precisa seguir a fomatação correta.",
    "invalid-key": "A chave da API não é válida.",
    "inactive-account": "Seu endereço de e-mail não foi confirmado",
    "quota-reached":
      "Sua conta alcançou o limite de requests permitido em seu plano atual.",
    "not-available-on-plan": "Seu plano atual não permite este tipo de request",
  }[errorType] || "Não foi possível obter as informações");

const fetchExchangeRate = async url => {
  
    try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(
        "Sua conexão falhou. Não foi possível obter as informações. "
      );
    }
    const exchangeRateData = await response.json();

    if (exchangeRateData.result === "error") {
      throw new Error(getErrorMessage(exchangeRateData["error-type"]));
    }
    return exchangeRateData;

} catch (err) {

    const div = document.createElement('div');
    const button = document.createElement('span');

    div.textContent = err.message;
    div.classList.add('alert');
    div.setAttribute('role', 'alert');
    
    button.textContent = 'x';
    button.classList.add('btn-close');
    button.setAttribute('aria-label', 'Close');
    
    button.addEventListener('click', () => {
        div.remove()
    })

    div.appendChild(button);
    currencies.insertAdjacentElement('afterend', div);

  }
};

const init = async () => {

    internalExchangeRate = { ...(await fetchExchangeRate(getUrl('USD'))) };

    const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')

    currencyOne.innerHTML = getOptions('USD');
    currencyTwo.innerHTML = getOptions('BRL');

    convertedValue.textContent = `${internalExchangeRate.conversion_rates.BRL.toFixed(2)} BRL`;
    convertedPrecision.textContent = `1 ${currencyOne.value} = ${internalExchangeRate.conversion_rates.BRL} BRL`;

}

currencyTimesOne.addEventListener('input', e  => {
    convertedValue.textContent = `${(e.target.value * internalExchangeRate.conversion_rates[currencyTwo.value]).toFixed(2)} ${currencyTwo.value}`;
     
});

currencyTwo.addEventListener('input', e => {
    const currencyTwoValue = internalExchangeRate.conversion_rates[e.target.value];

    convertedValue.textContent = `${(currencyTimesOne.value * currencyTwoValue).toFixed(2)} ${currencyTwo.value}`;
    convertedPrecision.textContent = `1 ${currencyOne.value} = ${currencyTwoValue} ${currencyTwo.value}`

})

currencyOne.addEventListener('input', async e => {
    
    internalExchangeRate = { ...(await fetchExchangeRate(getUrl(e.target.value))) };

    convertedValue.textContent = `${(currencyTimesOne.value * internalExchangeRate.conversion_rates[currencyTwo.value]).toFixed(2)} ${currencyTwo.value}`;
    convertedPrecision.textContent = `1 ${currencyOne.value} = ${internalExchangeRate.conversion_rates[currencyTwo.value]} ${currencyTwo.value}`

})

currencySwap.addEventListener('click', async () => {
    
    internalExchangeRate = { ...(await fetchExchangeRate(getUrl(`${currencyTwoT.value}`))) };

    const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')
    
    currencyOneT.innerHTML = getOptions(currencyOneT.value);
    currencyTwoT.innerHTML = getOptions(currencyTwoT.value);

    [ currencyOneT.value, currencyTwoT.value ] = [ currencyTwoT.value, currencyOneT.value ];

    convertedValue.textContent = `${(currencyTimesOne.value * internalExchangeRate.conversion_rates[currencyTwoT.value]).toFixed(2)} ${currencyTwoT.value}`;
    convertedPrecision.textContent = `1 ${currencyOneT.value} = ${internalExchangeRate.conversion_rates[currencyTwoT.value]} ${currencyTwoT.value}`

})

init();

