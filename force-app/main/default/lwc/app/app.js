import { LightningElement } from 'lwc';

export default class App extends LightningElement {

    name = "Electra Sx6";
    description = "Brand new Electric scooter";
    category = "Mountain";
    material = "Steel";
    price   = "$2,500";
    pictureUrl = "https://s3-us-west-1.amazonaws.com/sfdc-demo/ebikes/electrax4.jpg";
    ready = "false";

    connectedCallback(){
             setTimeout(()=>{
                this.ready = "true";
             } , 3000)
    }
}