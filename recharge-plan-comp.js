import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax';
import '@polymer/paper-tabs';
/**
 * `recharge-plan-comp`
 * recharge plans using api
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RechargePlanComp extends PolymerElement
{

    constructor()
    {
      super();
      this.tabid= null;  // contains index of array of object selected
      this.plans= null;
      this.arrObj=null;  // array of object of denominationcategory
      this.fetchData=this.fetchData.bind(this);
      this.planData=this.planData.bind(this);
    }

    static get template()
    {
      return html`
        <style>
          :host {
            display: block;
          }
          #Main
          {
              width: 800px;
              margin: 0px auto 0px auto;
              background-color:#c6dafc;
              color:black;
              overflow: auto;
              padding: 10px 10px 10px 10px;
              height: 300px;
              border-style: groove;
          }
          #text {
              margin: 0;
              display: flex;
              height: auto;
              color: white;
          }
          #plan{
            background-color: #00bcd4;
            color: #fff;
            box-shadow: 2px 3px 2px rgba(0, 0, 0, 0.2);
            margin-top: 10px;
          }
          paper-tabs {
              font-family: 'Roboto', 'Noto', sans-serif;
              -webkit-font-smoothing: antialiased;
              width: 100%;
              text-transform: uppercase;
              margin-bottom: 1px;
              background-color: #00bcd4;
              color: #fff;
              box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.2);
          }
          button.btn{
            color: #00bcd4;
            background: #fff;
            box-sizing: border-box;
            border: 2px solid #ffffff; border-radius: 5px;
            -webkit-font-smoothing: auto;font-size: 14px;font-family: 'Nunito', sans-serif;cursor: pointer;  font-weight: 400;
            vertical-align: top !important;
            display: table-cell !important;
            width: 85px; height: 42px;
          }
          span.amt{
            width: 85px;
            display: table-cell !important;
            vertical-align: top !important;
            box-sizing: border-box;
          }
          span.txt{
            padding-left: 15px !important;display:
            table-cell !important;
            display: inline-block;
            font-family: 'mbk_web_font';
            font-style: normal;
            box-sizing: border-box;
          }
          div.divtab{
                padding: 15px !important;
                display: table !important;
                border-bottom: 1px solid #c6dafc;
                color: #ffffff;
                display: inline-block;
                width: 98%;
          }
          p{
                padding-bottom: 5px !important;padding: 0;
                margin: 0;
                display: block;
          }
        </style>
        <div id="Main">
          <div id="text"></div>
          <div id="plan"></div>
        </div>
      `;
    }


    static get properties()
    {
      return {
        prop1: {
          type: String,
          value: 'recharge-plan-comp',
        },
        browseplancategory: {
          type: Number,
        },
        operatoralias: {
          type: String,
        },
        regionalias: {
          type: String,
        },
        denominationcategoryid: {
          type: Number,
        },
      };
    }

    ready()
    {
      super.ready();  // must call this
      this.fetchData();
    }

    fetchData()
    {
      fetch('responseData.json')
      .then( (response)=>response.json() )
      .then( (data)=> {
        let dc=data.DenominationCategory;
        this.arrObj=dc;
        let num=0,output="";
        output+=`<paper-tabs  selected="0" scrollable >`;
        dc.forEach(function(user)   // for array of objects
          {
                  let value=user.CategoryName;
                    output+= `
                      <paper-tab class="tabs" id="${num}"> ${value} </paper-tab>
                    `
                    num++;
          });
          output+=`</paper-tabs>`;
          this.$.text.innerHTML=output;
          var tablist=this.$.text.querySelectorAll('.tabs');
          for (var i = 0, length = tablist.length; i < length; i++) {
            tablist[i].addEventListener('click',e => {this.planData(e)});
          }
          tablist[0].click(); // click element by default
      })
      //this.planData();
    }

    planData(e)
    {
      this.tabid=e.target.getAttribute("id");  // get id of selected div
      this.denominationcategoryid=Object.values(this.arrObj[this.tabid])[0];  // get the category id
      let url="responseDataPlans"+this.denominationcategoryid+'.json';
      fetch(url)
      .then( (response)=>response.json() )
      .then( (data)=> {
        let result= "";
        let pl=data.Plans;
        pl.forEach(function(user)   // for array of objects
          {
            result+=`<div class="divtab"><span class="amt">
                      <button class="btn">&#x20b9; ${user.Amount}</button>
                    </span>
                    <span class="txt">
                    <p>${user.description}</p>
                    <p>${user.Validity}</p>
                    </span></div>
            `;
          });
          this.$.plan.innerHTML=result;
      })
    }

}

window.customElements.define('recharge-plan-comp', RechargePlanComp);
