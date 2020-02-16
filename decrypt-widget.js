import config from './config.js';
import fetchData from './fetchData.js';

class DecryptWidget extends HTMLElement {
  constructor() {
    super();
    this.dataSet = null;
    this.currentData = null;
    this.field = null;
    this.filters = [];
    this.resultElement = null;
  }

  connectedCallback(){
    this.innerHTML = `
      <style>.decrypt-algo.hidden{ display: none; }</style>
      <select class="dataset">
        <option value="" disabled selected>- données -</option>
        ${config.datasets.map(d => `<option>${d}</option>`)}
      </select>
      <div class="field" style="display: inline;"></div>
      <label><input class="filter-letters" type="checkbox"> Lettres seulement</label>
      <div class="raw-data"></div>
      <select class="decrypt-algo hidden">
      <option value="" disabled selected>- algorithme -</option>
        ${Object.entries(config.decrypt).map(([tagName, description]) => `<option value="${tagName}">${description}</option>`)}
      </select>
      <div class="result"></div>
    `;

    this.querySelector('.dataset').addEventListener('change', async () => {
      this.querySelector('.raw-data').innerHTML = '';
      this.dataSet = await fetch(this.querySelector('.dataset').value + '.json').then(res => res.json());
      this.field = null;
      if (typeof this.dataSet === 'object'){
        this.querySelector('.field').innerHTML = `
          <select class="field-selector" data-rank="1">
            <option value="" disabled selected>- champ 1 -</option>
            ${Object.entries(this.dataSet).map(([key, value]) => `<option>${key}</option>`)}
          </select>
        `;
        this.renderResult();
      }
    });

    this.querySelector('.field').addEventListener('change', (e) => {
      this.field = null;
      const selectedRank = parseInt(e.target.dataset.rank);
      let selectedFields = [];
      Array.from(this.querySelectorAll('.field-selector')).map(selector => {
        if (parseInt(selector.dataset.rank) <= selectedRank){
          selectedFields.push(selector.value);
        } else {
          selector.remove();
        }
      });
      this.currentData = selectedFields.reduce((carry, field) => carry[field], this.dataSet);
      if (typeof this.currentData === 'object'){
        this.querySelector('.raw-data').innerHTML = '';
        this.querySelector('.field').insertAdjacentHTML('beforeend', `
          <select class="field-selector" data-rank="${selectedRank + 1}">
            <option value="" disabled selected>- champ ${selectedRank + 1} -</option>
            ${Object.entries(this.currentData).map(([key, value]) => `<option>${key}</option>`)}
          </select>
        `);
      } else {
        this.querySelector('.raw-data').innerHTML = this.currentData;
        this.field = selectedFields.join('.');
        this.querySelector('.decrypt-algo').classList.remove('hidden');
      }
      this.renderResult();
    });

    this.querySelector('.filter-letters').addEventListener('change', e => {
      if (e.target.checked){
        this.filters = ['letters'];
      } else {
        this.filters = [];
      }
      this.renderResult();
    });

    this.querySelector('.decrypt-algo').addEventListener('change', () => {
      this.resultElement = document.createElement(this.querySelector('.decrypt-algo').value);
      this.renderResult(true);
    });
  }

  renderResult(changeWidget = false){
    if (changeWidget){
      this.querySelector('.result').innerHTML = '';
      this.querySelector('.result').append(this.resultElement);
    }
    if (this.resultElement !== null){
      this.resultElement.dataset.field = this.field ?? '';
      this.resultElement.dataset.dataset = this.querySelector('.dataset').value;
      this.resultElement.dataset.filters = this.filters.join(',');
    }
  }
}

customElements.define('decrypt-widget', DecryptWidget);
