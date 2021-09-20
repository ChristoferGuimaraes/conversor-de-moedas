const currencyOne = document.querySelector("#currency-one");
const currencyTwo = document.querySelector("#currency-two");
const currencies = document.querySelector("#currencies-container");
const convertedValue = document.querySelector('#converted-value');
const convertedPrecision = document.querySelector('#conversion-precision')


const URL =
  "https://v6.exchangerate-api.com/v6/4a56e5a40c71793602a7f5ac/latest/USD";

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

const fetchExchangeRate = async () => {
  try {
    const response = await fetch(URL);
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
    const exchangeRateData = await fetchExchangeRate();

    const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')

    currencyOne.innerHTML = getOptions('USD');
    currencyTwo.innerHTML = getOptions('BRL');

    convertedValue.textContent = exchangeRateData.conversion_rates.BRL.toFixed(2);
    convertedPrecision.textContent = `1 USD = ${exchangeRateData.conversion_rates.BRL} BRL`;

}

init()

